# Planejamento de Desenvolvimento (Kanban) — Grupo 4
**Projeto:** Plataforma Institucional e Gestão de Palestras — Daniel Takeo Aihara  
**Metodologia:** Kanban iterativo dividido em 2 Sprints (Priorização MoSCoW)

---

## 1. Visão Geral do Quadro Kanban

| Backlog (Should-Have) | To Do — Sprint 1 (MVP Core) | To Do — Sprint 2 (Agenda e RNFs) | Em Andamento (Doing) | Em Revisão / QA | Concluído (Done) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[US01]** Seção Institucional "Conhecer o Daniel" | **[INFRA-01]** Setup do repositório, banco de dados e autenticação (`RNF-04`, `RNF-05`) | **[US07 / UC07]** Módulo de Agenda e controle de datas disponíveis | *Alocar cards ativos da equipe* | *Validação Dado/Quando/Então e testes de viewport/carga* | **[DOC-01]** Escopo, Personas, US, UML e RNFs validados com o cliente |
| **[US02]** Área de Conteúdos de Educação Financeira | **[US03]** Catálogo de Palestras e Temas com CTA para solicitação | **[US07 / UC07]** Regra de bloqueio de conflito de datas e bloqueio manual | | | |
| **[US05]** Página/Canal de Contato Geral com confirmação | **[US04 / UC04]** Formulário estruturado de Solicitação de Palestra (`RNF-07`) | **[US08 / UC08]** Log imutável e visualização de Histórico de Status (`RNF-06`) | | | |
| **[RF06 / RF07]** Seção de Depoimentos/Projetos e links de Redes Sociais | **[US06 / UC06]** Painel do Daniel: Listagem e atualização de status das solicitações | **[QA / RNF]** Ajustes de responsividade (`RNF-03`), desempenho (`RNF-01`, `RNF-02`) e `README.md` (`RNF-08`) | | | |

---

## 2. Detalhamento dos Cards por Sprint

### Sprint 1 — Fluxo Básico de Solicitação e Gestão (Must-Have)
**Meta da Sprint:** Permitir que contratantes avaliem os temas e enviem solicitações de palestra, e que Daniel acesse o painel restrito para gerenciar o status de cada pedido.

#### Card 1: `[INFRA-01]` Arquitetura Base, Banco de Dados e Autenticação
* **Prioridade:** Must-Have
* **Requisitos Associados:** `RNF-04`, `RNF-05`
* **Tarefas Técnicas:**
  - [ ] Inicializar repositório e definir estrutura de pastas do projeto.
  - [ ] Modelar tabelas principais: `usuarios` (admin Daniel), `palestras`, `solicitacoes`, `historico_solicitacoes` e `bloqueios_agenda`.
  - [ ] Implementar tela de login e middleware de proteção de rotas para o painel administrativo de Daniel (`RNF-04`).
  - [ ] Garantir armazenamento de senha no banco utilizando hash seguro, como bcrypt ou Argon2 (`RNF-05`).
* **Critério de Pronto (DoD):** Acesso anônimo bloqueado nas rotas administrativas; senha persistida com hash no banco de dados.

#### Card 2: `[US03]` Catálogo de Palestras e Temas (Front-end / Back-end)
* **Prioridade:** Must-Have
* **Personas:** Mariana Oliveira (RH) / Ricardo Martins (Eventos)
* **Tarefas Técnicas:**
  - [ ] Criar endpoint/consulta para listar os temas de palestras disponíveis.
  - [ ] Construir página/seção exibindo os cards de temas de palestras.
  - [ ] Criar visualização de detalhes da palestra (público-alvo, objetivos, formato) com botão de chamada para ação (**"Solicitar Palestra"**).
* **Critério de Pronto (DoD):** Usuário visualiza temas, abre os detalhes e consegue navegar diretamente para o formulário de solicitação pré-selecionando o tema desejado.

