from datetime import date, timedelta
from typing import Optional
from fastapi import APIRouter, Request, Depends, Form, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import os

from app.core.database import get_db
from app.core.config import settings
from app.services.tema_service import TemaService
from app.services.content_service import ContentService
from app.services.solicitacao_service import SolicitacaoService
from app.domain.schemas import SolicitacaoCreate
from app.domain.state_machine import ValidacaoRegraNegocioException
from pydantic import ValidationError

router = APIRouter()

TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


@router.get("/", response_class=HTMLResponse)
def page_home(request: Request, db: Session = Depends(get_db)):
    """Página inicial do site profissional (RF-01, US-01)."""
    temas = TemaService.listar_ativos(db)
    artigos = ContentService.listar_artigos()[:3]  # 3 artigos mais recentes
    return templates.TemplateResponse(
        request=request,
        name="public/index.html",
        context={"temas": temas, "artigos": artigos}
    )


@router.get("/temas", response_class=HTMLResponse)
def page_temas(request: Request, db: Session = Depends(get_db)):
    """Catálogo completo de palestras (RF-03, US-03)."""
    temas = TemaService.listar_ativos(db)
    return templates.TemplateResponse(
        request=request,
        name="public/temas.html",
        context={"temas": temas}
    )


@router.get("/temas/{slug}", response_class=HTMLResponse)
def page_tema_detalhe(slug: str, request: Request, db: Session = Depends(get_db)):
    """Página de detalhes da palestra (RF-04, US-03)."""
    tema = TemaService.obter_por_slug(db, slug)
    if not tema:
        raise HTTPException(status_code=404, detail="Tema não encontrado.")
    return templates.TemplateResponse(
        request=request,
        name="public/tema_detalhe.html",
        context={"tema": tema}
    )


@router.get("/solicitar", response_class=HTMLResponse)
def page_solicitar(request: Request, tema: Optional[int] = None, db: Session = Depends(get_db)):
    """Formulário de solicitação de palestra (RF-09, US-04)."""
    temas = TemaService.listar_ativos(db)
    hoje = date.today()
    min_data = hoje + timedelta(days=settings.ANTECEDENCIA_MINIMA_DIAS)

    return templates.TemplateResponse(
        request=request,
        name="public/solicitar.html",
        context={
            "temas": temas,
            "tema_selecionado_id": tema,
            "form": {"tema_id": tema} if tema else {},
            "erros": {},
            "erro_geral": None,
            "min_data_str": min_data.strftime("%d/%m/%Y"),
            "min_data_iso": min_data.strftime("%Y-%m-%d")
        }
    )


