import pytest
from datetime import date, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.domain.models import Solicitacao, PalestraTema, EventoSolicitacao
from app.domain.schemas import SolicitacaoCreate
from app.services.solicitacao_service import SolicitacaoService
from app.domain.state_machine import ValidacaoRegraNegocioException


@pytest.fixture
def db_session():
    """Cria banco SQLite em memória isolado para cada teste."""
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = Session()

    # Cria tema de teste
    tema = PalestraTema(
        slug="tema-teste",
        titulo="Educação Financeira Corporativa",
        descricao_curta="Resumo teste",
        descricao_completa="Completo teste",
        publico_alvo="Empresas",
        duracao_minutos=60,
        formatos="Presencial e Online",
        ordem=1,
        ativo=True
    )
    session.add(tema)
    session.commit()

    yield session
    session.close()


def test_criar_solicitacao_valida_com_protocolo(db_session):
    """Valida cadastro de solicitação válida, protocolo e evento de histórico (RN-01, CT-01)."""
    data_futura = date.today() + timedelta(days=15)
    dados = SolicitacaoCreate(
        organizacao="Hospital Regional de Uberlândia",
        nome_contato="Dr. Carlos Eduardo",
        email="carlos@hospital.org.br",
        telefone="(34) 98888-7777",
        data_desejada=data_futura,
        cidade="Uberlândia",
        estado="MG",
        formato="PRESENCIAL",
        perfil_publico="Médicos e enfermeiros",
        publico_estimado=120,
        tema_id=1,
        mensagem="Queremos focar em finanças e plantões.",
        consentimento=True
    )

    solicitacao, is_duplicada = SolicitacaoService.criar_solicitacao(
        db=db_session,
        dados=dados,
        ip_cliente="192.168.1.50"
    )

    assert is_duplicada is False
    assert solicitacao.id is not None
    assert solicitacao.protocolo.startswith("PAL-")
    assert len(solicitacao.protocolo) == 8  # 'PAL-' + 4 chars
    assert solicitacao.status == "NOVA"
    assert solicitacao.versao == 1
    assert solicitacao.tema_titulo == "Educação Financeira Corporativa"

    # Verifica que o evento imutável inicial foi gravado (RN-12, RNF-02)
    eventos = db_session.query(EventoSolicitacao).filter(EventoSolicitacao.solicitacao_id == solicitacao.id).all()
    assert len(eventos) == 1
    assert eventos[0].acao == "CRIACAO"
    assert eventos[0].status_novo == "NOVA"
    assert eventos[0].autor == "SOLICITANTE"


def test_deteccao_duplicidade_24_horas(db_session):
    """Mesmo e-mail com mesma data desejada devolve o mesmo protocolo sem duplicar (RN-16, CT-04)."""
    data_futura = date.today() + timedelta(days=20)
    dados = SolicitacaoCreate(
        organizacao="Empresa Alpha",
        nome_contato="Mariana Silva",
        email="mariana@alpha.com",
        data_desejada=data_futura,
        cidade="Uberlândia",
        estado="MG",
        formato="PRESENCIAL",
        perfil_publico="Funcionários",
        consentimento=True
    )

    # 1º envio
    sol_1, is_dup_1 = SolicitacaoService.criar_solicitacao(db_session, dados, "192.168.1.100")
    assert is_dup_1 is False

    # 2º envio com mesmos dados em seguida
    sol_2, is_dup_2 = SolicitacaoService.criar_solicitacao(db_session, dados, "192.168.1.100")
    assert is_dup_2 is True
    assert sol_1.protocolo == sol_2.protocolo
    assert sol_1.id == sol_2.id

    # Total de registros no banco continua 1
    total = db_session.query(Solicitacao).count()
    assert total == 1


def test_anti_spam_campo_armadilha_honeypot(db_session):
    """Robô preenchendo o campo armadilha é descartado (RN-16, CT-05)."""
    data_futura = date.today() + timedelta(days=15)
    dados = SolicitacaoCreate(
        organizacao="Bot Spammer Inc",
        nome_contato="Robot Spammer",
        email="bot@spam.com",
        data_desejada=data_futura,
        cidade="São Paulo",
        estado="SP",
        formato="ONLINE",
        perfil_publico="Todos",
        consentimento=True,
        website="http://link-malicioso.com"  # Campo armadilha preenchido!
    )

    with pytest.raises(ValidacaoRegraNegocioException) as exc:
        SolicitacaoService.criar_solicitacao(db_session, dados, "10.0.0.1")
    assert exc.value.codigo == "SPAM_DETECTADO"

    # Nada deve ter sido persistido no banco
    assert db_session.query(Solicitacao).count() == 0


def test_validacao_janela_de_datas():
    """Data desejada antes de hoje + 7 dias deve falhar na validação (RN-02, CT-03)."""
    data_invalida = date.today() + timedelta(days=3)  # Antecedência de apenas 3 dias

    with pytest.raises(ValueError) as exc:
        SolicitacaoCreate(
            organizacao="Escola Futuro",
            nome_contato="Professora Maria",
            email="maria@escola.edu.br",
            data_desejada=data_invalida,
            cidade="Uberlândia",
            estado="MG",
            formato="PRESENCIAL",
            perfil_publico="Alunos",
            consentimento=True
        )
    assert "antecedência" in str(exc.value)
