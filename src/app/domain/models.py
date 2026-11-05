import enum
from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Date, DateTime, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class StatusSolicitacao(str, enum.Enum):
    NOVA = "NOVA"
    EM_ANALISE = "EM_ANALISE"
    PROPOSTA_ENVIADA = "PROPOSTA_ENVIADA"
    CONFIRMADA = "CONFIRMADA"
    REALIZADA = "REALIZADA"
    RECUSADA = "RECUSADA"
    CANCELADA = "CANCELADA"


class FormatoPalestra(str, enum.Enum):
    PRESENCIAL = "PRESENCIAL"
    ONLINE = "ONLINE"


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)


class PalestraTema(Base):
    __tablename__ = "palestras_temas"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    titulo = Column(String(150), nullable=False)
    subtitulo = Column(String(255), nullable=True)
    descricao_curta = Column(Text, nullable=False)
    descricao_completa = Column(Text, nullable=False)
    publico_alvo = Column(String(255), nullable=False)
    duracao_minutos = Column(Integer, default=60, nullable=False)
    formatos = Column(String(100), default="Presencial e Online", nullable=False)
    imagem_url = Column(String(500), nullable=True)
    ordem = Column(Integer, default=0, nullable=False)
    ativo = Column(Boolean, default=True, nullable=False, index=True)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)

    solicitacoes = relationship("Solicitacao", back_populates="tema")


class Solicitacao(Base):
    __tablename__ = "solicitacoes"

    id = Column(Integer, primary_key=True, index=True)
    protocolo = Column(String(20), unique=True, index=True, nullable=False)
    organizacao = Column(String(120), nullable=False)
    nome_contato = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False, index=True)
    telefone = Column(String(30), nullable=True)
    data_desejada = Column(Date, nullable=False, index=True)
    data_alternativa = Column(Date, nullable=True)
    cidade = Column(String(100), nullable=False)
    estado = Column(String(2), nullable=False)
    formato = Column(String(20), default=FormatoPalestra.PRESENCIAL.value, nullable=False)
    perfil_publico = Column(String(200), nullable=False)
    publico_estimado = Column(Integer, nullable=True)

    tema_id = Column(Integer, ForeignKey("palestras_temas.id"), nullable=True)
    tema_titulo = Column(String(150), nullable=True)  # Cópia imutável (RN-18)
    mensagem = Column(Text, nullable=True)

    # Funil e controle de concorrência (RN-03, RN-13)
    status = Column(String(30), default=StatusSolicitacao.NOVA.value, nullable=False, index=True)
    versao = Column(Integer, default=1, nullable=False)  # Lock otimista

    # LGPD e anti-abuso (RN-01, RN-16, P-08)
    consentimento = Column(Boolean, default=True, nullable=False)
    consentimento_em = Column(DateTime, default=datetime.utcnow, nullable=False)
    ip_origem = Column(String(50), nullable=True)

    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    tema = relationship("PalestraTema", back_populates="solicitacoes")
    historico = relationship(
        "EventoSolicitacao",
        back_populates="solicitacao",
        order_by="desc(EventoSolicitacao.criado_em)",
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("ix_solicitacoes_email_data", "email", "data_desejada"),
    )


class EventoSolicitacao(Base):
    __tablename__ = "eventos_solicitacao"

    id = Column(Integer, primary_key=True, index=True)
    solicitacao_id = Column(Integer, ForeignKey("solicitacoes.id", ondelete="CASCADE"), nullable=False, index=True)
    status_anterior = Column(String(30), nullable=True)
    status_novo = Column(String(30), nullable=False)
    acao = Column(String(50), nullable=False)
    motivo = Column(Text, nullable=True)
    autor = Column(String(50), default="DANIEL", nullable=False)  # "SOLICITANTE", "DANIEL", "SISTEMA"
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    solicitacao = relationship("Solicitacao", back_populates="historico")


class BloqueioAgenda(Base):
    __tablename__ = "bloqueios_agenda"

    id = Column(Integer, primary_key=True, index=True)
    data = Column(Date, unique=True, index=True, nullable=False)
    motivo = Column(String(120), nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)
