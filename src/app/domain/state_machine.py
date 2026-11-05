from typing import Dict, Tuple, Optional, List
from datetime import date
from app.domain.models import StatusSolicitacao

# Tabela canônica de transições válidas (Seção 10.3 da especificação)
TRANSICOES: Dict[Tuple[str, str], str] = {
    (StatusSolicitacao.NOVA.value, "assumir"): StatusSolicitacao.EM_ANALISE.value,
    (StatusSolicitacao.EM_ANALISE.value, "propor"): StatusSolicitacao.PROPOSTA_ENVIADA.value,
    (StatusSolicitacao.PROPOSTA_ENVIADA.value, "renovar"): StatusSolicitacao.PROPOSTA_ENVIADA.value,
    (StatusSolicitacao.PROPOSTA_ENVIADA.value, "retirar"): StatusSolicitacao.EM_ANALISE.value,
    (StatusSolicitacao.PROPOSTA_ENVIADA.value, "expirar"): StatusSolicitacao.EM_ANALISE.value,
    (StatusSolicitacao.PROPOSTA_ENVIADA.value, "confirmar"): StatusSolicitacao.CONFIRMADA.value,
    (StatusSolicitacao.CONFIRMADA.value, "realizar"): StatusSolicitacao.REALIZADA.value,
    (StatusSolicitacao.NOVA.value, "recusar"): StatusSolicitacao.RECUSADA.value,
    (StatusSolicitacao.EM_ANALISE.value, "recusar"): StatusSolicitacao.RECUSADA.value,
    (StatusSolicitacao.PROPOSTA_ENVIADA.value, "recusar"): StatusSolicitacao.RECUSADA.value,
    (StatusSolicitacao.CONFIRMADA.value, "cancelar"): StatusSolicitacao.CANCELADA.value,
}

# Metadados de cada ação para interface e validação
METADADOS_ACOES = {
    "assumir": {
        "rotulo": "Assumir Análise",
        "exige_motivo": False,
        "estilo": "bg-indigo-600 hover:bg-indigo-700 text-white",
        "descricao": "Inicia a análise e atendimento desta solicitação."
    },
    "recusar": {
        "rotulo": "Recusar Solicitação",
        "exige_motivo": True,
        "estilo": "bg-red-600 hover:bg-red-700 text-white",
        "descricao": "Recusa o pedido justificando o motivo para o histórico."
    },
    "propor": {
        "rotulo": "Registrar Proposta",
        "exige_motivo": False,
        "estilo": "bg-blue-600 hover:bg-blue-700 text-white",
        "descricao": "Registra data e pré-reserva de proposta para o contratante."
    },
    "confirmar": {
        "rotulo": "Confirmar Palestra",
        "exige_motivo": False,
        "estilo": "bg-emerald-600 hover:bg-emerald-700 text-white",
        "descricao": "Confirma o agendamento definitivo na data combinada."
    },
    "retirar": {
        "rotulo": "Retirar Proposta",
        "exige_motivo": True,
        "estilo": "bg-amber-600 hover:bg-amber-700 text-white",
        "descricao": "Devolve a solicitação para análise e desfaz a pré-reserva."
    },
    "realizar": {
        "rotulo": "Marcar Realizada",
        "exige_motivo": False,
        "estilo": "bg-green-700 hover:bg-green-800 text-white",
        "descricao": "Conclui a palestra após a realização da data."
    },
    "cancelar": {
        "rotulo": "Cancelar Palestra",
        "exige_motivo": True,
        "estilo": "bg-rose-700 hover:bg-rose-800 text-white",
        "descricao": "Cancela a palestra previamente confirmada e libera a data."
    }
}


class TransicaoInvalidaException(Exception):
    def __init__(self, status_atual: str, acao: str):
        super().__init__(f"Transição inválida: ação '{acao}' não permitida a partir do status '{status_atual}'.")
        self.status_atual = status_atual
        self.acao = acao


class ValidacaoRegraNegocioException(Exception):
    def __init__(self, codigo: str, mensagem: str, detalhes: Optional[dict] = None):
        super().__init__(mensagem)
        self.codigo = codigo
        self.mensagem = mensagem
        self.detalhes = detalhes or {}


def proximo_status(status_atual: str, acao: str) -> str:
    """Calcula e valida o próximo status com base na tabela estrita de transições."""
    chave = (status_atual, acao)
    if chave not in TRANSICOES:
        raise TransicaoInvalidaException(status_atual, acao)
    return TRANSICOES[chave]


def validar_transicao(
    status_atual: str,
    acao: str,
    motivo: Optional[str] = None,
    data_evento: Optional[date] = None
) -> str:
    """
    Aplica as regras de negócio associadas a cada transição (RN-03, RN-09, RN-10).
    Retorna o novo status.
    """
    novo_status = proximo_status(status_atual, acao)

    # RN-09: Recusa e cancelamento exigem motivo (3 a 300 caracteres)
    if acao in ("recusar", "cancelar", "retirar"):
        if not motivo or len(motivo.strip()) < 3 or len(motivo.strip()) > 300:
            raise ValidacaoRegraNegocioException(
                codigo="MOTIVO_OBRIGATORIO",
                mensagem="Esta ação exige justificativa/motivo entre 3 e 300 caracteres."
            )

    # RN-10: Realizada só depois do evento (dataEvento <= hoje)
    if acao == "realizar" and data_evento:
        hoje = date.today()
        if data_evento > hoje:
            raise ValidacaoRegraNegocioException(
                codigo="DATA_FUTURA",
                mensagem="Uma palestra só pode ser marcada como realizada a partir da data de realização."
            )

    return novo_status


def obter_acoes_disponiveis(status_atual: str, data_desejada: Optional[date] = None) -> List[dict]:
    """Retorna a lista de ações que podem ser executadas a partir do status atual para a UI."""
    acoes = []
    hoje = date.today()

    for (st, acao), destino in TRANSICOES.items():
        if st == status_atual:
            # Caso especial: 'expirar' é exclusivo do sistema agendado (RN-07)
            if acao == "expirar":
                continue

            # Se for 'realizar', só exibe ou habilita se a data já chegou ou passou
            desabilitada = False
            msg_desabilitada = None
            if acao == "realizar" and data_desejada and data_desejada > hoje:
                desabilitada = True
                msg_desabilitada = "Disponível apenas a partir da data do evento"

            meta = METADADOS_ACOES.get(acao, {
                "rotulo": acao.capitalize(),
                "exige_motivo": False,
                "estilo": "bg-slate-700 text-white",
                "descricao": ""
            })

            acoes.append({
                "acao": acao,
                "destino": destino,
                "rotulo": meta["rotulo"],
                "exige_motivo": meta["exige_motivo"],
                "estilo": meta["estilo"],
                "descricao": meta["descricao"],
                "desabilitada": desabilitada,
                "msg_desabilitada": msg_desabilitada
            })

    return acoes
