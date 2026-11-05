from datetime import datetime, timedelta, date
from typing import Optional, List, Tuple, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_
from app.domain.models import Solicitacao, EventoSolicitacao, PalestraTema, StatusSolicitacao
from app.domain.schemas import SolicitacaoCreate
from app.domain.state_machine import validar_transicao, ValidacaoRegraNegocioException
from app.core.protocol import gerar_protocolo
from app.core.security import check_rate_limit_ip


class SolicitacaoService:

    @staticmethod
    def criar_solicitacao(
        db: Session,
        dados: SolicitacaoCreate,
        ip_cliente: str = "127.0.0.1"
    ) -> Tuple[Solicitacao, bool]:
        """
        Registra uma nova solicitação no sistema aplicando regras anti-abuso,
        duplicidade em 24h e geração de protocolo único (RN-01, RN-16, RNF-08).
        Retorna (solicitacao, is_duplicada).
        """
        # RN-16: Anti-spam com campo-armadilha (honeypot)
        if dados.website and dados.website.strip():
            # Descarte silencioso para robôs
            raise ValidacaoRegraNegocioException(
                codigo="SPAM_DETECTADO",
                mensagem="Envio descartado pelo filtro de proteção."
            )

        # RN-16 & RNF-08: Limite de envios por IP (5 por hora)
        if not check_rate_limit_ip(ip_cliente):
            raise ValidacaoRegraNegocioException(
                codigo="MUITAS_TENTATIVAS",
                mensagem="Muitas tentativas em pouco tempo deste endereço. Tente novamente mais tarde."
            )

        # RN-16: Detecção de duplicidade em 24h (mesmo e-mail e mesma data desejada)
        limite_24h = datetime.utcnow() - timedelta(hours=24)
        existente = (
            db.query(Solicitacao)
            .filter(
                Solicitacao.email == dados.email.lower().strip(),
                Solicitacao.data_desejada == dados.data_desejada,
                Solicitacao.criado_em >= limite_24h
            )
            .order_by(desc(Solicitacao.criado_em))
            .first()
        )

        if existente:
            # Retorna a solicitação existente sem duplicar
            return existente, True

        # RN-18: Cópia imutável do título do tema no momento do envio
        tema_titulo = None
        if dados.tema_id:
            tema = db.query(PalestraTema).filter(PalestraTema.id == dados.tema_id).first()
            if tema:
                tema_titulo = tema.titulo

        # Gera protocolo único que não colida com outro no banco
        while True:
            protocolo = gerar_protocolo()
            if not db.query(Solicitacao).filter(Solicitacao.protocolo == protocolo).first():
                break

        nova_solicitacao = Solicitacao(
            protocolo=protocolo,
            organizacao=dados.organizacao.strip(),
            nome_contato=dados.nome_contato.strip(),
            email=dados.email.lower().strip(),
            telefone=dados.telefone.strip() if dados.telefone else None,
            data_desejada=dados.data_desejada,
            data_alternativa=dados.data_alternativa,
            cidade=dados.cidade.strip(),
            estado=dados.estado.upper().strip(),
            formato=dados.formato,
            perfil_publico=dados.perfil_publico.strip(),
            publico_estimado=dados.publico_estimado,
            tema_id=dados.tema_id,
            tema_titulo=tema_titulo,
            mensagem=dados.mensagem.strip() if dados.mensagem else None,
            status=StatusSolicitacao.NOVA.value,
            versao=1,
            consentimento=True,
            consentimento_em=datetime.utcnow(),
            ip_origem=ip_cliente,
            criado_em=datetime.utcnow()
        )

        db.add(nova_solicitacao)
        db.flush()  # Obtém o ID gerado

        # RN-12 & RNF-02: Registro inicial imutável no histórico
        evento_criacao = EventoSolicitacao(
            solicitacao_id=nova_solicitacao.id,
            status_anterior=None,
            status_novo=StatusSolicitacao.NOVA.value,
            acao="CRIACAO",
            motivo="Solicitação registrada pelo formulário público do site.",
            autor="SOLICITANTE",
            criado_em=datetime.utcnow()
        )
        db.add(evento_criacao)
        db.commit()
        db.refresh(nova_solicitacao)

        return nova_solicitacao, False

    @staticmethod
    def listar_solicitacoes(
        db: Session,
        status_filtro: Optional[str] = None,
        busca: Optional[str] = None,
        ordem: str = "criado_em_desc"
    ) -> Tuple[List[Solicitacao], Dict[str, int]]:
        """
        Lista solicitações com contadores por status, filtros e ordenação (RF-15, RNF-02).
        """
        # Contadores por status para os cards do funil
        totais = {
            "TODAS": 0,
            "ABERTAS": 0,
            StatusSolicitacao.NOVA.value: 0,
            StatusSolicitacao.EM_ANALISE.value: 0,
            StatusSolicitacao.PROPOSTA_ENVIADA.value: 0,
            StatusSolicitacao.CONFIRMADA.value: 0,
            StatusSolicitacao.REALIZADA.value: 0,
            StatusSolicitacao.RECUSADA.value: 0,
            StatusSolicitacao.CANCELADA.value: 0,
        }

        contagens = (
            db.query(Solicitacao.status, func.count(Solicitacao.id))
            .group_by(Solicitacao.status)
            .all()
        )
        total_geral = 0
        total_abertas = 0
        abertas_set = {
            StatusSolicitacao.NOVA.value,
            StatusSolicitacao.EM_ANALISE.value,
            StatusSolicitacao.PROPOSTA_ENVIADA.value,
            StatusSolicitacao.CONFIRMADA.value
        }

        for st, count in contagens:
            if st in totais:
                totais[st] = count
            total_geral += count
            if st in abertas_set:
                total_abertas += count

        totais["TODAS"] = total_geral
        totais["ABERTAS"] = total_abertas

        # Query principal
        query = db.query(Solicitacao)

        # Filtro de status
        if status_filtro:
            if status_filtro == "ABERTAS":
                query = query.filter(Solicitacao.status.in_(list(abertas_set)))
            elif status_filtro != "TODAS":
                query = query.filter(Solicitacao.status == status_filtro)
        else:
            # Padrão da especificação (RF-15): solicitações abertas
            query = query.filter(Solicitacao.status.in_(list(abertas_set)))

        # Filtro de busca textual
        if busca and busca.strip():
            termo = f"%{busca.strip()}%"
            query = query.filter(
                or_(
                    Solicitacao.protocolo.ilike(termo),
                    Solicitacao.organizacao.ilike(termo),
                    Solicitacao.nome_contato.ilike(termo),
                    Solicitacao.email.ilike(termo),
                    Solicitacao.cidade.ilike(termo),
                )
            )

        # Ordenação
        if ordem == "data_desejada_asc":
            query = query.order_by(Solicitacao.data_desejada.asc())
        elif ordem == "data_desejada_desc":
            query = query.order_by(Solicitacao.data_desejada.desc())
        elif ordem == "criado_em_asc":
            query = query.order_by(Solicitacao.criado_em.asc())
        else:
            # Padrão: mais recentes primeiro
            query = query.order_by(Solicitacao.criado_em.desc())

        solicitacoes = query.all()
        return solicitacoes, totais

    @staticmethod
    def obter_por_id(db: Session, solicitacao_id: int) -> Optional[Solicitacao]:
        return db.query(Solicitacao).filter(Solicitacao.id == solicitacao_id).first()

    @staticmethod
    def obter_por_protocolo(db: Session, protocolo: str) -> Optional[Solicitacao]:
        return db.query(Solicitacao).filter(Solicitacao.protocolo == protocolo.upper().strip()).first()

    @staticmethod
    def executar_acao_status(
        db: Session,
        solicitacao_id: int,
        versao_informada: int,
        acao: str,
        motivo: Optional[str] = None,
        autor: str = "DANIEL"
    ) -> Solicitacao:
        """
        Executa a transição de status respeitando a máquina de estados (RN-03),
        o lock otimista de versão (RN-13) e o histórico auditável imutável (RN-12, RNF-02).
        """
        solicitacao = db.query(Solicitacao).filter(Solicitacao.id == solicitacao_id).first()
        if not solicitacao:
            raise ValidacaoRegraNegocioException(
                codigo="NAO_ENCONTRADO",
                mensagem="Solicitação não encontrada."
            )

        # RN-13: Lock otimista / concorrência
        if solicitacao.versao != versao_informada:
            raise ValidacaoRegraNegocioException(
                codigo="VERSAO_DESATUALIZADA",
                mensagem="A solicitação foi alterada em outra tela. Atualizamos os dados; confira antes de continuar."
            )

        status_anterior = solicitacao.status

        # Valida as regras da máquina de estados (RN-03, RN-09, RN-10)
        novo_status = validar_transicao(
            status_atual=status_anterior,
            acao=acao,
            motivo=motivo,
            data_evento=solicitacao.data_desejada
        )

        # Aplica a alteração e incrementa versão
        solicitacao.status = novo_status
        solicitacao.versao += 1
        solicitacao.atualizado_em = datetime.utcnow()

        # RN-12 & RNF-02: Gera evento imutável na mesma transação
        evento = EventoSolicitacao(
            solicitacao_id=solicitacao.id,
            status_anterior=status_anterior,
            status_novo=novo_status,
            acao=acao.upper(),
            motivo=motivo.strip() if motivo else None,
            autor=autor,
            criado_em=datetime.utcnow()
        )
        db.add(evento)

        db.commit()
        db.refresh(solicitacao)
        return solicitacao