#### Card 3: `[US04 / UC04]` Formulário de Solicitação de Palestra
* **Prioridade:** Must-Have
* **Personas:** Ricardo Martins / Mariana Oliveira
* **Requisitos Associados:** `UC04`, `RNF-07`
* **Tarefas Técnicas:**
  - [ ] Construir formulário com os campos validados: **Empresa/Organização, Nome/Contato, E-mail/Telefone, Data Desejada, Cidade, Formato (Presencial/Online), Público Estimado e Tema**.
  - [ ] Implementar validação no front-end e no back-end destacando campos obrigatórios pendentes com mensagens claras próximas ao campo inválido (`RNF-07`).
  - [ ] Persistir nova solicitação no banco com status inicial padrão `Nova`.
  - [ ] Exibir tela ou mensagem clara de confirmação após o envio bem-sucedido.
* **Critério de Pronto (DoD):** Solicitação válida é gravada com status `Nova`; submissão incompleta é impedida e sinaliza visualmente os campos faltantes.

#### Card 4: `[US06 / UC06]` Painel de Gerenciamento de Solicitações e Funil de Status
* **Prioridade:** Must-Have
* **Ator:** Daniel Takeo Aihara
* **Requisitos Associados:** `UC06`, `RNF-02`
* **Tarefas Técnicas:**
  - [ ] Criar dashboard administrativo listando todas as solicitações recebidas com filtros por status e data.
  - [ ] Garantir indexação/paginação para que consultas e filtros respondam em até 2 segundos com até 1.000 registros (`RNF-02`).
  - [ ] Implementar regra de negócio (máquina de estados) para alteração de status:
    * **Fluxo principal:** `Nova` para `Em análise` para `Proposta enviada` para `Confirmada` para `Realizada`.
    * **Estados alternativos:** `Recusada` e `Cancelada`.
  - [ ] Bloquear transições inválidas (exemplo: alterar de `Recusada` diretamente para `Realizada`).
* **Critério de Pronto (DoD):** Daniel visualiza os pedidos no painel e atualiza o status respeitando todas as regras de transição do fluxo.

---

### Sprint 2 — Agenda, Rastreabilidade, Conteúdo Institucional e Acabamento
**Meta da Sprint:** Garantir o controle de disponibilidade sem conflito de datas, preservar a rastreabilidade completa de negociações e entregar a camada institucional e educativa do site.

#### Card 5: `[US07 / UC07]` Controle de Agenda e Bloqueio de Conflitos
* **Prioridade:** Must-Have
* **Ator:** Daniel Takeo Aihara
* **Requisitos Associados:** `UC07`
* **Tarefas Técnicas:**
  - [ ] Implementar verificação automática ao alterar o status para `Confirmada`: verificar se já existe outra palestra `Confirmada` ou bloqueio ativo na mesma data, exibindo alerta e impedindo o conflito.
  - [ ] Criar interface para Daniel registrar bloqueios manuais de datas indisponíveis (viagens, compromissos externos).
  - [ ] Implementar liberação automática da data na agenda caso uma solicitação anteriormente `Confirmada` mude para `Cancelada`.
* **Critério de Pronto (DoD):** Sistema impede duas confirmações na mesma data, permite bloqueio manual e libera a data automaticamente após cancelamento.

#### Card 6: `[US08 / UC08]` Histórico e Rastreabilidade de Solicitações
* **Prioridade:** Must-Have
* **Ator:** Daniel Takeo Aihara
* **Requisitos Associados:** `UC08`, `RNF-06`
* **Tarefas Técnicas:**
  - [ ] Criar serviço/trigger que, a cada alteração de status em `UC06`, insira um novo registro na tabela `historico_solicitacoes` (status anterior, novo status, data/hora e observação) sem sobrescrever registros anteriores (`RNF-06`).
  - [ ] Criar modal ou aba de linha do tempo (timeline) nos detalhes da solicitação para consulta do histórico completo, inclusive de solicitações já encerradas (`Realizada`, `Recusada`, `Cancelada`).
