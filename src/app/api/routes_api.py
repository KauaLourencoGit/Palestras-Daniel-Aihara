from typing import List, Optional
from fastapi import APIRouter, Depends, Request, HTTPException, status, Response
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.core.security import (
    verify_password, create_session_token, check_login_attempts,
    record_login_failure, clear_login_failures
)
from app.domain.models import Usuario, StatusSolicitacao
from app.domain.schemas import (
    SolicitacaoCreate, SolicitacaoResponse, PalestraTemaResponse,
    SolicitacaoTransitarAction, EventoResponse
)
from app.domain.state_machine import ValidacaoRegraNegocioException, TransicaoInvalidaException
from app.services.solicitacao_service import SolicitacaoService
from app.services.tema_service import TemaService
from app.web.dependencies import get_current_admin

router = APIRouter(prefix="/api")


# -------------------------------------------------------------
# 1. API PÚBLICA
# -------------------------------------------------------------

@router.get("/publico/temas", response_model=List[PalestraTemaResponse])
def api_listar_temas(db: Session = Depends(get_db)):
    """Lista catálogo de palestras ativas na ordem configurada (RF-03, RN-18)."""
    return TemaService.listar_ativos(db)


@router.get("/publico/temas/{slug}", response_model=PalestraTemaResponse)
def api_obter_tema(slug: str, db: Session = Depends(get_db)):
    """Obtém detalhes de um tema específico (RF-04)."""
    tema = TemaService.obter_por_slug(db, slug)
    if not tema:
        raise HTTPException(status_code=404, detail="Tema de palestra não encontrado.")
    return tema


@router.post("/publico/solicitacoes")
def api_criar_solicitacao(
    dados: SolicitacaoCreate,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    Submete uma nova solicitação de palestra (RF-09, RF-10, RF-11, RN-01, RN-16).
    Retorna 201 para novo registro ou 200 caso detectada duplicidade em 24h.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"
    # Considera cabeçalho X-Forwarded-For em proxies reversos futuros (Railway/Render)
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()

    try:
        solicitacao, is_duplicada = SolicitacaoService.criar_solicitacao(
            db=db,
            dados=dados,
            ip_cliente=client_ip
        )
    except ValidacaoRegraNegocioException as e:
        if e.codigo == "MUITAS_TENTATIVAS":
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=e.mensagem)
        elif e.codigo == "SPAM_DETECTADO":
            # Silencioso
            return {"protocolo": "PAL-SPAM", "mensagem": "Recebida."}
        else:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=e.mensagem)

    if is_duplicada:
        return {
            "protocolo": solicitacao.protocolo,
            "status": solicitacao.status,
            "duplicada": True,
            "mensagem": f"Já recebemos este pedido recentemente. Protocolo: {solicitacao.protocolo}."
        }

    response.status_code = status.HTTP_201_CREATED
    return {
        "protocolo": solicitacao.protocolo,
        "status": solicitacao.status,
        "duplicada": False,
        "mensagem": f"Recebemos sua solicitação! Protocolo {solicitacao.protocolo}. O Daniel vai analisar e responder pelo e-mail informado. A data só fica garantida depois da confirmação."
    }


# -------------------------------------------------------------
# 2. AUTENTICAÇÃO
# -------------------------------------------------------------

class LoginRequest(BaseModel):
    email: EmailStr
    senha: str


