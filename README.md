# Site e Gestão de Palestras — Daniel Takeo Aihara

> **Projeto Acadêmico de Extensão — UNITRI 2026-2**  
> **Cursos:** Ciência da Computação / Análise e Desenvolvimento de Sistemas  
> **Cliente:** Daniel Takeo Aihara (Educação Financeira)  
> **Equipe de Produto:** Grupo 4 (Arthur Rodrigues Monteiro, Dyego Adriano Moura Alcântara, Guilherme Aoyagui Ide, Guilherme Ferreira de Freitas, Maria Fernanda Micheline Pereira e Platão Leonel de Souza Júnior)  
> **Orientação e Revisão:** Prof. Milton Miranda Neto  

---

## 📌 Visão Geral do Projeto

O **Site e Gestão de Palestras** é uma solução web desenvolvida para profissionalizar e automatizar o funil de atendimento e contratação de palestras de educação financeira para empresas, escolas, universidades e instituições.

Diferente de um site institucional convencional, a plataforma integra:
1. **Módulo Público:** Apresentação institucional de autoridade, catálogo de temas com ementas, leitura de artigos educativos em Markdown e formulário inteligente de solicitação com geração de protocolo único (`PAL-XXXX`).
2. **Painel de Gestão do Daniel:** Dashboard com funil de status (`NOVA` ➔ `EM_ANALISE` ➔ `PROPOSTA_ENVIADA` ➔ `CONFIRMADA` ➔ `REALIZADA`, com opções de `RECUSADA` e `CANCELADA`), controle de concorrência com lock otimista e linha do tempo de auditoria imutável.
3. **Arquitetura Custo Zero:** Desenvolvida em **Python + FastAPI + SQLAlchemy + React + Tailwind CSS**, operando localmente com SQLite e 100% preparada para migração transparente para **PostgreSQL (Supabase)** e deploy em plataformas gratuitas (**Railway / Render / Vercel**).

---

## 🚀 Status da Entrega — Sprint 1 (MVP Core)

| Card | História / Requisito | Descrição | Status |
| :--- | :--- | :--- | :---: |
| **[INFRA-01]** | `RNF-04`, `RNF-05` | Setup da arquitetura modular, banco de dados, migrações/seed e autenticação com hash `bcrypt` | ✅ Concluído |
| **[US01]** | `RF-01` | Página inicial com apresentação do Daniel, números de impacto e chamadas para ação (CTA) | ✅ Concluído |
| **[US02]** | `RF-05`, `RN-19` | Área de conteúdos e artigos de educação financeira renderizados a partir de arquivos Markdown | ✅ Concluído |
| **[US03]** | `RF-03`, `RF-04` | Catálogo de palestras com cards, ementas completas e botão de solicitação com pré-seleção | ✅ Concluído |
| **[US04 / UC04]** | `RF-09`, `RF-10`, `RF-11`, `RNF-07` | Formulário de solicitação com validação estrita, anti-spam (honeypot + rate limit), duplicidade 24h e protocolo único | ✅ Concluído |
| **[US06 / UC06]** | `RF-15`, `RF-16`, `RF-17`, `RNF-02` | Painel administrativo com contadores por status, filtros, busca e máquina de estados estrita | ✅ Concluído |
| **[US09 / UC08]** | `RF-19`, `RN-12`, `RNF-06` | Histórico e auditoria imutável registrando cada transição com autor, datas e motivos | ✅ Concluído |
| **[QA]** | `RNF-03`, `RNF-08` | Responsividade (360px, 768px, 1366px), testes automatizados (`pytest`) e documentação | ✅ Concluído |

---

## 🛠️ Tecnologias Utilizadas

- **Back-end:** Python 3.14+, FastAPI, SQLAlchemy 2.0, Pydantic 2, Uvicorn, Passlib / Bcrypt, Python-Jose / HMAC.
- **Front-end:** React 19, Vite, Tailwind CSS, Lucide React, Canvas Confetti.
- **Banco de Dados:** SQLite (Desenvolvimento Local) / PostgreSQL via Supabase (Produção).
- **Testes:** Pytest, AnyIO, Starlette TestClient (13 testes automatizados).