* **Critério de Pronto (DoD):** Todas as mudanças de status aparecem em ordem cronológica na solicitação e permanecem intactas após a conclusão do ciclo.

#### Card 7: `[US01 / US02 / US05]` Módulo Institucional, Conteúdos e Contato Geral
* **Prioridade:** Should-Have
* **Personas:** Visitante Geral / Lucas Ferreira
* **Requisitos Associados:** `RF06`, `RF07`
* **Tarefas Técnicas:**
  - [ ] **[US01]** Implementar seção de apresentação profissional, biografia e trajetória do Daniel.
  - [ ] **[US02]** Implementar área de conteúdos de educação financeira (listagem organizada e página de leitura de artigos/dicas).
  - [ ] **[US05]** Implementar formulário simples de contato geral para dúvidas, com mensagem de confirmação de envio.
  - [ ] **[RF06 / RF07]** Adicionar seção de depoimentos/projetos realizados e links diretos para redes sociais.
* **Critério de Pronto (DoD):** Jornada institucional completa (*Conhecer, Aprender, Confiar e Contatar*) navegável e integrada ao site.

#### Card 8: `[QA / RNF]` Testes Não Funcionais, Responsividade e Documentação
* **Prioridade:** Must-Have (Entrega Final)
* **Requisitos Associados:** `RNF-01`, `RNF-03`, `RNF-08`
* **Tarefas Técnicas:**
  - [ ] Testar e ajustar layout nas larguras `360px` (mobile), `768px` (tablet) e `1366px` (desktop) sem quebra de layout ou perda de conteúdo (`RNF-03`).
  - [ ] Otimizar imagens, scripts e consultas para garantir o carregamento das páginas principais e do painel em até 3 segundos (`RNF-01`).
  - [ ] Redigir o arquivo `README.md` na raiz do repositório com instruções passo a passo de instalação, configuração do banco de dados, variáveis de ambiente (`.env.example`) e execução local (`RNF-08`).
* **Critério de Pronto (DoD):** Todos os 8 Requisitos Não Funcionais verificados e repositório documentado pronto para avaliação.

---

## 3. Matriz de Verificação de Requisitos Não Funcionais (Checklist de QA)

| Código | Categoria | Meta / Parâmetro Verificável | Status |
| :--- | :--- | :--- | :---: |
| **RNF-01** | Desempenho | Carregamento das páginas principais e painel em até 3 segundos. | [ ] |
| **RNF-02** | Desempenho | Listagem e filtragem de solicitações em até 2 segundos (até 1.000 registros). | [ ] |
| **RNF-03** | Usabilidade | Layout responsivo sem quebras em `360px`, `768px` e `1366px`. | [ ] |
| **RNF-04** | Segurança | Rotas de gerenciamento restritas a usuário autenticado (bloqueio de acesso anônimo). | [ ] |
| **RNF-05** | Segurança | Senhas armazenadas com algoritmo de hash seguro (sem texto puro). | [ ] |
| **RNF-06** | Confiabilidade | Preservação integral do histórico de status sem sobrescrever registros anteriores. | [ ] |
| **RNF-07** | Usabilidade | Validação de campos obrigatórios nos formulários com mensagens junto ao campo inválido. | [ ] |
| **RNF-08** | Manutenibilidade | `README.md` completo com instruções de instalação, configuração e execução. | [ ] |

---

## 4. Definição de Pronto (Definition of Done - DoD) Global da Equipe

Para que qualquer card seja movido da coluna **Em Revisão / QA** para **Concluído (Done)**, ele deve obrigatoriamente atender aos seguintes critérios:
1. Todos os cenários **Dado / Quando / Então** da respectiva User Story foram testados e aprovados.
2. O layout da funcionalidade não apresenta quebras nas resoluções `360px`, `768px` e `1366px` (`RNF-03`).
3. As rotas administrativas envolvidas exigem sessão autenticada (`RNF-04`).
4. O código foi revisado por pelo menos um integrante do grupo (Pull Request aprovado) e integrado à branch principal sem conflitos.