@router.post("/auth/login")
def api_login(
    payload: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """Autentica o administrador Daniel (RF-14, RNF-05, RNF-07)."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    identificador = f"{payload.email.lower()}:{client_ip}"

    pode_tentar, minutos_restantes = check_login_attempts(identificador)
    if not pode_tentar:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Muitas tentativas incorretas. Tente novamente em {minutos_restantes} minuto(s)."
        )

    user = db.query(Usuario).filter(Usuario.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.senha, user.senha_hash):
        record_login_failure(identificador)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos."
        )

    clear_login_failures(identificador)
    token = create_session_token(user.id, user.email)

    # Define cookie HTTP-only seguro (RNF-06)
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.ENVIRONMENT != "development",
        samesite="lax",
        max_age=settings.SESSION_EXPIRE_HOURS * 3600
    )

    return {"mensagem": "Login efetuado com sucesso.", "usuario": {"id": user.id, "nome": user.nome, "email": user.email}}


@router.post("/auth/logout")
def api_logout(response: Response):
    """Encerra a sessão do painel removendo o cookie."""
    response.delete_cookie(key=settings.SESSION_COOKIE_NAME)
    return {"mensagem": "Logout realizado com sucesso."}


# -------------------------------------------------------------
# 3. GESTÃO DE SOLICITAÇÕES (ADMIN)
# -------------------------------------------------------------

@router.get("/solicitacoes")
def api_listar_solicitacoes(
    status: Optional[str] = None,
    busca: Optional[str] = None,
    ordem: str = "criado_em_desc",
    db: Session = Depends(get_db),
    admin: Usuario = Depends(get_current_admin)
):
    """Lista solicitações do painel com filtros e contadores (RF-15, RF-21)."""
    solicitacoes, totais = SolicitacaoService.listar_solicitacoes(
        db=db,
        status_filtro=status,
        busca=busca,
        ordem=ordem
    )
    return {
        "totais": totais,
        "solicitacoes": [SolicitacaoResponse.model_validate(s) for s in solicitacoes]
    }


@router.get("/solicitacoes/{solicitacao_id}")
def api_obter_solicitacao(
    solicitacao_id: int,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(get_current_admin)
):
    """Retorna detalhes completos de uma solicitação (RF-16)."""
    s = SolicitacaoService.obter_por_id(db, solicitacao_id)
    if not s:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada.")
    return SolicitacaoResponse.model_validate(s)


@router.get("/solicitacoes/{solicitacao_id}/historico", response_model=List[EventoResponse])
def api_obter_historico(
    solicitacao_id: int,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(get_current_admin)
):
    """Retorna o histórico imutável de eventos da solicitação (RF-19, RN-12)."""
    s = SolicitacaoService.obter_por_id(db, solicitacao_id)
    if not s:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada.")
    return [EventoResponse.model_validate(e) for e in s.historico]


@router.post("/solicitacoes/{solicitacao_id}/acoes/{acao}")
def api_executar_acao_solicitacao(
    solicitacao_id: int,
    acao: str,
    payload: SolicitacaoTransitarAction,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(get_current_admin)
):
    """
    Executa a transição de status no funil administrativo (RF-17, RN-03, RN-09, RN-10, RN-13).
    """
    if payload.acao.lower() != acao.lower():
        raise HTTPException(status_code=400, detail="Ação informada no corpo difere da rota.")

    try:
        s = SolicitacaoService.executar_acao_status(
            db=db,
            solicitacao_id=solicitacao_id,
            versao_informada=payload.versao,
            acao=acao.lower(),
            motivo=payload.motivo,
            autor=admin.nome
        )
        return {
            "id": s.id,
            "protocolo": s.protocolo,
            "status": s.status,
            "versao": s.versao,
            "mensagem": f"Solicitação atualizada para status '{s.status}' com sucesso."
        }
    except ValidacaoRegraNegocioException as e:
        if e.codigo == "NAO_ENCONTRADO":
            raise HTTPException(status_code=404, detail=e.mensagem)
        elif e.codigo == "VERSAO_DESATUALIZADA":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"codigo": "VERSAO_DESATUALIZADA", "mensagem": e.mensagem})
        elif e.codigo in ("MOTIVO_OBRIGATORIO", "DATA_FUTURA"):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"codigo": e.codigo, "mensagem": e.mensagem})
        else:
            raise HTTPException(status_code=400, detail={"codigo": e.codigo, "mensagem": e.mensagem})
    except TransicaoInvalidaException as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"codigo": "TRANSICAO_INVALIDA", "mensagem": str(e)}
        )
