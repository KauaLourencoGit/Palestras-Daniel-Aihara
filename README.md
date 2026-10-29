# Site e Gestão de Palestras — Daniel Aihara

> **Especificação de Software v1.0**  
> **Instituição:** Centro Universitário do Triângulo (UNITRI) — 2026-2  
> **Cursos:** N385 Ciência da Computação / N392 Análise e Desenvolvimento de Sistemas  
> **Cliente:** Daniel Takeo Aihara (Educação Financeira)  
> **Equipe de Produto:** Grupo 4 (Arthur Rodrigues Monteiro, Dyego Adriano Moura Alcântara, Guilherme Aoyagui Ide, Guilherme Ferreira de Freitas, Maria Fernanda Micheline Pereira e Platão Leonel de Souza Júnior)  
> **Orientação e Revisão:** Prof. Milton Miranda Neto  

---

## 📌 Sobre o Projeto

O **Site e Gestão de Palestras** é uma aplicação web desenvolvida para centralizar a apresentação profissional do palestrante de educação financeira **Daniel Takeo Aihara** e automatizar o funil de atendimento e agendamento de palestras para empresas, escolas e instituições.

Diferente de um site institucional estático, o sistema possui lógica de negócio dedicada ao gerenciamento de disponibilidade de datas, prevenção de conflitos de agendamento, controle de pré-reservas temporárias e registro de propostas.

---

## 🚀 Principais Funcionalidades

### 🌐 Módulo Público (Site Institucional)
- **Apresentação e Trajetória:** Página sobre a carreira e público-alvo.
- **Catálogo de Temas:** Lista de palestras ativas com detalhes sobre duração, formatos (presencial/online) e público indicado.
- **Formulário de Solicitação:** Coleta estruturada dos dados do evento (organização, responsável, público estimado, datas desejadas, cidade/UF).
- **Artigos e Conteúdos:** Publicação de conteúdos de educação financeira em Markdown.
- **Proteção Antispam e Privacidade:** Validação com campo-armadilha, limite de envios por IP, prevenção de duplicidade e termo de consentimento (LGPD).

### 🔐 Módulo Privado (Painel de Gestão)
- **Gestão de Solicitações:** Acompanhamento do ciclo de vida completo de cada pedido:
  `NOVA` ➔ `EM_ANALISE` ➔ `PROPOSTA_ENVIADA` ➔ `CONFIRMADA` ➔ `REALIZADA` (com opções de `RECUSADA` e `CANCELADA`).
- **Proposta e Pré-Reserva Automática:** Ao registrar uma proposta, a data do evento fica pré-reservada por 7 dias (configurável).
- **Agenda Sem Conflitos:** Controle de limite diário de palestras e bloqueio de datas pessoais/viagens.
- **Histórico Auditável:** Registro imutável de todas as transições de status e alterações de proposta.
- **Gestão de Conteúdo e Temas:** Painel para cadastro e ordenação de temas de palestras e publicação de artigos.

---

## ⚙️ Regras de Negócio Críticas

- **RN-01 (Solicitação completa):** Validação rígida de campos obrigatórios e geração de protocolo único (ex.: `PAL-407K`).
- **RN-04 & RN-06 (Ocupação e Confirmação sem Conflito):** A confirmação de uma palestra ou pré-reserva utiliza transação de banco com trava de linha (`SELECT FOR UPDATE`) e restrição `UNIQUE (data, slot)` para garantir concorrência e zero duplicidade de agenda.
- **RN-07 (Expiração de Pré-reserva):** Rotina automática retorna solicitações com pré-reserva vencida para `EM_ANALISE` e libera a data.
- **RN-17 (Retenção LGPD):** Anonimização automática de dados de contato após 24 meses do encerramento da solicitação.

---

## 🛠️ Arquitetura e Tecnologias (Recomendadas)

A especificação prevê uma arquitetura de monólito modular de baixo custo de manutenção:

- **Front-end / SSR:** Next.js, Astro + SPA, Django Templates ou Razor Pages.
- **Back-end:** Node.js (Next.js / NestJS), Python (Django / FastAPI) ou C# (.NET Core).
- **Banco de Dados:** PostgreSQL (suporte a transações ACID e restrições de chave única por data e slot).
- **Envio de E-mail:** Serviço transacional (SMTP/API) para alertas de novos pedidos.

---

## 📂 Estrutura de Rotas e API (Resumo)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/publico/temas` | Lista catálogo de palestras ativas |
| `POST` | `/api/publico/solicitacoes` | Envia nova solicitação de palestra |
| `POST` | `/api/auth/login` | Autenticação no painel |
| `GET` | `/api/solicitacoes` | Lista solicitações com filtros por status |
| `POST` | `/api/solicitacoes/{id}/proposta` | Registra proposta e gera pré-reserva |
| `POST` | `/api/solicitacoes/{id}/confirmacao` | Confirma agendamento na data |
| `GET` | `/api/agenda` | Visão mensal da agenda (confirmados/bloqueados) |

---

## 🧪 Estratégia de Testes

O projeto exige cobertura de testes automatizados focados no módulo de solicitações e agenda:
- **Testes Unitários:** Validação da máquina de estados e janela de antecedência de datas.
- **Testes de Integração:** Teste de concorrência disparando múltiplas confirmações simultâneas para o mesmo dia (`CT-08`).
- **Testes de Aceitação:** Validação do fluxo do contratante até o painel administrativo.

---

## 📋 Licença e Entrega

Projeto acadêmico de extensão do **Centro Universitário do Triângulo (UNITRI)**.  
Entregável sob licença e posse das credenciais de hospedagem e domínio diretas para o cliente.

```
