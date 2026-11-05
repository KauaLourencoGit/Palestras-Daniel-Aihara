from datetime import date, datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr, field_validator, ConfigDict
from app.core.config import settings


class SolicitacaoCreate(BaseModel):
    organizacao: str = Field(..., min_length=2, max_length=120, description="Nome da empresa, escola ou entidade")
    nome_contato: str = Field(..., min_length=2, max_length=100, description="Nome do responsável pelo pedido")
    email: EmailStr = Field(..., description="E-mail profissional para retorno")
    telefone: Optional[str] = Field(None, max_length=30, description="Telefone / WhatsApp com DDD")
    data_desejada: date = Field(..., description="Data desejada para o evento")
    data_alternativa: Optional[date] = Field(None, description="Segunda opção de data")
    cidade: str = Field(..., min_length=2, max_length=100, description="Cidade onde será realizado")
    estado: str = Field(..., min_length=2, max_length=2, description="UF (ex.: MG, SP)")
    formato: str = Field("PRESENCIAL", description="PRESENCIAL ou ONLINE")
    perfil_publico: str = Field(..., min_length=2, max_length=200, description="Ex: Colaboradores, Estudantes")
    publico_estimado: Optional[int] = Field(None, ge=1, le=100000, description="Estimativa de participantes")
    tema_id: Optional[int] = Field(None, description="ID do tema escolhido no catálogo")
    mensagem: Optional[str] = Field(None, max_length=2000, description="Observações ou necessidades específicas")
    consentimento: bool = Field(..., description="Termo de consentimento LGPD")
    # Campo armadilha contra robôs (RN-16)
    website: Optional[str] = Field(None, description="Campo honeypot contra robôs de spam")

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, v: str) -> str:
        v = v.strip().upper()
        ufs_validas = {
            "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
            "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
            "RS", "RO", "RR", "SC", "SP", "SE", "TO"
        }
        if v not in ufs_validas:
            raise ValueError("Informe uma sigla de estado (UF) válida com 2 letras.")
        return v

    @field_validator("formato")
    @classmethod
    def validar_formato(cls, v: str) -> str:
        v = v.strip().upper()
        if v not in ("PRESENCIAL", "ONLINE"):
            raise ValueError("Formato deve ser PRESENCIAL ou ONLINE.")
        return v

    @field_validator("consentimento")
    @classmethod
    def validar_consentimento(cls, v: bool) -> bool:
        if not v:
            raise ValueError("O consentimento para tratamento dos dados conforme a LGPD é obrigatório.")
        return v

    @field_validator("data_desejada")
    @classmethod
    def validar_janela_data_desejada(cls, v: date) -> date:
        hoje = date.today()
        min_data = hoje + timedelta(days=settings.ANTECEDENCIA_MINIMA_DIAS)
        max_data = hoje + timedelta(days=settings.HORIZONTE_MAXIMO_MESES * 30)

        if v < min_data:
            raise ValueError(f"A data desejada deve ter no mínimo {settings.ANTECEDENCIA_MINIMA_DIAS} dias de antecedência (a partir de {min_data.strftime('%d/%m/%Y')}).")
        if v > max_data:
            raise ValueError(f"A data desejada não pode ultrapassar o horizonte de {settings.HORIZONTE_MAXIMO_MESES} meses.")
        return v

    @field_validator("data_alternativa")
    @classmethod
    def validar_janela_data_alternativa(cls, v: Optional[date]) -> Optional[date]:
        if v is None:
            return None
        hoje = date.today()
        min_data = hoje + timedelta(days=settings.ANTECEDENCIA_MINIMA_DIAS)
        max_data = hoje + timedelta(days=settings.HORIZONTE_MAXIMO_MESES * 30)

        if v < min_data:
            raise ValueError(f"A data alternativa deve ter antecedência mínima de {settings.ANTECEDENCIA_MINIMA_DIAS} dias.")
        if v > max_data:
            raise ValueError(f"A data alternativa não pode ultrapassar {settings.HORIZONTE_MAXIMO_MESES} meses.")
        return v


class SolicitacaoTransitarAction(BaseModel):
    versao: int = Field(..., description="Versão atual para lock otimista (RN-13)")
    acao: str = Field(..., description="Nome da ação (ex: assumir, recusar, realizar)")
    motivo: Optional[str] = Field(None, max_length=300, description="Motivo obrigatório para recusa ou cancelamento")


class EventoResponse(BaseModel):
    id: int
    status_anterior: Optional[str] = None
    status_novo: str
    acao: str
    motivo: Optional[str] = None
    autor: str
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)


class SolicitacaoResponse(BaseModel):
    id: int
    protocolo: str
    organizacao: str
    nome_contato: str
    email: str
    telefone: Optional[str] = None
    data_desejada: date
    data_alternativa: Optional[date] = None
    cidade: str
    estado: str
    formato: str
    perfil_publico: str
    publico_estimado: Optional[int] = None
    tema_id: Optional[int] = None
    tema_titulo: Optional[str] = None
    mensagem: Optional[str] = None
    status: str
    versao: int
    criado_em: datetime
    atualizado_em: datetime

    model_config = ConfigDict(from_attributes=True)


class PalestraTemaResponse(BaseModel):
    id: int
    slug: str
    titulo: str
    subtitulo: Optional[str] = None
    descricao_curta: str
    descricao_completa: str
    publico_alvo: str
    duracao_minutos: int
    formatos: str
    imagem_url: Optional[str] = None
    ordem: int
    ativo: bool

    model_config = ConfigDict(from_attributes=True)
