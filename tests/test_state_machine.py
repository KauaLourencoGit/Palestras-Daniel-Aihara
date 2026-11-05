import pytest
from datetime import date, timedelta
from app.domain.state_machine import (
    proximo_status, validar_transicao,
    TransicaoInvalidaException, ValidacaoRegraNegocioException
)


def test_transicoes_validas_fluxo_principal():
    """Valida as transições permitidas da máquina de estados (RN-03)."""
    assert proximo_status("NOVA", "assumir") == "EM_ANALISE"
    assert proximo_status("EM_ANALISE", "propor") == "PROPOSTA_ENVIADA"
    assert proximo_status("PROPOSTA_ENVIADA", "confirmar") == "CONFIRMADA"
    assert proximo_status("CONFIRMADA", "realizar") == "REALIZADA"


def test_transicoes_invalidas():
    """Valida que qualquer transição fora da tabela estrita é rejeitada (RN-03, CT-17)."""
    with pytest.raises(TransicaoInvalidaException):
        proximo_status("RECUSADA", "CONFIRMAR")

    with pytest.raises(TransicaoInvalidaException):
        proximo_status("NOVA", "realizar")

    with pytest.raises(TransicaoInvalidaException):
        proximo_status("REALIZADA", "assumir")


def test_recusa_exige_motivo():
    """Valida que recusa sem motivo ou com motivo curto é rejeitada (RN-09)."""
    # Sem motivo
    with pytest.raises(ValidacaoRegraNegocioException) as exc:
        validar_transicao("NOVA", "recusar", motivo="")
    assert exc.value.codigo == "MOTIVO_OBRIGATORIO"

    # Motivo muito curto (< 3 caracteres)
    with pytest.raises(ValidacaoRegraNegocioException) as exc:
        validar_transicao("EM_ANALISE", "recusar", motivo="ok")
    assert exc.value.codigo == "MOTIVO_OBRIGATORIO"

    # Motivo válido (3 a 300 caracteres)
    status_novo = validar_transicao("NOVA", "recusar", motivo="Data indisponível e perfil fora do escopo.")
    assert status_novo == "RECUSADA"


def test_cancelamento_exige_motivo():
    """Valida que cancelar solicitação confirmada exige motivo (RN-09, CT-15)."""
    with pytest.raises(ValidacaoRegraNegocioException) as exc:
        validar_transicao("CONFIRMADA", "cancelar", motivo=" ")
    assert exc.value.codigo == "MOTIVO_OBRIGATORIO"

    status_novo = validar_transicao("CONFIRMADA", "cancelar", motivo="Cancelamento solicitado pelo contratante.")
    assert status_novo == "CANCELADA"


def test_marcar_realizada_apenas_data_presente_ou_passada():
    """Valida que CONFIRMADA -> REALIZADA só é permitida se dataEvento <= hoje (RN-10, CT-16)."""
    hoje = date.today()
    amanha = hoje + timedelta(days=1)
    ontem = hoje - timedelta(days=1)

    # Data futura deve ser recusada
    with pytest.raises(ValidacaoRegraNegocioException) as exc:
        validar_transicao("CONFIRMADA", "realizar", data_evento=amanha)
    assert exc.value.codigo == "DATA_FUTURA"

    # Hoje ou data passada deve ser aceita
    assert validar_transicao("CONFIRMADA", "realizar", data_evento=hoje) == "REALIZADA"
    assert validar_transicao("CONFIRMADA", "realizar", data_evento=ontem) == "REALIZADA"