---

## 🏁 Como Executar o Projeto Localmente

### Pré-requisitos
- Python 3.10 ou superior instalado.
- Node.js LTS (caso queira alterar/recompilar o frontend React).

### Opção 1: Inicialização Rápida (1 Clique no Windows)
Basta dar um duplo clique no arquivo:
```cmd
iniciar.bat
```
Ou no PowerShell:
```powershell
.\iniciar.ps1
```

### Opção 2: Manual via Terminal

1. **Clonar o repositório:**
```bash
git clone https://github.com/KauaLourencoGit/Palestras-Daniel-Aihara.git
cd Palestras-Daniel-Aihara
```

2. **Criar e ativar o ambiente virtual Python:**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. **Instalar as dependências:**
```bash
pip install -r requirements.txt
```

4. **Configurar variáveis de ambiente:**
Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

5. **Iniciar a aplicação:**
```powershell
$env:PYTHONPATH="src"
python src/main.py
```

A aplicação estará acessível em: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 🔑 Credenciais de Acesso ao Painel

Ao iniciar a aplicação pela primeira vez, a conta do Daniel é automaticamente criada e provisionada pelo serviço de seed inicial:

- **URL do Painel:** `http://127.0.0.1:8000/admin`
- **E-mail:** `daniel.aihara@exemplo.com`
- **Senha:** `admin123456`

---

## 🧪 Executando os Testes Automatizados

A suíte de testes cobre a máquina de estados, regras de negócio de validação de formulário, detecção de duplicidade em 24h, proteção por honeypot, controle de concorrência com lock otimista e autenticação segura:

```powershell
$env:PYTHONPATH="src"
pytest -v
```

---

## 📚 Documentação Interativa da API (Swagger / OpenAPI)

Com o servidor rodando, acesse a documentação interativa com execução de endpoints em tempo real:
- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🎬 Roteiro Sugerido para Apresentação da Sprint 1 (Review 1)

1. **Jornada do Visitante e Contratante (Módulo Público):**
   - Acesse `http://127.0.0.1:8000` e explore a página inicial com fotos de alta qualidade e estatísticas.
   - Navegue até `/temas` e abra os detalhes de uma palestra (ex: *Finanças Pessoais e Liberdade Financeira*).
   - Clique em **"Solicitar esta Palestra"**: o formulário abre com o tema já pré-selecionado.
   - Preencha com os dados do evento e envie para receber o protocolo legível (ex: `PAL-XXXX`).
   - Leia um dos artigos educativos na seção `/conteudos`.

2. **Jornada do Daniel (Painel Administrativo):**
   - Acesse `http://127.0.0.1:8000/admin` e faça login com `daniel.aihara@exemplo.com` / `admin123456`.
   - Veja o dashboard com os contadores do funil e a solicitação recém-enviada.
   - Abra a solicitação, teste o botão de contato direto por WhatsApp e avance os status pela máquina de estados.
   - Teste a recusa ou cancelamento para conferir a exigência obrigatória de justificativa (`RN-09`).
   - Acompanhe a linha do tempo imutável de auditoria registrando cada mudança.

---

## ☁️ Plano de Deploy Gratuito (Custo Zero)

Para a entrega final em nuvem sem custos operacionais (`RS-02`):

1. **Banco de Dados (Supabase / PostgreSQL Gratuito):**
   - Criar projeto no [Supabase](https://supabase.com).
   - Inserir a string de conexão em `.env`:
     `DATABASE_URL="postgresql://postgres:sua_senha@db.xxxx.supabase.co:5432/postgres"`
   - As migrações executam automaticamente.

2. **Hospedagem da Aplicação Web (Railway ou Render):**
   - Conectar o repositório GitHub ao [Railway](https://railway.app) ou [Render](https://render.com).
   - Comando de inicialização: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
   - O deploy é automático e inclui certificado SSL/HTTPS gratuito.

---

## 📄 Licença e Entrega

Projeto acadêmico sob licença do **Centro Universitário do Triângulo (UNITRI)** entregue ao cliente **Daniel Takeo Aihara**.
