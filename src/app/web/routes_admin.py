from typing import Optional
from fastapi import APIRouter, Request, Depends, Form, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import os

from app.core.database import get_db
from app.core.config import settings
from app.core.security import (
    verify_password, create_session_token, verify_session_token,
    check_login_attempts, record_login_failure, clear_login_failures
)
from app.domain.models import Usuario
from app.domain.state_machine import obter_acoes_disponiveis, ValidacaoRegraNegocioException, TransicaoInvalidaException
from app.services.solicitacao_service import SolicitacaoService
from app.web.dependencies import get_current_admin

router = APIRouter(prefix="/admin")

TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


@router.get("/login", response_class=HTMLResponse)
def page_login(request: Request, next: Optional[str] = None):
    """Tela de login administrativo (RF-14)."""
    # Se já estiver com sessão válida, vai direto para o painel
    cookie = request.cookies.get(settings.SESSION_COOKIE_NAME)
    if cookie:
        valido, _, _ = verify_session_token(cookie)
        if valido:
            return RedirectResponse(url="/admin", status_code=status.HTTP_302_FOUND)

    return templates.TemplateResponse(
        request=request,
        name="admin/login.html",
        context={"erro": None, "next_url": next or "/admin"}
    )


@router.post("/login", response_class=HTMLResponse)
def post_login(
    request: Request,
    email: str = Form(""),
    senha: str = Form(""),
    next: str = Form("/admin"),
    db: Session = Depends(get_db)
):
    """Processa autenticação e proteção contra ataques de força bruta (RF-14, RNF-07)."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    identificador = f"{email.lower().strip()}:{client_ip}"

    pode_tentar, minutos_restantes = check_login_attempts(identificador)
    if not pode_tentar:
        return templates.TemplateResponse(
            request=request,
            name="admin/login.html",
            context={
                "erro": f"Muitas tentativas incorretas. Acesso bloqueado por segurança. Tente novamente em {minutos_restantes} minuto(s).",
                "next_url": next
            },
            status_code=429
        )

    user = db.query(Usuario).filter(Usuario.email == email.lower().strip()).first()
    if not user or not verify_password(senha, user.senha_hash):
        record_login_failure(identificador)
        return templates.TemplateResponse(
            request=request,
            name="admin/login.html",
            context={
                "erro": "E-mail ou senha inválidos. Por favor, confira os dados digitados.",
                "next_url": next
            },
            status_code=401
        )

    clear_login_failures(identificador)
    token = create_session_token(user.id, user.email)

    redirect_url = next if next and next.startswith("/admin") else "/admin"
    response = RedirectResponse(url=redirect_url, status_code=status.HTTP_303_SEE_OTHER)

    # Cookie HTTP-only com proteção de segurança (RNF-06)
    response.set_cookie(
        key=settings.SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.ENVIRONMENT != "development",
        samesite="lax",
        max_age=settings.SESSION_EXPIRE_HOURS * 3600
    )
    return response


@router.get("/logout")
def page_logout():
    """Encerra a sessão do administrador."""
    response = RedirectResponse(url="/admin/login", status_code=status.HTTP_302_FOUND)
    response.delete_cookie(key=settings.SESSION_COOKIE_NAME)
    return response


@router.get("", response_class=HTMLResponse)
@router.get("/solicitacoes", response_class=HTMLResponse)
def page_dashboard(
    request: Request,
    status: Optional[str] = "ABERTAS",
    busca: Optional[str] = None,
    ordem: str = "criado_em_desc",
    sucesso: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(get_current_admin)
):
    """Dashboard de solicitações com filtros, contadores e busca (US-06, RF-15, RF-21)."""
    solicitacoes, totais = SolicitacaoService.listar_solicitacoes(
        db=db,
        status_filtro=status,
        busca=busca,
        ordem=ordem
    )

    return templates.TemplateResponse(
        request=request,
        name="admin/dashboard.html",
        context={
            "admin": admin,
            "solicitacoes": solicitacoes,
            "totais": totais,
            "status_ativo": status,
            "busca": busca,
            "ordem": ordem,
            "msg_sucesso": sucesso
        }
    )


@router.get("/solicitacoes/{solicitacao_id}", response_class=HTMLResponse)
def page_solicitacao_detalhe(
    solicitacao_id: int,
    request: Request,
    sucesso: Optional[str] = None,
    erro: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: Usuario = Depends(get_current_admin)
):
    """Exibe detalhe completo, histórico imutável e ações permitidas (US-06, US-09, RF-16, RF-19)."""
    solicitacao = SolicitacaoService.obter_por_id(db, solicitacao_id)
    if not solicitacao:
        raise HTTPException(status_code=404, detail="Solicitação não encontrada.")

    acoes = obter_acoes_disponiveis(solicitacao.status, solicitacao.data_desejada)

    return templates.TemplateResponse(
        request=request,
        name="admin/solicitacao_detalhe.html",
        context={
            "admin": admin,
            "solicitacao": solicitacao,
            "acoes": acoes,
            "msg_sucesso": sucesso,
            "erro": erro
        }
    )


@router.post("/solicitacoes/{solicitacao_id}/acao")
def post_solicitacao_acao(
    solicitacao_id: int,
    versao: int = Form(...),
    acao: str = Form(...),
    motivo: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    admin: Usuario = Depends(get_current_admin)
):
    """Executa a transição de status com lock otimista e registro de histórico (RN-03, RN-09, RN-10, RN-13)."""
    try:
        solicitacao = SolicitacaoService.executar_acao_status(
            db=db,
            solicitacao_id=solicitacao_id,
            versao_informada=versao,
            acao=acao.lower(),
            motivo=motivo,
            autor=admin.nome
        )
        return RedirectResponse(
            url=f"/admin/solicitacoes/{solicitacao_id}?sucesso=Status atualizado para '{solicitacao.status}' com sucesso!",
            status_code=status.HTTP_303_SEE_OTHER
        )
    except ValidacaoRegraNegocioException as e:
        return RedirectResponse(
            url=f"/admin/solicitacoes/{solicitacao_id}?erro={e.mensagem}",
            status_code=status.HTTP_303_SEE_OTHER
        )
    except TransicaoInvalidaException as e:
        return RedirectResponse(
            url=f"/admin/solicitacoes/{solicitacao_id}?erro={str(e)}",
            status_code=status.HTTP_303_SEE_OTHER
        )