@router.post("/solicitar", response_class=HTMLResponse)
def post_solicitar(
    request: Request,
    organizacao: str = Form(""),
    nome_contato: str = Form(""),
    email: str = Form(""),
    telefone: Optional[str] = Form(None),
    data_desejada: str = Form(""),
    data_alternativa: Optional[str] = Form(None),
    cidade: str = Form(""),
    estado: str = Form(""),
    formato: str = Form("PRESENCIAL"),
    perfil_publico: str = Form(""),
    publico_estimado: Optional[str] = Form(None),
    tema_id: Optional[str] = Form(None),
    mensagem: Optional[str] = Form(None),
    consentimento: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Processa o formulário web com validação de campos e preservação de valores (RNF-07)."""
    temas = TemaService.listar_ativos(db)
    hoje = date.today()
    min_data = hoje + timedelta(days=settings.ANTECEDENCIA_MINIMA_DIAS)

    form_data = {
        "organizacao": organizacao,
        "nome_contato": nome_contato,
        "email": email,
        "telefone": telefone,
        "data_desejada": data_desejada,
        "data_alternativa": data_alternativa,
        "cidade": cidade,
        "estado": estado,
        "formato": formato,
        "perfil_publico": perfil_publico,
        "publico_estimado": publico_estimado,
        "tema_id": tema_id,
        "mensagem": mensagem,
        "consentimento": consentimento == "true",
        "website": website
    }

    erros = {}
    erro_geral = None

    # Tenta converter os tipos para Pydantic
    try:
        data_desejada_parsed = None
        if data_desejada:
            try:
                data_desejada_parsed = date.fromisoformat(data_desejada)
            except ValueError:
                erros["data_desejada"] = "Informe uma data válida no formato aaaa-mm-dd."
        else:
            erros["data_desejada"] = "A data desejada é obrigatória."

        data_alternativa_parsed = None
        if data_alternativa and data_alternativa.strip():
            try:
                data_alternativa_parsed = date.fromisoformat(data_alternativa)
            except ValueError:
                erros["data_alternativa"] = "Informe uma data alternativa válida."

        publico_est_int = None
        if publico_estimado and publico_estimado.strip():
            try:
                publico_est_int = int(publico_estimado)
            except ValueError:
                erros["publico_estimado"] = "O público estimado deve ser um número inteiro."

        tema_id_int = None
        if tema_id and tema_id.strip():
            try:
                tema_id_int = int(tema_id)
            except ValueError:
                pass

        if not erros:
            schema_data = SolicitacaoCreate(
                organizacao=organizacao,
                nome_contato=nome_contato,
                email=email,
                telefone=telefone,
                data_desejada=data_desejada_parsed,
                data_alternativa=data_alternativa_parsed,
                cidade=cidade,
                estado=estado,
                formato=formato,
                perfil_publico=perfil_publico,
                publico_estimado=publico_est_int,
                tema_id=tema_id_int,
                mensagem=mensagem,
                consentimento=consentimento == "true",
                website=website
            )

            client_ip = request.client.host if request.client else "127.0.0.1"
            forwarded = request.headers.get("x-forwarded-for")
            if forwarded:
                client_ip = forwarded.split(",")[0].strip()

            solicitacao, is_duplicada = SolicitacaoService.criar_solicitacao(
                db=db,
                dados=schema_data,
                ip_cliente=client_ip
            )

            # Redireciona com sucesso para a tela de confirmação (RF-10)
            url_confirmacao = f"/confirmacao/{solicitacao.protocolo}"
            if is_duplicada:
                url_confirmacao += "?duplicada=1"
            return RedirectResponse(url=url_confirmacao, status_code=status.HTTP_303_SEE_OTHER)

    except ValidationError as ve:
        for err in ve.errors():
            campo = err["loc"][0]
            msg = err["msg"].replace("Value error, ", "")
            erros[str(campo)] = msg
    except ValidacaoRegraNegocioException as vre:
        if vre.codigo == "MUITAS_TENTATIVAS":
            erro_geral = "Muitas tentativas em pouco tempo deste endereço. Tente novamente mais tarde."
        elif vre.codigo == "SPAM_DETECTADO":
            erro_geral = "Erro de validação. Por favor verifique os campos preenchidos."
        else:
            erro_geral = vre.mensagem

    return templates.TemplateResponse(
        request=request,
        name="public/solicitar.html",
        context={
            "temas": temas,
            "tema_selecionado_id": tema_id,
            "form": form_data,
            "erros": erros,
            "erro_geral": erro_geral,
            "min_data_str": min_data.strftime("%d/%m/%Y"),
            "min_data_iso": min_data.strftime("%Y-%m-%d")
        },
        status_code=422 if (erros or erro_geral) else 200
    )


@router.get("/confirmacao/{protocolo}", response_class=HTMLResponse)
def page_confirmacao(protocolo: str, request: Request, duplicada: Optional[str] = None, db: Session = Depends(get_db)):
    """Exibe confirmação de recebimento com o protocolo e avisos (RF-10, T06)."""
    solicitacao = SolicitacaoService.obter_por_protocolo(db, protocolo)
    if not solicitacao:
        raise HTTPException(status_code=404, detail="Protocolo não localizado.")
    return templates.TemplateResponse(
        request=request,
        name="public/confirmacao.html",
        context={
            "solicitacao": solicitacao,
            "is_duplicada": duplicada == "1"
        }
    )


@router.get("/conteudos", response_class=HTMLResponse)
def page_conteudos(request: Request):
    """Lista de conteúdos de educação financeira em Markdown (RF-05, US-02)."""
    artigos = ContentService.listar_artigos()
    return templates.TemplateResponse(
        request=request,
        name="public/conteudos.html",
        context={"artigos": artigos}
    )


@router.get("/conteudos/{slug}", response_class=HTMLResponse)
def page_conteudo_detalhe(slug: str, request: Request):
    """Leitura de artigo em Markdown (RF-05, US-02)."""
    artigo = ContentService.obter_artigo(slug)
    if not artigo:
        raise HTTPException(status_code=404, detail="Artigo não encontrado ou em rascunho.")
    return templates.TemplateResponse(
        request=request,
        name="public/conteudo_detalhe.html",
        context={"artigo": artigo}
    )
