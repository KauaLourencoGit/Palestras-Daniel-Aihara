import pytest
from datetime import date, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.core.database import Base, get_db
from app.core.security import hash_password, verify_password, check_login_attempts, record_login_failure, clear_login_failures
from app.domain.models import Usuario, Solicitacao, EventoSolicitacao
from app.services.solicitacao_service import SolicitacaoService
from app.domain.state_machine import ValidacaoRegraNegocioException
from main import app


@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = Session()

    # Cria Daniel admin
    admin = Usuario(
        nome="Daniel Takeo Aihara",
        email="daniel.aihara@exemplo.com",
        senha_hash=hash_password("admin123456")
    )
    session.add(admin)
    session.commit()

    yield session
    session.close()


def test_hash_senha_seguro_bcrypt():
    """Garante que a senha nunca seja texto puro e valida hash bcrypt (RNF-05)."""
    senha_plana = "minhasenhaforte2026"
    hashed = hash_password(senha_plana)

    assert hashed != senha_plana
    assert hashed.startswith("$2b$") or hashed.startswith("$2a$")
    assert verify_password(senha_plana, hashed) is True
    assert verify_password("senha_errada", hashed) is False


def test_bloqueio_forca_bruta_login():
    """5 falhas consecutivas bloqueiam temporariamente novas tentativas (RNF-07, CT-21)."""
    ip = "192.168.0.55"
    identificador = f"teste@exemplo.com:{ip}"
    clear_login_failures(identificador)

    for i in range(4):
        pode, _ = check_login_attempts(identificador)
        assert pode is True
        record_login_failure(identificador)

    # 5ª falha
    record_login_failure(identificador)
    pode, min_restantes = check_login_attempts(identificador)
    assert pode is False
    assert min_restantes > 0


def test_transicao_status_e_lock_otimista(db_session):
    """
    Testa transição de status no painel e rejeição por lock otimista de versão (RN-03, RN-13, CT-18, CT-19).
    """
    # Cria solicitação
    sol = Solicitacao(
        protocolo="PAL-TEST",
        organizacao="Instituto Exemplo",
        nome_contato="Paula Lima",
        email="paula@exemplo.com",
        data_desejada=date.today() + timedelta(days=20),
        cidade="Uberlândia",
        estado="MG",
        formato="PRESENCIAL",
        perfil_publico="Gestores",
        status="NOVA",
        versao=1,
        consentimento=True
    )
    db_session.add(sol)
    db_session.commit()
    db_session.refresh(sol)

    # 1. Daniel assume a análise (NOVA -> EM_ANALISE)
    sol_atualizada = SolicitacaoService.executar_acao_status(
        db=db_session,
        solicitacao_id=sol.id,
        versao_informada=1,
        acao="assumir",
        autor="Daniel Takeo Aihara"
    )

    assert sol_atualizada.status == "EM_ANALISE"
    assert sol_atualizada.versao == 2

    # Verifica histórico gerado
    eventos = db_session.query(EventoSolicitacao).filter(EventoSolicitacao.solicitacao_id == sol.id).all()
    assert len(eventos) == 1
    assert eventos[0].status_anterior == "NOVA"
    assert eventos[0].status_novo == "EM_ANALISE"
    assert eventos[0].acao == "ASSUMIR"
    assert eventos[0].autor == "Daniel Takeo Aihara"

    # 2. Concorrência: outra tela tenta alterar passando a versão desatualizada (v1 em vez de v2)
    with pytest.raises(ValidacaoRegraNegocioException) as exc:
        SolicitacaoService.executar_acao_status(
            db=db_session,
            solicitacao_id=sol.id,
            versao_informada=1,  # Versão antiga!
            acao="recusar",
            motivo="Motivo qualquer",
            autor="Daniel Takeo Aihara"
        )
    assert exc.value.codigo == "VERSAO_DESATUALIZADA"


def test_protecao_rotas_painel_sem_sessao(db_session):
    """Acesso anônimo a endpoints protegidos deve retornar 401 Unauthorized (RNF-04, CT-20)."""
    client = TestClient(app)

    # 1. Rota de API protegida sem cookie -> 401 Unauthorized
    resp_api = client.get("/api/solicitacoes")
    assert resp_api.status_code == 401
    assert "Acesso não autorizado" in resp_api.json()["detail"]

    resp_detalhe = client.get("/api/solicitacoes/1")
    assert resp_detalhe.status_code == 401

    # 2. Com sessão válida (após login), o acesso à API é liberado
    resp_login = client.post(
        "/api/auth/login",
        json={"email": "daniel.aihara@exemplo.com", "senha": "admin123456"}
    )
    assert resp_login.status_code == 200
    cookie_value = resp_login.cookies.get("aihara_session")
    assert cookie_value is not None

    resp_autenticado = client.get(
        "/api/solicitacoes",
        cookies={"aihara_session": cookie_value}
    )
    assert resp_autenticado.status_code == 200
