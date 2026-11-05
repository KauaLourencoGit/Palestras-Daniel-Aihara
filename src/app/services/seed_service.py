from datetime import datetime
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import hash_password
from app.domain.models import Usuario, PalestraTema


def seed_dados_iniciais(db: Session):
    """
    Popula o banco de dados com a conta do administrador (Daniel Takeo Aihara)
    e o catálogo inicial de palestras recomendadas (RF-03, RF-14, RNF-05).
    """
    # 1. Cria ou atualiza o usuário administrador Daniel Takeo Aihara
    admin = db.query(Usuario).filter(Usuario.email == settings.ADMIN_EMAIL).first()
    if not admin:
        admin = Usuario(
            nome=settings.ADMIN_NAME,
            email=settings.ADMIN_EMAIL,
            senha_hash=hash_password(settings.ADMIN_PASSWORD),
            criado_em=datetime.utcnow()
        )
        db.add(admin)
        db.commit()

    # 2. Popula os temas iniciais do catálogo de palestras
    temas_iniciais = [
        {
            "slug": "financas-pessoais-e-liberdade-financeira",
            "titulo": "Finanças Pessoais e Liberdade Financeira: O Guia Prático",
            "subtitulo": "Como organizar o orçamento familiar, eliminar dívidas e construir patrimônio sólido",
            "descricao_curta": "Aprenda a transformar sua relação com o dinheiro através de métodos práticos de organização orçamentária e mentalidade financeira preventiva.",
            "descricao_completa": (
                "Nesta palestra dinâmica e interativa, Daniel Takeo Aihara aborda os pilares essenciais da saúde financeira: "
                "mapeamento de gastos invisíveis, método 50-30-20 adaptado à realidade brasileira, estratégias eficientes de negociação "
                "de dívidas e os primeiros passos para a formação de uma reserva de emergência consistente. Conteúdo direto, "
                "livre de termos técnicos complexos e com foco em transformação imediata de hábitos."
            ),
            "publico_alvo": "Colaboradores de empresas (SIPAT/RH), associações, servidores e público geral",
            "duracao_minutos": 90,
            "formatos": "Presencial e Online",
            "imagem_url": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80",
            "ordem": 1,
            "ativo": True
        },
        {
            "slug": "investimentos-inteligentes-do-zero",
            "titulo": "Investimentos Inteligentes do Zero: Renda Fixa e Variável",
            "subtitulo": "Desmistificando o mercado financeiro com segurança, clareza e método",
            "descricao_curta": "Conheça as alternativas reais além da poupança: Tesouro Direto, CDBs, LCI/LCA, ações e fundos imobiliários com linguagem acessível.",
            "descricao_completa": (
                "Uma jornada prática pensada para quem quer começar a investir com segurança e sem cair em promessas fáceis. "
                "Daniel explica como avaliar risco vs. retorno, a função da inflação e da taxa Selic no bolso do cidadão, "
                "a proteção do FGC (Fundo Garantidor de Créditos) e como montar uma carteira diversificada compatível com metas de curto, médio e longo prazo."
            ),
            "publico_alvo": "Profissionais de empresas, investidores iniciantes e equipes corporativas",
            "duracao_minutos": 75,
            "formatos": "Presencial e Online",
            "imagem_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80",
            "ordem": 2,
            "ativo": True
        },
        {
            "slug": "educacao-financeira-jovens-universitarios",
            "titulo": "Educação Financeira para Jovens e Universitários",
            "subtitulo": "Construindo uma base sólida para o início da carreira profissional",
            "descricao_curta": "Como gerenciar os primeiros salários, fugir das armadilhas do cartão de crédito e aproveitar o tempo a favor dos juros compostos.",
            "descricao_completa": (
                "Focada no público jovem e universitário, a palestra ensina como encarar os desafios do início da vida financeira adulta. "
                "São trabalhados tópicos como uso consciente do cartão de crédito e parcelamentos, planejamento para estágios e primeiros empregos, "
                "e o poder multiplicador do tempo nos investimentos quando se começa cedo."
            ),
            "publico_alvo": "Estudantes universitários, jovens aprendizes, escolas de ensino médio e estagiários",
            "duracao_minutos": 60,
            "formatos": "Presencial e Online",
            "imagem_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
            "ordem": 3,
            "ativo": True
        },
        {
            "slug": "gestao-fluxo-caixa-empresarial",
            "titulo": "Planejamento Orçamentário e Fluxo de Caixa para Negócios",
            "subtitulo": "Tomada de decisão estratégica com foco em rentabilidade e controle",
            "descricao_curta": "Estratégias assertivas para manter o fluxo de caixa saudável, equilibrar prazos médios e embasar decisões em dados financeiros sólidos.",
            "descricao_completa": (
                "Palestra voltada a líderes, gestores e empresários que precisam aprimorar a previsibilidade de caixa da organização. "
                "Daniel detalha metodologias de conciliação diária, separação entre finanças pessoais dos sócios e finanças corporativas, "
                "cálculo de ponto de equilíbrio e gestão de custos fixos e variáveis em períodos de oscilação econômica."
            ),
            "publico_alvo": "Líderes de equipes, diretores, micro e pequenos empresários, associações comerciais",
            "duracao_minutos": 90,
            "formatos": "Presencial e Online",
            "imagem_url": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
            "ordem": 4,
            "ativo": True
        }
    ]

    for tema_dict in temas_iniciais:
        existente = db.query(PalestraTema).filter(PalestraTema.slug == tema_dict["slug"]).first()
        if not existente:
            novo_tema = PalestraTema(
                slug=tema_dict["slug"],
                titulo=tema_dict["titulo"],
                subtitulo=tema_dict["subtitulo"],
                descricao_curta=tema_dict["descricao_curta"],
                descricao_completa=tema_dict["descricao_completa"],
                publico_alvo=tema_dict["publico_alvo"],
                duracao_minutos=tema_dict["duracao_minutos"],
                formatos=tema_dict["formatos"],
                imagem_url=tema_dict.get("imagem_url"),
                ordem=tema_dict["ordem"],
                ativo=tema_dict["ativo"],
                criado_em=datetime.utcnow()
            )
            db.add(novo_tema)
        else:
            # Atualiza imagem_url caso ainda não esteja definida
            if not existente.imagem_url:
                existente.imagem_url = tema_dict.get("imagem_url")

    db.commit()
