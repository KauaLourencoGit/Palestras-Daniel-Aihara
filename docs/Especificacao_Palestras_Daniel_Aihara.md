# Especificação de Software — Site e Gestão de Solicitações de Palestras (Daniel Takeo Aihara)

*Documento de referência para handoff à equipe de desenvolvimento (Fase 2)*

Versão 1.0 — 16/10/2026 · Cliente: Daniel Takeo Aihara · Equipe de produto: Grupo 4 · Revisão: Prof. Milton Miranda Neto

## 1. Sobre este documento

### 1.1 Finalidade

Este documento especifica o **site profissional e o módulo de gestão de solicitações de palestras** de Daniel Takeo Aihara. O nível de detalhe permite que uma equipe que nunca falou com o cliente consiga planejar, construir, testar e implantar o sistema.

O documento tem duas funções:

1. **Pacote de handoff.** É o que a equipe desenvolvedora recebe na troca de projetos e usa no Sprint Planning.
2. **Modelo de referência para a turma.** Mostra como uma demanda que nasceu como "site institucional" foi transformada num sistema com lógica de negócio real: um funil de status, uma agenda sem conflitos e um histórico auditável.

> **Origem.** Esta especificação parte do trabalho do **Grupo 4**: Arthur Rodrigues Monteiro, Dyego Adriano Moura Alcântara, Guilherme Aoyagui Ide, Guilherme Ferreira de Freitas, Maria Fernanda Micheline Pereira e Platão Leonel de Souza Júnior. O grupo fez o levantamento e a validação do escopo revisado com o cliente. As lacunas foram completadas pelo professor com critérios de engenharia de software. Tudo o que **não** veio do cliente está marcado como **premissa [P-xx]** ou **decisão de engenharia [D-xx]** e deve ser confirmado com ele (Seção 18).

### 1.2 Como ler

| Se você é... | Leia primeiro | Depois |
|---|---|---|
| Product Owner / Scrum Master da equipe desenvolvedora | 2, 3, 14 | 18 (o que confirmar com o cliente) |
| Desenvolvedor(a) back-end | 5, 6, 10, 13 | 7, 9, 15 |
| Desenvolvedor(a) front-end | 4, 8, 11 | 7, 12 |
| Responsável por testes | 8, 15 | 5, 6.4 |
| Aluno usando como modelo | Todo o documento, em ordem | Compare com o seu e veja o que falta |

### 1.3 Convenções de identificação

| Prefixo | Significado | Exemplo |
|---|---|---|
| OBJ-xx | Objetivo de negócio | OBJ-01 Nenhum pedido de palestra perdido |
| P-xx | Premissa adotada pela engenharia (a confirmar) | P-01 Uma palestra confirmada por dia |
| D-xx | Decisão de engenharia (a validar) | D-01 Proposta cria pré-reserva da data |
| RN-xx | Regra de negócio | RN-04 Ocupação de datas |
| RF-xx | Requisito funcional | RF-24 Verificar conflito ao propor e confirmar |
| RNF-xx | Requisito não funcional | RNF-01 Nenhuma data com mais confirmações que o limite |
| US-xx | História de usuário | US-04 Solicitar uma palestra |
| UC-xx | Caso de uso | UC-08 Confirmar palestra |
| T-xx | Tela (wireframe) | T05 Solicitar palestra |
| CT-xx | Caso de teste de aceitação | CT-08 Duas confirmações simultâneas na mesma data |
| Q-xx | Questão em aberto para o cliente | Q-03 Faz mais de uma palestra no mesmo dia? |

**Prioridade (MoSCoW).** *Must*: sem o item, a entrega não tem valor. *Should*: importante, entra logo depois do núcleo. *Could*: desejável, entra se houver folga. *Won't*: conscientemente fora deste semestre.

### 1.4 Controle de versões

| Versão | Data | Autor | Alteração |
|---|---|---|---|
| 0.x | 08/2026 a 09/2026 | Grupo 4 | Cliente, visão, personas, 5 histórias, casos de uso, backlog e RNF (Semanas 2 a 6). Escopo original: site institucional. |
| 0.9 | 10/2026 | Grupo 4 | Escopo revisado e validado com o cliente: módulo de solicitações, status, agenda e histórico. Critérios de aceite e RNF mensuráveis. |
| 1.0 | 16/10/2026 | Prof. Milton Miranda Neto | Documento de referência: máquina de estados completa, regras de agenda e conflito, premissas explícitas, diagramas UML, wireframes, recomendações técnicas, plano de testes e de Sprints |

### 1.5 Glossário

| Termo | Significado |
|---|---|
| Solicitação | Pedido de palestra enviado pelo formulário do site por um contratante. Tem protocolo, status e histórico. |
| Contratante | Pessoa que pede a palestra em nome de uma organização (empresa, escola, prefeitura, associação). |
| Tema | Palestra do catálogo do Daniel, com título, resumo, duração, público indicado e formatos. |
| Proposta | Condições que o Daniel combinou ou ofereceu ao contratante: data do evento, horário, valor (interno) e observações. A proposta é enviada **fora** do sistema (e-mail ou WhatsApp); o sistema só a registra. |
| Pré-reserva | Ocupação provisória de uma data enquanto a proposta aguarda resposta. Vale até `preReservaAte` (padrão: 7 dias). |
| Confirmação | Aceite da proposta pelo contratante, registrado pelo Daniel. A data passa a ocupada em definitivo. |
| Bloqueio | Dia inteiro em que o Daniel não aceita palestras (viagem, compromisso pessoal). |
| Ocupação da data | Tudo o que impede uma nova proposta ou confirmação naquele dia: confirmações, pré-reservas vigentes e bloqueios. |
| Limite diário | Quantidade máxima de palestras confirmadas ou pré-reservadas no mesmo dia (`palestrasPorDia`, padrão 1). |
| Protocolo | Código curto e legível da solicitação (ex.: `PAL-4Q7K`), usado na comunicação com o contratante. |
| Conteúdo | Artigo de educação financeira publicado no site. |

## 2. Contexto do negócio

### 2.1 O cliente

| Item | Informação |
|---|---|
| Cliente | Daniel Takeo Aihara |
| Atividade | Profissional da área financeira que atua com educação financeira e palestras para empresas, escolas e instituições |
| Usuário do painel | O próprio Daniel |
| Equipe de produto | Grupo 4 |
| Validação | Escopo revisado aprovado pelo cliente. **O registro não informa data nem forma da conversa (Q-01).** |

### 2.2 Como funciona hoje (AS-IS)

Como o processo atual não foi detalhado pelo cliente (Q-02), a descrição abaixo é a hipótese que o grupo registrou e que o cliente aprovou ao validar o escopo:

1. O interessado conhece o Daniel por indicação ou redes sociais e entra em contato por canais soltos (mensagem, e-mail).
2. As informações do evento chegam incompletas e precisam ser perguntadas uma a uma (data, cidade, público, formato, tema).
3. O andamento de cada pedido fica na memória do Daniel ou em conversas espalhadas.
4. Não existe um lugar único que mostre quais datas já estão comprometidas.

### 2.3 Problemas identificados

| # | Problema | Consequência |
|---|---|---|
| PR-01 | Não há presença profissional que apresente o Daniel e suas palestras | Contratantes não conseguem avaliar temas, experiência e adequação ao público |
| PR-02 | Pedidos chegam por canais soltos e incompletos | Retrabalho para coletar dados; risco de esquecer um pedido |
| PR-03 | Não há visão do andamento de cada pedido | Demora para responder; propostas sem acompanhamento |
| PR-04 | Não há agenda única das datas comprometidas | Risco de aceitar duas palestras na mesma data |
| PR-05 | Não há histórico das negociações | Difícil retomar contatos antigos ou entender por que um pedido não avançou |

### 2.4 Objetivos de negócio e como medir

| ID | Objetivo | Indicador (medido 30 dias após a implantação) |
|---|---|---|
| OBJ-01 | Nenhum pedido de palestra perdido | 100% dos pedidos do site com protocolo e status |
| OBJ-02 | Receber pedidos completos | ≥ 90% das solicitações sem necessidade de perguntar dados obrigatórios |
| OBJ-03 | Responder mais rápido | Mediana entre NOVA e EM_ANALISE ≤ 2 dias úteis |
| OBJ-04 | Nunca confirmar duas palestras em conflito | Zero datas com confirmações acima do limite diário |
| OBJ-05 | Fortalecer a autoridade profissional | Site publicado em domínio próprio, com catálogo de temas e conteúdos |

### 2.5 Partes interessadas

| Parte interessada | Interesse | Participação |
|---|---|---|
| Daniel Takeo Aihara | Organizar a contratação, transmitir credibilidade | Valida escopo, homologa e recebe o sistema |
| Contratantes (RH, organizadores, escolas) | Avaliar e pedir uma palestra sem burocracia | Usuários públicos; teste de usabilidade |
| Visitantes interessados em finanças | Conteúdo claro e confiável | Leitores do site |
| Grupo 4 (equipe de produto) | Fidelidade ao escopo validado | Ponte com o cliente; avalia a equipe desenvolvedora (VT) |
| Equipe desenvolvedora | Especificação clara e estável | Constrói, testa e entrega |
| Professor | Aprendizagem e qualidade | Acompanha Sprints e avalia |

> **Para os alunos.** O ponto de virada deste projeto foi perceber que "site institucional" não era o problema. O problema era **gerenciar pedidos de palestra sem perder nenhum e sem conflito de datas**. Sempre pergunte: "o que acontece depois que alguém clica em *Entrar em contato*?". É aí que costuma estar o sistema.

## 3. Visão do produto

### 3.1 Declaração de visão

> **Para** empresas, escolas e organizadores de eventos que buscam um palestrante de educação financeira, e **para** o próprio Daniel, que hoje recebe pedidos por canais soltos, **o Site e Gestão de Palestras** é uma aplicação web **que** apresenta o Daniel e seus temas, recebe pedidos completos e acompanha cada pedido por etapas, do primeiro contato até a palestra realizada. **Diferentemente** de um site-cartão ou de conversas no WhatsApp, ele **nunca perde um pedido**, mostra em que etapa cada negociação está e **impede confirmar duas palestras na mesma data**.

### 3.2 Diagrama de contexto

![Figura 1 — Diagrama de contexto: atores, sistema e fronteira](diagramas/01_contexto.png)

### 3.3 Escopo

**Dentro do escopo** (validado com o cliente)

- Site público: apresentação do Daniel, catálogo de temas de palestra, conteúdos de educação financeira e contato.
- Formulário estruturado de solicitação de palestra, com protocolo.
- Painel do Daniel: lista de solicitações, mudança de status, registro de proposta e histórico.
- Fluxo de status: Nova → Em análise → Proposta enviada → Confirmada → Realizada, com Recusada e Cancelada.
- Agenda com bloqueio de datas e sem confirmações conflitantes.
- Histórico de cada solicitação.

**Acrescentado pela engenharia** (a confirmar, ver premissas)

- Pré-reserva automática da data enquanto a proposta aguarda resposta (D-01, P-02).
- Aviso por e-mail ao Daniel a cada nova solicitação (P-05).
- Gerenciamento de conteúdos pelo painel, com rascunho e publicação (P-04, Should).

**Fora do escopo (Won't neste semestre)**

| Item | Motivo |
|---|---|
| Pagamento online, contrato digital, emissão de nota | Envolve dados financeiros e validade jurídica; a contratação é concluída fora do sistema |
| Exibição de preços no site | Proposta é individual e negociada (P-06) |
| Agenda pública de datas livres | Exporia a agenda pessoal do Daniel; o formulário avisa que a data depende de confirmação (D-03) |
| Cursos, área de alunos, venda de conteúdo | Fora do escopo levantado na Semana 2 |
| Simuladores e consultoria financeira automatizada | Fora do escopo levantado; risco de orientação financeira automatizada |
| Integração com Google Agenda, WhatsApp ou redes sociais | Exige integrações de terceiros (Plano de Ensino, 5.1) |
| Aplicativo nativo | Uma aplicação web responsiva atende |
| Vários usuários e perfis no painel | Só o Daniel usa; assistente fica como evolução (P-11) |

### 3.4 Restrições

| ID | Restrição |
|---|---|
| RS-01 | Prazo: entrega final em **03/12/2026**, em dois Sprints de desenvolvimento |
| RS-02 | Custo operacional mensal ≤ R$ 50, idealmente zero, com contas em nome do Daniel (P-12) |
| RS-03 | Nenhum fluxo obrigatório depende de API paga |
| RS-04 | Interface em português do Brasil |
| RS-05 | Tecnologia e arquitetura são decisão da equipe desenvolvedora; a Seção 13 é só recomendação |
| RS-06 | Projeto acadêmico de extensão, sem custo para o cliente e sem garantia de suporte após a entrega |

### 3.5 Premissas adotadas

Estas definições **não** foram respondidas pelo cliente. Viram parâmetros configuráveis sempre que possível e devem ser confirmadas até a Review do Sprint 1 (Seção 18).

| ID | Premissa | Justificativa |
|---|---|---|
| P-01 | **Uma palestra por dia** (`palestrasPorDia = 1`) | Palestras envolvem deslocamento e preparação. O limite é configurável se o Daniel fizer, por exemplo, uma presencial e uma online no mesmo dia (Q-03). |
| P-02 | Ao registrar uma proposta, a data fica **pré-reservada por 7 dias** (`diasPreReserva`) | Evita oferecer a mesma data a dois contratantes ao mesmo tempo. Sem resposta no prazo, a data é liberada (Q-04). |
| P-03 | **Bloqueios são de dia inteiro** | Simplifica a agenda. Meio período fica como evolução (Q-05). |
| P-04 | Conteúdos: no MVP, **arquivos Markdown versionados** no repositório (Must); no Sprint 2, **edição pelo painel** com rascunho e publicação (Should) | Garante conteúdo no ar sem depender de um CMS logo no início (Q-06). |
| P-05 | **E-mail de aviso ao Daniel** a cada nova solicitação (Should) | Sem aviso, o painel precisaria ser consultado ativamente; o serviço de e-mail tem plano gratuito (Q-09). |
| P-06 | **Valores não aparecem no site.** O valor da proposta é um campo interno e opcional do painel | A proposta é individual (Q-12). |
| P-07 | Formulário com **proteção contra spam** (campo-armadilha, limite por IP, detecção de duplicidade) | Formulário público sem proteção recebe robôs em poucos dias. |
| P-08 | Dados de contato tratados conforme a LGPD: consentimento, finalidade, acesso restrito ao Daniel, **anonimização 24 meses** após o fim da solicitação | Princípios de necessidade e finalidade. |
| P-09 | Data desejada entre **hoje + 7 dias** e **hoje + 18 meses** | Pedidos para "amanhã" raramente são viáveis; o limite é configurável (Q-10). |
| P-10 | O limite diário vale para palestras **presenciais e online** | Conservador; configurável junto com P-01 (Q-03). |
| P-11 | Um único usuário no painel (Daniel) | Validado implicitamente ("painel para Daniel"). Assistente fica como evolução. |
| P-12 | Hospedagem, domínio e e-mail em **contas criadas em nome do Daniel** | O cliente continua com o sistema após o semestre (Q-08). |

### 3.6 Decisões de engenharia

| ID | Decisão | Por quê |
|---|---|---|
| D-01 | Registrar proposta **cria automaticamente a pré-reserva** da data do evento | Liga a regra de agenda ao fluxo de status; o Daniel não precisa lembrar de "segurar" a data à parte. |
| D-02 | Pré-reserva vencida **devolve a solicitação para EM_ANALISE** e libera a data | Estado explícito em vez de uma proposta "fantasma" ocupando a agenda. |
| D-03 | A agenda **não é pública** | Preserva a agenda pessoal; o contratante informa a data desejada e uma alternativa. |
| D-04 | Conflito garantido **no servidor e no banco**: trava por dia + restrição única (data, vaga) | A verificação só na tela não impede duas confirmações simultâneas. |
| D-05 | A data do evento é definida **na proposta** e pode diferir da desejada | Negociação real costuma mudar a data. |

## 4. Usuários, personas e permissões

### 4.1 Atores

| Ator | Descrição | Autenticação |
|---|---|---|
| Visitante | Qualquer pessoa no site público | Nenhuma |
| Contratante | Visitante que envia uma solicitação de palestra | Nenhuma (acompanha por e-mail com o Daniel) |
| Daniel | Palestrante e administrador do painel | E-mail e senha |
| Relógio do sistema | Rotina agendada que expira pré-reservas e aplica a retenção de dados | Interna |

### 4.2 Personas

As personas são **fictícias** e foram definidas pelo Grupo 4. O único usuário real é o Daniel.

| Persona | Perfil | Objetivo | Dificuldade | Consequência para o sistema |
|---|---|---|---|---|
| **Mariana Oliveira**, 35 anos, analista de RH | Organiza ações internas de educação financeira | Comparar temas e iniciar uma contratação | Informações de palestrantes espalhadas | Catálogo de temas claro e caminho direto para solicitar (US-03, US-04) |
| **Ricardo Martins**, 41 anos, organizador de eventos | Precisa decidir rápido se o palestrante combina com o público | Verificar adequação e pedir uma data | Respostas lentas, dados repetidos | Formulário completo numa só vez, protocolo e retorno previsível (US-04) |
| **Lucas Ferreira**, 27 anos, jovem profissional | Quer aprender finanças com linguagem simples | Ler conteúdos confiáveis | Conteúdo superficial ou confuso | Área de conteúdos organizada (US-02) |
| **Daniel** (real) | Palestrante | Não perder pedidos, saber em que etapa cada um está, não marcar duas palestras no mesmo dia | Pedidos soltos e sem agenda única | Painel com funil, agenda e histórico (US-06 a US-09) |

### 4.3 Matriz de permissões

| Ação | Visitante / Contratante | Daniel |
|---|---|---|
| Ver site, temas e conteúdos publicados | ✔ | ✔ |
| Enviar solicitação e mensagem de contato | ✔ | ✔ |
| Ver solicitações e dados de contato | — | ✔ |
| Mudar status, registrar proposta, confirmar, recusar, cancelar | — | ✔ |
| Ver e editar a agenda (bloqueios) | — | ✔ |
| Manter temas, conteúdos e configuração | — | ✔ |
| Anonimizar dados de um contratante | — | ✔ |

> **Regra de ouro.** Toda rota do painel exige sessão válida, verificada **no servidor**. Nenhuma resposta pública contém dados de solicitações.

## 5. Regras de negócio

### 5.1 Parâmetros configuráveis

| Parâmetro | Valor inicial | Origem |
|---|---|---|
| Palestras por dia (`palestrasPorDia`) | 1 | P-01 |
| Dias de pré-reserva (`diasPreReserva`) | 7 | P-02 |
| Antecedência mínima da data desejada | 7 dias | P-09 |
| Horizonte da data desejada | 18 meses | P-09 |
| E-mail que recebe avisos | a informar (Q-09) | P-05 |
| Retenção de dados de contato | 24 meses após o fim | P-08 |
| Limite de solicitações por IP | 5 por hora | P-07 |
| Fuso horário | America/Sao_Paulo | Engenharia |

### 5.2 Regras

| ID | Regra | Origem |
|---|---|---|
| RN-01 | **Solicitação completa.** Obrigatórios: organização (2–120), nome do contato (2–100), e-mail válido, data desejada, cidade e UF, formato (presencial ou online), perfil do público (até 200) e consentimento. Opcionais: celular, tema do catálogo ou tema livre, data alternativa, público estimado (1–100.000), mensagem (até 2.000). Toda solicitação nasce **NOVA**, com protocolo. | Cliente (validação) |
| RN-02 | **Janela de datas.** Data desejada e alternativa entre `hoje + antecedência mínima` e `hoje + horizonte`. | P-09 |
| RN-03 | **Ciclo de vida.** Só as transições da Seção 6.4 são permitidas. O servidor recusa qualquer outra. | Cliente (validação) |
| RN-04 | **Ocupação da data.** Ocupam uma data: (a) solicitações CONFIRMADAS com aquela data de evento; (b) solicitações PROPOSTA_ENVIADA com pré-reserva vigente (`preReservaAte > agora`). Um dia com **bloqueio** fica totalmente indisponível. O total de (a) + (b) num dia nunca passa de `palestrasPorDia`, e o limite vale para presencial e online. | Cliente + P-01, P-10 |
| RN-05 | **Proposta reserva a data.** Registrar proposta exige status EM_ANALISE e data do evento **disponível** pela RN-04, desconsiderando a própria solicitação. Ao registrar, a data fica pré-reservada até `agora + diasPreReserva`. | D-01, P-02 |
| RN-06 | **Confirmação sem conflito.** Confirmar exige status PROPOSTA_ENVIADA e que a data continue disponível para esta solicitação: pré-reserva própria vigente, ou vencida mas com o dia ainda livre. A verificação e a gravação acontecem numa única transação. | Cliente (validação) + D-04 |
| RN-07 | **Expiração da pré-reserva.** Quando `preReservaAte ≤ agora` e a solicitação continua PROPOSTA_ENVIADA, a rotina a devolve para **EM_ANALISE**, libera a data e registra evento com autor SISTEMA. O Daniel pode registrar nova proposta (mesma ou outra data) se o dia estiver livre. | D-02 |
| RN-08 | **Bloqueio de agenda.** Bloqueios são de dia inteiro, com motivo interno (3–120 caracteres). Não é permitido bloquear um dia com confirmação ou pré-reserva vigente; o sistema lista as solicitações em conflito. | Cliente (validação) + P-03 |
| RN-09 | **Recusa e cancelamento exigem motivo** (3–300 caracteres). Recusa: de NOVA, EM_ANALISE ou PROPOSTA_ENVIADA. Cancelamento: de CONFIRMADA. Ambos liberam a data. | Engenharia |
| RN-10 | **Realizada só depois do evento.** CONFIRMADA → REALIZADA apenas quando `dataEvento ≤ hoje`. | Engenharia |
| RN-11 | **Data do evento negociável.** A data do evento é definida na proposta e pode ser diferente da desejada. | D-05 |
| RN-12 | **Histórico imutável.** Toda transição, proposta, renovação ou expiração gera um evento com status anterior e novo, motivo, autor e momento. Eventos não são editados nem apagados. | Cliente (validação) |
| RN-13 | **Versão.** Toda alteração de solicitação informa a versão lida. Se outra alteração aconteceu antes, a operação é recusada e a tela recarrega. | Engenharia |
| RN-14 | **Sem preços no site.** O valor da proposta é interno e opcional e nunca aparece em páginas públicas nem em e-mails ao contratante. | P-06 |
| RN-15 | **Privacidade.** Dados de solicitações e mensagens só são visíveis no painel. Respostas públicas nunca revelam se uma data está ocupada. | D-03, P-08 |
| RN-16 | **Anti-spam e duplicidade.** O formulário rejeita envios com o campo-armadilha preenchido e limita envios por IP. Mesmo e-mail com a mesma data desejada nas últimas 24 h devolve o protocolo existente, sem duplicar. | P-07 |
| RN-17 | **Retenção.** Solicitações RECUSADAS, CANCELADAS ou REALIZADAS há mais de 24 meses têm nome, e-mail, celular e mensagem anonimizados. Organização, datas, tema e status são mantidos para estatística. | P-08 |
| RN-18 | **Catálogo preservado.** Temas inativos saem do site e do formulário. O título do tema é copiado para a solicitação, de modo que pedidos antigos continuam legíveis. | Engenharia |
| RN-19 | **Conteúdo publicado.** Só conteúdos com situação PUBLICADO aparecem no site. Despublicar retira imediatamente. | P-04 |
| RN-20 | **Hora oficial.** Janelas de data, pré-reserva, expiração e "realizada" usam o relógio do servidor no fuso configurado. | Engenharia |

> **Para os alunos.** RN-04 a RN-07 são o coração do sistema. Repare que nenhuma delas fala de tela: falam de **estados e de datas**. Se a equipe desenvolvedora implementar essas quatro regras com testes, o resto é cadastro.

## 6. Modelo de domínio

### 6.1 Diagrama de classes — núcleo de solicitações

![Figura 2 — Classes do núcleo: solicitação, proposta, ocupação de datas e histórico](diagramas/04a_dominio_solicitacoes.png)

### 6.2 Diagrama de classes — site e configuração

![Figura 3 — Classes de apoio: conteúdos, mensagens, usuário e configuração](diagramas/04b_dominio_site.png)

### 6.3 Dicionário de dados — Solicitação e ocupação

| Entidade / atributo | Tipo | Regra |
|---|---|---|
| Solicitacao.protocolo | texto(10) | Único, legível, sem caracteres ambíguos (ex.: `PAL-4Q7K`) |
| Solicitacao.temaTitulo | cópia | Título do tema no momento do envio (RN-18) |
| Solicitacao.status | enumeração | Seção 6.4 |
| Solicitacao.versao | inteiro | Incrementada a cada alteração (RN-13) |
| Solicitacao.consentimentoEm | data-hora | Obrigatório (RN-01, P-08) |
| Proposta.dataEvento | data | Pode diferir da desejada (RN-11) |
| Proposta.valorCentavos | inteiro | Interno e opcional (RN-14) |
| Proposta.preReservaAte | data-hora | `enviadaEm + diasPreReserva` (RN-05) |
| ReservaData.(data, slot) | data + 1..N | **Único** no banco; `slot ≤ palestrasPorDia` (D-04) |
| ReservaData.tipo | PRE_RESERVA / CONFIRMADA | Pré-reserva tem `expiraEm`; confirmada não |
| BloqueioData.data | data | Único; dia inteiro (RN-08) |
| EventoSolicitacao | registro | Imutável (RN-12) |

### 6.4 Ciclo de vida da solicitação

![Figura 4 — Diagrama de estados da solicitação](diagramas/05_estados.png)

| De | Para | Quem | Condição | Efeito na agenda |
|---|---|---|---|---|
| (novo) | NOVA | Contratante | RN-01, RN-02, RN-16 | — |
| NOVA | EM_ANALISE | Daniel | Abrir e assumir a análise | — |
| EM_ANALISE | PROPOSTA_ENVIADA | Daniel | Data do evento disponível (RN-05) | Cria PRÉ-RESERVA |
| PROPOSTA_ENVIADA | PROPOSTA_ENVIADA (renovada) | Daniel | Data ainda disponível | Estende `preReservaAte` |
| PROPOSTA_ENVIADA | EM_ANALISE | Relógio / Daniel | Pré-reserva vencida (RN-07) ou proposta retirada | Libera a data |
| PROPOSTA_ENVIADA | CONFIRMADA | Daniel | Aceite do contratante; data disponível (RN-06) | PRÉ-RESERVA → CONFIRMADA |
| CONFIRMADA | REALIZADA | Daniel | `dataEvento ≤ hoje` (RN-10) | Mantém (histórico) |
| NOVA, EM_ANALISE, PROPOSTA_ENVIADA | RECUSADA | Daniel | Motivo (RN-09) | Libera, se houver |
| CONFIRMADA | CANCELADA | Daniel | Motivo (RN-09) | Libera a data |

**Estados finais:** REALIZADA, RECUSADA e CANCELADA. Não há reabertura. Se o contratante voltar, abre-se uma nova solicitação.

### 6.5 Ocupação de datas: exemplo

Com `palestrasPorDia = 1`:

| Dia | Situação | Nova proposta para o dia? | Confirmar para o dia? |
|---|---|---|---|
| 12/11 | PAL-7H1R CONFIRMADA | Não | Não |
| 20/11 | PAL-8M2D EM_ANALISE (sem proposta) | Sim | — |
| 28/11 | PAL-2C9T com pré-reserva até 23/10 | Não (até 23/10) | Só a PAL-2C9T |
| 28/11, após 23/10 sem resposta | PAL-2C9T volta para EM_ANALISE | Sim | — |
| 07/11 | Bloqueado ("viagem") | Não | Não |

> **Decisão de engenharia.** Uma regra só na tela ("o calendário mostra o dia ocupado") não impede que duas abas confirmem ao mesmo tempo. Por isso a ocupação é uma **tabela** com restrição única (data, vaga), e a gravação acontece sob trava do dia (Seção 10.2).

## 7. Requisitos funcionais

A coluna **Sprint** é uma recomendação; quem decide é a equipe desenvolvedora no Planning.

### 7.1 Módulo A — Site público

| ID | Requisito | Prioridade | Sprint | Regras |
|---|---|---|---|---|
| RF-01 | Página inicial com apresentação resumida do Daniel, destaque para palestras e chamada para solicitar. | Must | 1 | — |
| RF-02 | Página "Sobre": trajetória, áreas de atuação e públicos atendidos. | Should | 2 | — |
| RF-03 | Catálogo de temas ativos, na ordem definida pelo Daniel. | Must | 1 | RN-18 |
| RF-04 | Página de detalhe do tema (resumo, duração, público indicado, formatos) com botão "Solicitar esta palestra", que abre o formulário com o tema já escolhido. | Must | 1 | RN-18 |
| RF-05 | Área de conteúdos (lista e artigo) publicada a partir de arquivos Markdown versionados no repositório. | Must | 1 | RN-19, P-04 |
| RF-06 | Página de contato com formulário simples (nome, e-mail, assunto, mensagem), links das redes sociais e botão `wa.me`. | Should | 2 | RN-15, RN-16 |
| RF-07 | Seção de depoimentos autorizados e fotos de palestras. | Could | — | — |
| RF-08 | Metadados de SEO (título, descrição, Open Graph), `sitemap.xml` e `robots.txt`. | Should | 2 | — |

### 7.2 Módulo B — Solicitação de palestra (público)

| ID | Requisito | Prioridade | Sprint | Regras |
|---|---|---|---|---|
| RF-09 | Formulário de solicitação com os campos da RN-01, validação no navegador e no servidor, preservando o que foi digitado em caso de erro. | Must | 1 | RN-01, RN-02 |
| RF-10 | Registrar a solicitação com status NOVA e protocolo, e exibir a tela de confirmação (T06) informando que a data depende de confirmação. | Must | 1 | RN-01, RN-15 |
| RF-11 | Consentimento obrigatório e proteção contra spam e duplicidade. | Must | 1 | RN-16, P-08 |
| RF-12 | Enviar e-mail de aviso ao Daniel a cada nova solicitação, com resumo e link para o painel. Falha no e-mail não impede o registro. | Should | 2 | P-05 |
| RF-13 | Enviar e-mail de confirmação ao contratante com o protocolo e o resumo (sem valores). | Could | — | RN-14 |

### 7.3 Módulo C — Painel: solicitações

| ID | Requisito | Prioridade | Sprint | Regras |
|---|---|---|---|---|
| RF-14 | Entrar com e-mail e senha e sair. Limitar tentativas. Expirar sessão inativa. | Must | 1 | RNF-07 |
| RF-15 | Listar solicitações com filtro por status (padrão: abertas), contadores por status e ordenação por data de criação ou data desejada. | Must | 1 | — |
| RF-16 | Exibir o detalhe da solicitação com todos os dados, a proposta vigente e as ações permitidas no status atual. | Must | 1 | RN-03 |
| RF-17 | Executar as transições da máquina de estados (assumir análise, recusar, cancelar, retirar proposta, marcar realizada), com motivo quando exigido. | Must | 1 | RN-03, RN-09, RN-10, RN-13 |
| RF-18 | Registrar proposta (data do evento, horário, valor interno, observação), criando a pré-reserva. Renovar a pré-reserva de uma proposta vigente. | Must | 2 | RN-05, RN-11, RN-14 |
| RF-19 | Exibir o histórico de eventos da solicitação. | Must | 1 | RN-12 |
| RF-20 | Notas internas livres na solicitação (não alteram status). | Could | — | RN-12 |
| RF-21 | Buscar solicitações por organização, contato ou protocolo. | Should | 2 | — |

### 7.4 Módulo D — Painel: agenda

| ID | Requisito | Prioridade | Sprint | Regras |
|---|---|---|---|---|
| RF-22 | Agenda mensal com dias confirmados, pré-reservados (com prazo) e bloqueados, com link para a solicitação de cada dia. | Must | 2 | RN-04 |
| RF-23 | Bloquear e desbloquear dias inteiros, recusando bloqueio sobre dias ocupados e listando os conflitos. | Must | 2 | RN-08 |
| RF-24 | Verificar a disponibilidade da data no servidor, com trava e restrição no banco, ao registrar proposta e ao confirmar. | Must | 2 | RN-04 a RN-06, D-04 |
| RF-25 | Rotina que expira pré-reservas vencidas (a cada 15 min). | Should | 2 | RN-07 |
| RF-26 | Destacar no painel as solicitações CONFIRMADAS cuja data já passou, para marcar como realizadas. | Should | 2 | RN-10 |

### 7.5 Módulo E — Painel: gestão

| ID | Requisito | Prioridade | Sprint | Regras |
|---|---|---|---|---|
| RF-27 | Manter temas de palestra: criar, editar, ativar/desativar, ordenar. | Must | 1 | RN-18 |
| RF-28 | Configurar os parâmetros da Seção 5.1. | Should | 2 | — |
| RF-29 | Gerenciar conteúdos pelo painel (editor Markdown com pré-visualização, rascunho e publicado). | Should | 2 | RN-19, P-04 |
| RF-30 | Anonimizar os dados de um contratante a pedido, e rotina mensal de retenção. | Should | 2 | RN-17 |
| RF-31 | Exportar solicitações filtradas em CSV. | Could | — | — |
| RF-32 | Caixa de mensagens de contato, com marcação de lida. | Should | 2 | RN-15 |

**Totais:** 17 Must, 11 Should, 4 Could, em 32 requisitos (Must ≈ 53% em quantidade; ≈ 60% do esforço estimado, porque RF-17, RF-18 e RF-24 concentram a lógica). O núcleo do MVP é o **módulo de solicitações com agenda**: é ele que dá ao projeto a complexidade exigida pela disciplina.

> **Para os alunos.** O Grupo 4 tinha colocado "Conhecer o Daniel" e "Conteúdos" como Should para priorizar o fluxo de contratação, o que foi uma decisão madura. Aqui os conteúdos voltam a Must na forma **mais barata possível** (arquivos Markdown), e o editor no painel fica como Should. Repriorizar não é só subir e descer itens: às vezes é **fatiar** o item.

## 8. Histórias de usuário e critérios de aceite

As histórias US-01 a US-08 vêm do Grupo 4 (critérios revisados); US-09 a US-12 foram acrescentadas pela engenharia. Os pontos são estimativas sugeridas.

### 8.1 US-01 — Conhecer o Daniel
*Como visitante, quero conhecer a trajetória e a experiência do Daniel para compreender sua autoridade em educação financeira.*
Prioridade: **Should** (página Sobre) / **Must** (página inicial) · Pontos: 2 · Requisitos: RF-01, RF-02, RF-08 · Caso de uso: UC01

- **Dado** que acesso a página inicial, **quando** ela carrega, **então** vejo quem é o Daniel, um resumo da atuação e o caminho para as palestras.
- **Dado** que abro "Sobre", **quando** a página carrega, **então** vejo trajetória, áreas de atuação e públicos atendidos.
- **Dado** que compartilho o link do site, **quando** a prévia aparece, **então** ela mostra título, descrição e imagem definidos.

### 8.2 US-02 — Aprender sobre finanças
*Como pessoa interessada em educação financeira, quero acessar conteúdos claros para aprender e organizar minha vida financeira.*
Prioridade: **Must** · Pontos: 3 · Requisito: RF-05 · Caso de uso: UC02

- **Dado** que há conteúdos publicados, **quando** abro "Conteúdos", **então** vejo a lista do mais recente para o mais antigo, com título, resumo e data.
- **Dado** um conteúdo, **quando** o abro, **então** leio o texto formatado (títulos, listas, links) em tela de 360 px sem rolagem lateral.
- **Dado** um conteúdo em rascunho, **quando** tento abri-lo pelo endereço, **então** recebo "página não encontrada".

### 8.3 US-03 — Avaliar palestras
*Como profissional de RH, quero ver os temas e as informações das palestras para avaliar uma possível contratação.*
Prioridade: **Must** · Pontos: 3 · Requisitos: RF-03, RF-04, RF-27 · Caso de uso: UC01

- **Dado** temas ativos, **quando** abro "Palestras", **então** vejo cada tema com título, resumo curto, duração e formatos.
- **Dado** um tema, **quando** abro o detalhe, **então** encontro público indicado e o botão "Solicitar esta palestra".
- **Dado** que toco em "Solicitar esta palestra", **quando** o formulário abre, **então** o tema já vem selecionado.
- **Dado** um tema desativado, **quando** consulto o catálogo, **então** ele não aparece.

### 8.4 US-04 — Solicitar uma palestra
*Como organizador de eventos, quero informar os dados do evento para iniciar a contratação com o Daniel.*
Prioridade: **Must** · Pontos: 5 · Requisitos: RF-09, RF-10, RF-11 · Caso de uso: UC03

- **Dado** o formulário, **quando** preencho os campos obrigatórios e marco o consentimento, **então** a solicitação é registrada como NOVA e vejo o protocolo.
- **Dado** que falta um campo obrigatório ou a data está fora da janela (antes de hoje + 7 dias), **quando** envio, **então** o campo é indicado e nada é gravado; o que digitei continua preenchido.
- **Dado** que enviei, **quando** vejo a confirmação, **então** ela diz que a data só fica garantida depois da confirmação do Daniel e **não** mostra se a data está livre.
- **Dado** que reenvio o mesmo pedido (mesmo e-mail e data) em menos de 24 h, **quando** envio, **então** recebo o mesmo protocolo, sem duplicar.
- **Dado** um robô que preenche o campo-armadilha, **quando** envia, **então** nada é gravado.

### 8.5 US-05 — Entrar em contato
*Como potencial contratante, quero uma forma fácil de contato para tirar dúvidas.*
Prioridade: **Should** · Pontos: 2 · Requisitos: RF-06, RF-32 · Caso de uso: UC04

- **Dado** a página de contato, **quando** envio nome, e-mail e mensagem válidos, **então** vejo a confirmação e a mensagem aparece na caixa do painel.
- **Dado** a página de contato, **quando** toco no botão de WhatsApp, **então** abre uma conversa com o número do Daniel.

### 8.6 US-06 — Gerenciar o status das solicitações
*Como Daniel, quero ver e atualizar o status de cada solicitação para saber em que etapa está cada contratação.*
Prioridade: **Must** · Pontos: 5 · Requisitos: RF-14 a RF-17, RF-21 · Casos de uso: UC05, UC06, UC09, UC10

- **Dado** que entro no painel, **quando** abro "Solicitações", **então** vejo as abertas com contadores por status e as novas no topo.
- **Dado** uma solicitação NOVA, **quando** toco em "Assumir análise", **então** ela passa a EM_ANALISE.
- **Dado** uma solicitação aberta, **quando** recuso sem informar motivo, **então** o sistema pede o motivo; com motivo, ela passa a RECUSADA.
- **Dado** uma solicitação CONFIRMADA com data futura, **quando** tento marcá-la como realizada, **então** a ação não está disponível.
- **Dado** duas abas abertas na mesma solicitação, **quando** a segunda tenta alterar depois da primeira, **então** recebe "a solicitação foi alterada" e a tela recarrega.

### 8.7 US-07 — Enviar proposta e segurar a data
*Como Daniel, quero registrar a proposta que enviei ao contratante e segurar a data por alguns dias, para não oferecer a mesma data a outra pessoa.*
Prioridade: **Must** · Pontos: 5 · Requisitos: RF-18, RF-24, RF-25 · Caso de uso: UC07, UC13

- **Dado** uma solicitação EM_ANALISE e uma data livre, **quando** registro a proposta, **então** ela passa a PROPOSTA_ENVIADA e a data aparece como pré-reservada até hoje + 7 dias.
- **Dado** uma data já confirmada, pré-reservada por outra solicitação ou bloqueada, **quando** tento registrar a proposta, **então** o sistema recusa e informa o motivo e quem ocupa.
- **Dado** uma pré-reserva vencida sem confirmação, **quando** a rotina roda, **então** a solicitação volta para EM_ANALISE, a data é liberada e o histórico registra "pré-reserva expirada".
- **Dado** uma proposta vigente, **quando** renovo, **então** o prazo da pré-reserva é estendido.

### 8.8 US-08 — Gerenciar agenda e disponibilidade
*Como Daniel, quero controlar as datas confirmadas e indisponíveis para evitar conflitos entre palestras.*
Prioridade: **Must** · Pontos: 5 · Requisitos: RF-22, RF-23, RF-24 · Casos de uso: UC08, UC11, UC12

- **Dado** a pré-reserva vigente de uma solicitação, **quando** confirmo a palestra, **então** ela passa a CONFIRMADA e o dia aparece como confirmado na agenda.
- **Dado** que outra solicitação ocupou o dia depois que minha pré-reserva venceu, **quando** tento confirmar, **então** o sistema recusa com CONFLITO_DE_DATA e oferece voltar para análise.
- **Dado** duas confirmações para o mesmo dia disparadas ao mesmo tempo, **quando** o servidor processa, **então** exatamente uma é aceita.
- **Dado** um dia livre, **quando** o bloqueio com motivo, **então** ele não aceita propostas nem confirmações.
- **Dado** um dia com palestra confirmada, **quando** tento bloqueá-lo, **então** o sistema recusa e mostra a solicitação.
- **Dado** uma palestra CONFIRMADA que é cancelada com motivo, **quando** o cancelamento é registrado, **então** o dia volta a ficar livre.

### 8.9 US-09 — Consultar o histórico
*Como Daniel, quero ver o histórico de cada solicitação para acompanhar decisões e mudanças da negociação.*
Prioridade: **Must** · Pontos: 2 · Requisito: RF-19 · Caso de uso: UC06

- **Dado** uma solicitação com alterações, **quando** abro o histórico, **então** vejo cada evento com data, hora, status anterior e novo, motivo e autor (Daniel, sistema ou solicitante).
- **Dado** uma solicitação finalizada, **quando** a consulto meses depois, **então** o histórico continua disponível.

### 8.10 US-10 — Ser avisado de novos pedidos
*Como Daniel, quero receber um e-mail a cada nova solicitação, para responder rápido sem precisar abrir o painel o tempo todo.*
Prioridade: **Should** · Pontos: 2 · Requisitos: RF-12, RF-13 · Caso de uso: UC03

- **Dado** uma nova solicitação, **quando** ela é registrada, **então** recebo um e-mail com organização, data desejada, tema e link para o painel.
- **Dado** que o serviço de e-mail está fora do ar, **quando** chega uma solicitação, **então** ela é registrada normalmente e o painel mostra que o aviso falhou.

### 8.11 US-11 — Publicar conteúdo pelo painel
*Como Daniel, quero escrever e publicar artigos pelo painel, para manter o site atualizado sem depender da equipe técnica.*
Prioridade: **Should** · Pontos: 5 · Requisito: RF-29 · Caso de uso: UC15

- **Dado** o editor, **quando** salvo um artigo como rascunho, **então** ele não aparece no site.
- **Dado** um rascunho, **quando** publico, **então** ele aparece na lista de conteúdos com a data de publicação.
- **Dado** um artigo publicado, **quando** despublico, **então** ele sai do site imediatamente.

### 8.12 US-12 — Configurar o sistema e proteger dados
*Como Daniel, quero ajustar os parâmetros da agenda e atender pedidos de exclusão de dados, para adaptar o sistema e cumprir a LGPD.*
Prioridade: **Should** · Pontos: 3 · Requisitos: RF-28, RF-30 · Caso de uso: UC16

- **Dado** que mudo `palestrasPorDia` para 2, **quando** registro uma proposta num dia com uma confirmação, **então** ela é aceita.
- **Dado** que reduzo `palestrasPorDia` e um dia já tem mais ocupações que o novo limite, **quando** salvo, **então** o sistema recusa e lista os dias afetados.
- **Dado** o e-mail de um contratante, **quando** confirmo a anonimização, **então** nome, e-mail, celular e mensagem de todas as solicitações dele são substituídos, e datas e status são mantidos.

## 9. Casos de uso

### 9.1 Diagramas

![Figura 5 — Casos de uso do site público](diagramas/02_casos_uso_publico.png)

![Figura 6 — Casos de uso do painel do Daniel](diagramas/03_casos_uso_painel.png)

### 9.2 Catálogo

| UC | Nome | Ator | Requisitos | Detalhado em |
|---|---|---|---|---|
| UC01 | Conhecer o Daniel e as palestras | Visitante | RF-01 a RF-04 | resumo |
| UC02 | Ler conteúdos | Visitante | RF-05 | resumo |
| UC03 | Solicitar palestra | Contratante | RF-09 a RF-13 | 9.3 |
| UC04 | Enviar mensagem de contato | Visitante | RF-06, RF-32 | resumo |
| UC05 | Entrar no painel | Daniel | RF-14 | resumo |
| UC06 | Analisar solicitação | Daniel | RF-15 a RF-17, RF-19 | 9.4 |
| UC07 | Registrar proposta e pré-reservar data | Daniel | RF-18, RF-24 | 9.5 |
| UC08 | Confirmar palestra | Daniel | RF-17, RF-24 | 9.6 |
| UC09 | Recusar ou cancelar | Daniel | RF-17 | 9.7 |
| UC10 | Marcar como realizada | Daniel | RF-17, RF-26 | resumo |
| UC11 | Gerenciar bloqueios | Daniel | RF-23 | 9.8 |
| UC12 | Consultar agenda | Daniel | RF-22 | resumo |
| UC13 | Expirar pré-reservas | Relógio | RF-25 | 9.9 |
| UC14 | Manter temas | Daniel | RF-27 | resumo |
| UC15 | Gerenciar conteúdos | Daniel | RF-29 | resumo |
| UC16 | Configurar parâmetros | Daniel | RF-28, RF-30 | resumo |

### 9.3 UC03 — Solicitar palestra

**Ator:** Contratante. **Pré-condição:** nenhuma (público). **Pós-condição de sucesso:** solicitação NOVA com protocolo e evento CRIADA; aviso ao Daniel enfileirado. **Garantia mínima:** nada é gravado se a validação falhar.

**Fluxo principal**

1. O contratante abre o formulário (T05), direto ou a partir de um tema (tema pré-selecionado).
2. Preenche os dados e marca o consentimento.
3. O navegador valida formato e obrigatoriedade e envia.
4. O servidor revalida RN-01, RN-02 e RN-16 (armadilha, limite por IP, duplicidade).
5. O servidor grava a solicitação NOVA, gera o protocolo, copia o título do tema e grava o evento CRIADA, tudo numa transação.
6. Depois da gravação, o servidor enfileira o e-mail de aviso ao Daniel (RF-12).
7. O sistema exibe T06 com o protocolo.

**Alternativos.** **A1** — dados inválidos: indica os campos e mantém o preenchimento. **A2** — duplicidade em 24 h: exibe o protocolo existente. **A3** — limite por IP: mensagem "muitas tentativas, tente mais tarde".
**Exceções.** **E1** — falha ao gravar: "Não foi possível enviar. Sua solicitação **não** foi registrada." **E2** — falha no e-mail: a solicitação continua registrada; o painel sinaliza "aviso não enviado".

### 9.4 UC06 — Analisar solicitação

**Ator:** Daniel. **Pré-condição:** sessão válida.

1. O Daniel abre a lista (T10) e escolhe uma solicitação.
2. O sistema mostra os dados, a proposta vigente, o histórico e só as ações válidas para o status.
3. Se a solicitação está NOVA, o Daniel toca em "Assumir análise" e o servidor (com a versão) muda para EM_ANALISE e grava o evento.
4. A partir daí, o Daniel segue UC07 (proposta), UC09 (recusa) ou deixa em análise.

**Exceções.** **E1** — versão desatualizada: recarrega e informa. **E2** — sessão expirada: pede login e retorna à mesma solicitação.

### 9.5 UC07 — Registrar proposta e pré-reservar data

**Ator:** Daniel. **Pré-condição:** solicitação EM_ANALISE (ou PROPOSTA_ENVIADA, para renovar). **Pós-condição:** PROPOSTA_ENVIADA com pré-reserva vigente.

1. No detalhe (T11), o Daniel informa data do evento, horário, valor interno (opcional) e observação.
2. O sistema mostra se a data parece livre (consulta informativa).
3. O Daniel confirma o registro.
4. O servidor executa a verificação da Seção 10.1 (trava do dia, bloqueio, limite diário, excluindo a própria solicitação).
5. Disponível: grava a proposta, a ReservaData do tipo PRE_RESERVA com `expiraEm = agora + diasPreReserva`, muda o status e grava o evento PROPOSTA_REGISTRADA.
6. O Daniel envia a proposta ao contratante **fora do sistema** (e-mail ou WhatsApp).

**Alternativos.** **A1** — renovar: em PROPOSTA_ENVIADA, "Renovar pré-reserva" estende o prazo se a data continuar disponível. **A2** — trocar a data: registrar nova proposta move a pré-reserva para a nova data, numa única transação.
**Exceções.** **E1** — data indisponível: recusa com o motivo (bloqueio, confirmada, pré-reservada) e quem ocupa. **E2** — data fora da janela: recusa.

### 9.6 UC08 — Confirmar palestra

**Ator:** Daniel. **Pré-condição:** PROPOSTA_ENVIADA e aceite do contratante (obtido fora do sistema). **Pós-condição:** CONFIRMADA; a data fica ocupada em definitivo.

1. O Daniel toca em "Confirmar palestra".
2. O servidor trava a solicitação e o dia, verifica a RN-06 e converte a ReservaData para CONFIRMADA (ou cria, se a pré-reserva tinha vencido e o dia está livre).
3. Grava status, versão e evento numa transação (Seção 10.2).
4. A agenda mostra o dia como confirmado.

**Exceções.** **E1** — o dia foi ocupado por outra solicitação depois do vencimento: recusa com CONFLITO_DE_DATA e oferece "Voltar para análise". **E2** — duas confirmações simultâneas no mesmo dia: só uma vence (restrição única).

### 9.7 UC09 — Recusar ou cancelar

**Ator:** Daniel. Recusar é possível em NOVA, EM_ANALISE e PROPOSTA_ENVIADA; cancelar, em CONFIRMADA.

1. O Daniel escolhe a ação e informa o motivo (3–300 caracteres).
2. O servidor valida a transição, remove a ReservaData (se houver) e grava status e evento.
3. A data volta a ficar livre.

### 9.8 UC11 — Gerenciar bloqueios

**Ator:** Daniel.

1. Na agenda (T12), o Daniel escolhe um dia e toca em "Bloquear dia", informando o motivo.
2. O servidor trava o dia e verifica se há reservas (confirmadas ou pré-reservas vigentes).
3. Sem ocupação: grava o BloqueioData. Com ocupação: recusa e lista as solicitações.
4. Para desbloquear, o Daniel abre o dia e remove o bloqueio.

### 9.9 UC13 — Expirar pré-reservas

**Ator:** Relógio do sistema (a cada 15 min).

1. Busca ReservaData PRE_RESERVA com `expiraEm ≤ agora`.
2. Para cada uma, numa transação que confere de novo o status da solicitação: remove a reserva, muda a solicitação para EM_ANALISE e grava o evento PRE_RESERVA_EXPIRADA com autor SISTEMA.
3. A operação é idempotente: rodar duas vezes não gera dois eventos.

### 9.10 Casos de uso resumidos

| UC | Resumo |
|---|---|
| UC01 | Página inicial, Sobre, catálogo e detalhe do tema. Temas inativos não aparecem. Botão "Solicitar esta palestra" leva ao UC03. |
| UC02 | Lista de conteúdos publicados (mais recente primeiro) e leitura do artigo. Rascunhos respondem 404. |
| UC04 | Formulário de contato (nome, e-mail, assunto, mensagem) com as mesmas proteções do UC03. A mensagem vai para a caixa do painel. |
| UC05 | Login por e-mail e senha. 5 falhas em 15 min bloqueiam por 15 min. Mensagem genérica. Sessão expira após 2 h sem uso. Logout invalida a sessão. |
| UC10 | Em CONFIRMADA com `dataEvento ≤ hoje`, "Marcar como realizada" muda o status e grava o evento. O painel destaca as pendentes (RF-26). |
| UC12 | Agenda mensal com legenda (confirmada, pré-reserva com prazo, bloqueio). Toque no dia leva à solicitação ou ao bloqueio. |
| UC14 | Criar, editar, ativar/desativar e reordenar temas. Título obrigatório (até 100), duração 15–480 min, ao menos um formato. |
| UC15 | Editor Markdown com pré-visualização. Situações rascunho e publicado. Slug único gerado do título. |
| UC16 | Edita os parâmetros (Seção 5.1). Redução de `palestrasPorDia` que deixe dias acima do novo limite é recusada com a lista. Inclui a anonimização por e-mail. |

## 10. Fluxos críticos

### 10.1 Verificação de disponibilidade da data

![Figura 7 — Diagrama de atividade: verificação de disponibilidade ao propor ou confirmar](diagramas/06_atividade_disponibilidade.png)

Pseudocódigo de referência:

```
funcao reservarData(solicitacao s, data d, operacao):     # PROPOR ou CONFIRMAR
    se d < hoje + antecedenciaMinima ou d > hoje + horizonte:
        erro DATA_FORA_DA_JANELA
    transacao:
        dia <- AgendaDia.obterOuCriar(d) PARA ATUALIZACAO   # trava o dia
        se existe BloqueioData(d): erro DATA_BLOQUEADA
        ocupadas <- ReservaData onde data = d
                      e (tipo = CONFIRMADA ou expiraEm > agora)
                      e solicitacao != s
        se contar(ocupadas) >= palestrasPorDia:
            erro CONFLITO_DE_DATA(ocupadas)
        minha <- ReservaData de s (se existir; pode estar em outra data)
        se operacao = PROPOR:
            mover/criar minha para (d, PRE_RESERVA, expiraEm = agora + diasPreReserva)
            s.status <- PROPOSTA_ENVIADA
        senao:
            mover/criar minha para (d, CONFIRMADA, expiraEm = nulo)
            s.status <- CONFIRMADA
        minha.slot <- menor vaga livre em 1..palestrasPorDia  # UNIQUE(data, slot)
        registrar EventoSolicitacao
```

**Pontos de atenção**

- **A pré-reserva vencida não "some" sozinha.** Até a rotina rodar, a linha continua na tabela. A consulta de ocupação filtra `expiraEm > agora`, e a gravação reaproveita ou remove a linha vencida da mesma data antes de ocupar a vaga.
- **Trocar a data de uma proposta** move a reserva: libera a data antiga e ocupa a nova na mesma transação. Trave os dois dias **sempre em ordem crescente de data** para evitar *deadlock*.
- **Datas sem hora.** A data do evento é uma data civil (sem fuso). "Hoje" é calculado no fuso America/Sao_Paulo, no servidor.

### 10.2 Confirmação sem conflito

![Figura 8 — Diagrama de sequência: confirmação de palestra](diagramas/07_sequencia_confirmacao.png)

Duas camadas de proteção, e a equipe deve implementar as duas:

1. **Trava por dia.** Uma tabela `agenda_dia(data PK)`. Toda operação que ocupa ou libera um dia (proposta, confirmação, bloqueio, cancelamento) começa com `SELECT ... FOR UPDATE` na linha do dia, criada se não existir. Operações sobre o mesmo dia ficam em fila.
2. **Restrição no banco.** `reserva_data` tem `UNIQUE (data, slot)`, com `slot` entre 1 e `palestrasPorDia`. Mesmo que a aplicação erre, duas reservas na mesma vaga nunca coexistem.

```
CREATE TABLE reserva_data (
  solicitacao_id UUID PRIMARY KEY REFERENCES solicitacao(id),
  data      DATE NOT NULL,
  slot      SMALLINT NOT NULL CHECK (slot >= 1),
  tipo      TEXT NOT NULL CHECK (tipo IN ('PRE_RESERVA','CONFIRMADA')),
  expira_em TIMESTAMPTZ,
  UNIQUE (data, slot)
);
```

**Teste obrigatório (CT-08):** disparar 10 confirmações simultâneas de solicitações diferentes para o mesmo dia livre. Exatamente 1 vence; as outras recebem 409 `CONFLITO_DE_DATA`.

### 10.3 Máquina de estados no código

Implemente as transições numa **tabela única** (estado atual × ação → novo estado + condições). Não espalhe `if` pelos controladores. Exemplo de estrutura:

```
TRANSICOES = {
  ("NOVA",             "assumir")    : "EM_ANALISE",
  ("EM_ANALISE",       "propor")     : "PROPOSTA_ENVIADA",   # + reservarData(PROPOR)
  ("PROPOSTA_ENVIADA", "renovar")    : "PROPOSTA_ENVIADA",   # + reservarData(PROPOR)
  ("PROPOSTA_ENVIADA", "retirar")    : "EM_ANALISE",         # libera data
  ("PROPOSTA_ENVIADA", "expirar")    : "EM_ANALISE",         # só SISTEMA
  ("PROPOSTA_ENVIADA", "confirmar")  : "CONFIRMADA",         # + reservarData(CONFIRMAR)
  ("CONFIRMADA",       "realizar")   : "REALIZADA",          # dataEvento <= hoje
  ("NOVA",             "recusar")    : "RECUSADA",           # motivo
  ("EM_ANALISE",       "recusar")    : "RECUSADA",
  ("PROPOSTA_ENVIADA", "recusar")    : "RECUSADA",           # libera data
  ("CONFIRMADA",       "cancelar")   : "CANCELADA",          # motivo, libera data
}
```

A mesma tabela alimenta a tela (quais botões mostrar) e o servidor (o que aceitar), o que evita divergências.

## 11. Interface com o usuário

### 11.1 Mapa de navegação

![Figura 9 — Mapa de navegação entre telas](diagramas/08_navegacao.png)

### 11.2 Wireframes

Os wireframes são de **baixa fidelidade**: mostram conteúdo e hierarquia, não o visual final. Os temas, organizações e nomes são ilustrativos. A identidade visual deve seguir o material do Daniel (Q-07).

![Figura 10 — Telas públicas: detalhe do tema, formulário de solicitação e confirmação](diagramas/10_wire_publico.png)

![Figura 11 — Telas do painel: lista de solicitações, detalhe com proposta e agenda mensal](diagramas/11_wire_painel.png)

### 11.3 Diretrizes de interface

- **Mobile first** no site público: contratantes e leitores chegam pelo celular, muitas vezes por link de rede social.
- **Painel pensado para desktop e celular:** o Daniel consulta a agenda em viagem.
- **Formulário em uma página**, campos agrupados (Organização e contato · Evento · Mensagem), com obrigatórios marcados.
- **Status sempre com texto e cor**, nunca só cor.
- **Ações destrutivas** (recusar, cancelar, desbloquear) pedem confirmação e motivo.
- **Linguagem sóbria e sem promessas financeiras.** O site é informativo; não faz recomendação de investimento.

### 11.4 Mensagens padrão

| Situação | Mensagem |
|---|---|
| Solicitação enviada | "Recebemos sua solicitação! Protocolo PAL-4Q7K. O Daniel vai analisar e responder pelo e-mail informado. A data só fica garantida depois da confirmação." |
| Data fora da janela | "Escolha uma data a partir de 23/10/2026." |
| Pedido duplicado | "Já recebemos este pedido. Protocolo: PAL-4Q7K." |
| Muitas tentativas | "Muitas tentativas em pouco tempo. Tente novamente mais tarde." |
| Conflito (painel) | "Esta data já está ocupada por PAL-2C9T (pré-reserva até 23/10). Escolha outra data." |
| Data bloqueada (painel) | "Este dia está bloqueado: viagem." |
| Bloqueio com conflito | "Não é possível bloquear: há uma palestra confirmada neste dia (PAL-7H1R)." |
| Versão desatualizada | "A solicitação foi alterada em outra tela. Atualizamos os dados; confira antes de continuar." |
| Aviso de privacidade (formulário) | "Usamos seus dados apenas para responder a esta solicitação. Eles não são compartilhados e são anonimizados 24 meses após o encerramento do pedido." |

## 12. Requisitos não funcionais

| ID | Categoria | Requisito e meta | Verificação | Prioridade |
|---|---|---|---|---|
| RNF-01 | Integridade | Nenhum dia com reservas acima de `palestrasPorDia`, inclusive com operações simultâneas. Em 10 confirmações simultâneas para o mesmo dia, exatamente 1 vence (repetir 10 vezes). | Teste automatizado contra banco real (CT-08) | Must |
| RNF-02 | Integridade | Toda transição de status gera evento no histórico, na mesma transação. | Teste: nenhuma rota altera status sem evento | Must |
| RNF-03 | Responsividade | Site e painel sem perda de conteúdo em 360, 768 e 1366 px; alvos de toque ≥ 44 px. | Checklist nas três larguras | Must |
| RNF-04 | Desempenho | Páginas públicas com LCP ≤ 2,5 s em 4G simulado; lista de solicitações ≤ 1 s com 1.000 registros. | Lighthouse e medição com massa de teste | Should |
| RNF-05 | Segurança | Todas as rotas do painel exigem sessão; sem sessão → redireciona ao login (página) ou 401 (API). | Teste por rota | Must |
| RNF-06 | Segurança | Senha com hash próprio (bcrypt/Argon2), HTTPS obrigatório, cookie `HttpOnly`/`Secure`/`SameSite`, proteção CSRF nas rotas do painel, segredos fora do repositório. | Revisão de código e configuração | Must |
| RNF-07 | Segurança | Login: 5 falhas em 15 min → espera de 15 min; sessão expira após 2 h sem uso. | CT-21 | Must |
| RNF-08 | Anti-abuso | Formulários públicos: campo-armadilha, 5 envios/h por IP, duplicidade em 24 h (RN-16). | CT-04, CT-05 | Must |
| RNF-09 | Privacidade (LGPD) | Consentimento registrado com data e hora; dados de contato nunca em páginas públicas nem em logs; anonimização após 24 meses (RN-17). | Inspeção de respostas e logs; teste da rotina | Must |
| RNF-10 | Confiabilidade | Falha no e-mail de aviso não impede o registro; o aviso tem até 3 tentativas e a falha fica visível no painel. | Teste com serviço de e-mail desligado | Should |
| RNF-11 | Acessibilidade | Contraste AA (WCAG 2.1), rótulos em todos os campos, formulário navegável por teclado; Lighthouse acessibilidade ≥ 90. | Lighthouse + inspeção | Should |
| RNF-12 | Custo e propriedade | Custo mensal ≤ R$ 50 (meta R$ 0); contas em nome do Daniel, com credenciais entregues. | Planilha de custos e termo de entrega | Must |
| RNF-13 | Manutenibilidade | README com setup local ≤ 30 min; migrações versionadas; máquina de estados numa tabela única; CI rodando os testes a cada *push*. | Um colega de outra equipe segue o README | Should |
| RNF-14 | Testabilidade | Cobertura ≥ 80% de linhas no módulo de solicitações e agenda; relógio injetável nos testes. | Relatório de cobertura na Review | Should |
| RNF-15 | Recuperação | Backup diário do banco com retenção de 7 dias; restauração testada antes da entrega. | Registro do teste | Should |
| RNF-16 | SEO | Páginas públicas renderizadas no servidor ou pré-geradas (indexáveis); `sitemap.xml` atualizado ao publicar. | Inspeção do HTML e Search Console | Should |
| RNF-17 | Idioma | Interface em pt-BR; datas `dd/mm/aaaa`; celular `(34) 99999-0000`. | Inspeção | Must |

## 13. Recomendações técnicas (não vinculantes)

A escolha de tecnologia é da equipe desenvolvedora (RS-05). Esta seção registra o que um engenheiro experiente consideraria.

### 13.1 Arquitetura de referência

- **Monólito modular** com dois "lados" no mesmo *deploy*: o site público (páginas indexáveis) e o painel (área autenticada).
- Camadas: **web/API** → **aplicação** (casos de uso: `registrarProposta`, `confirmar`, `expirarPreReservas`) → **domínio** (máquina de estados e regras de agenda, sem framework) → **persistência**.
- **Banco relacional** (PostgreSQL recomendado): transações, `SELECT ... FOR UPDATE` e restrições únicas são o coração da agenda.
- **Conteúdos no MVP como arquivos Markdown** no repositório, gerados como páginas estáticas no *build*. No Sprint 2, a mesma estrutura passa a vir do banco, pelo editor do painel.
- **E-mail transacional** por um serviço com plano gratuito, por trás de uma interface própria (`EnviadorDeEmail`) para poder trocar de provedor.
- **Rotinas agendadas:** expirar pré-reservas (15 min), retenção (mensal) e backup (diário).

![Figura 12 — Diagrama de implantação sugerido](diagramas/09_implantacao.png)

**Combinações que atendem bem** (escolha a que a equipe domina):

| Front-end / site | Back-end | Banco | Observação |
|---|---|---|---|
| Next.js (SSG para o site, páginas do painel) | Next.js API routes ou NestJS | PostgreSQL | Uma linguagem só; SSG resolve SEO e conteúdo Markdown |
| Templates do servidor | Django | PostgreSQL | Django Admin acelera temas, conteúdos e configuração |
| Astro (site) + SPA (painel) | Node/Express ou FastAPI | PostgreSQL | Site muito leve; painel separado |
| Razor Pages | ASP.NET Core | PostgreSQL ou SQL Server | Alinhado à bibliografia da disciplina |

### 13.2 Contrato de API sugerido

| Método e rota | Uso | Respostas principais |
|---|---|---|
| `GET /api/publico/temas` · `GET /api/publico/temas/{slug}` | RF-03, RF-04 | 200, 404 |
| `POST /api/publico/solicitacoes` | RF-09 a RF-11 | 201 `{protocolo}`, 200 (duplicada, mesmo protocolo), 422 `VALIDACAO`, 429 `MUITAS_TENTATIVAS` |
| `POST /api/publico/contato` | RF-06 | 201, 422, 429 |
| `POST /api/auth/login` · `POST /api/auth/logout` | RF-14 | 200, 401, 429 |
| `GET /api/solicitacoes?status=&busca=&ordem=` | RF-15, RF-21 | 200 |
| `GET /api/solicitacoes/{id}` · `GET /api/solicitacoes/{id}/historico` | RF-16, RF-19 | 200, 404 |
| `POST /api/solicitacoes/{id}/acoes/{assumir · recusar · retirar · realizar · cancelar}` | RF-17 | 200, 409 `TRANSICAO_INVALIDA` / `VERSAO_DESATUALIZADA`, 422 (motivo) |
| `POST /api/solicitacoes/{id}/proposta` · `POST /api/solicitacoes/{id}/proposta/renovacao` | RF-18 | 200, 409 `CONFLITO_DE_DATA` / `DATA_BLOQUEADA`, 422 `DATA_FORA_DA_JANELA` |
| `POST /api/solicitacoes/{id}/confirmacao` | RF-17, RF-24 | 200, 409 `CONFLITO_DE_DATA` |
| `GET /api/agenda?mes=AAAA-MM` | RF-22 | 200 |
| `POST /api/bloqueios` · `DELETE /api/bloqueios/{data}` | RF-23 | 201, 409 (lista de conflitos), 204 |
| `GET/POST/PUT /api/admin/temas` · `/conteudos` · `/configuracao` | RF-27 a RF-29 | 200, 409 (dias acima do novo limite) |
| `POST /api/admin/anonimizacoes` | RF-30 | 200 |

Formato de erro uniforme: `{ "codigo": "CONFLITO_DE_DATA", "mensagem": "...", "detalhes": { "ocupadoPor": ["PAL-2C9T"] } }`.

### 13.3 Armadilhas conhecidas

| Armadilha | Como evitar |
|---|---|
| Verificar a data "livre" na tela e gravar depois | Verificação e gravação na mesma transação, com trava do dia e restrição única |
| Pré-reserva vencida bloqueando a agenda até a rotina rodar | Filtrar `expira_em > agora` na consulta de ocupação |
| Status alterado sem evento no histórico | Gravar status e evento no mesmo caso de uso e na mesma transação; testar |
| `if status == ...` espalhado pelo código | Tabela única de transições (Seção 10.3) |
| Guardar a data do evento como data-hora em UTC | Use tipo `date`; calcule "hoje" no fuso do Brasil |
| E-mail enviado dentro da transação | Grave primeiro e envie depois (fila ou tarefa); a falha no e-mail não desfaz o pedido |
| Formulário público sem proteção | Campo-armadilha + limite por IP desde o Sprint 1 |
| Valor da proposta vazando no e-mail ao contratante | Teste automatizado que verifica que o modelo de e-mail público não usa o campo |
| Código gerado por IA sem revisão | *Code review* obrigatório; a equipe explica cada trecho (Plano de Ensino, 6.2) |

## 14. Backlog e plano de entrega

### 14.1 Definição de Pronto para começar (Definition of Ready)

Uma história entra no Sprint se tiver critérios de aceite claros, dependências resolvidas, premissas confirmadas (ou aceitas como risco) e estimativa da equipe.

### 14.2 Definição de Pronto (Definition of Done)

- Critérios de aceite atendidos e demonstráveis.
- Testes automatizados das regras envolvidas passando na integração contínua.
- *Code review* por um colega (inclusive do código gerado por IA).
- Funciona em 360 px e em desktop.
- Implantado em homologação, com dados fictícios.
- README e migrações atualizados.

### 14.3 Plano de Sprints

As datas seguem o cronograma ajustado da disciplina (**a confirmar pelo professor**): Sprint 1 Planning em 22/10, Review do Sprint 1 em 05/11, Review do Sprint 2 em 19/11 e entrega final em 03/12/2026.

| Etapa | Período sugerido | Meta do Sprint | Histórias / itens | Pontos |
|---|---|---|---|---|
| Sprint 0 (setup) | até 22/10 | Repositório, CI, *deploy* de homologação, banco com migrações, carga inicial de temas fictícios, conta do Daniel criada por comando | — | — |
| **Sprint 1** | 22/10 → 05/11 | **"O contratante pede uma palestra e o Daniel acompanha o pedido."** | US-02 (Markdown), US-03, US-04, US-06, US-09, US-01 (página inicial) | ≈ 20 |
| **Sprint 2** | 05/11 → 19/11 | **"A agenda não deixa confirmar duas palestras no mesmo dia."** | US-07, US-08, US-05, US-10, US-12, US-01 (Sobre e SEO) | ≈ 19 |
| Buffer / homologação | 19/11 → 26/11 | Teste com o Daniel, conteúdos reais, ajustes; Should restantes (US-11) e Could se houver folga | US-11, RF-07, RF-13, RF-20, RF-31 | — |
| **Entrega final** | 03/12/2026 | Site em produção no domínio do Daniel, painel em uso, credenciais e manual entregues | — | — |

**Demonstração da Review 1:** o contratante abre um tema no celular → solicita → recebe protocolo → o Daniel vê a solicitação NOVA no painel → assume a análise → recusa outra com motivo → o histórico mostra tudo.

**Demonstração da Review 2:** o Daniel registra proposta para 28/11 → o dia aparece pré-reservado → outra solicitação tenta 28/11 e é recusada → o Daniel confirma → bloqueia 07/11 → tenta bloquear 28/11 e é impedido → o teste de concorrência (CT-08) roda ao vivo.

## 15. Plano de testes

### 15.1 Estratégia

| Nível | O que cobre | Ferramenta (exemplo) |
|---|---|---|
| Unitário | Máquina de estados, janela de datas, regras de ocupação | Framework de testes da linguagem |
| Integração | Trava do dia, `UNIQUE(data, slot)`, expiração, transações | Banco real em contêiner |
| API | Autorização, códigos de erro, versão, anti-spam | Coleção automatizada |
| Ponta a ponta | Solicitar (UC03), propor e confirmar (UC07, UC08), bloquear (UC11) | Playwright ou Cypress |
| Aceitação | Casos abaixo, demonstrados ao Daniel | Roteiro manual em homologação |

Use **relógio injetável** e datas relativas ("hoje + 10 dias"), para que os testes não quebrem com o passar do tempo.

### 15.2 Casos de teste de aceitação

| CT | Cenário | Resultado esperado | Rastreia |
|---|---|---|---|
| CT-01 | Enviar solicitação completa com consentimento | 201, status NOVA, protocolo, evento CRIADA | RN-01 |
| CT-02 | Enviar sem e-mail ou sem consentimento | 422; nada gravado | RN-01 |
| CT-03 | Data desejada = hoje + 3 dias (antecedência 7) | 422 `DATA_FORA_DA_JANELA` | RN-02 |
| CT-04 | Reenviar mesmo e-mail e data em 2 h | Mesmo protocolo; uma solicitação só | RN-16 |
| CT-05 | Campo-armadilha preenchido; 6º envio na hora pelo mesmo IP | Nada gravado; 429 | RN-16 |
| CT-06 | Registrar proposta para dia livre | PROPOSTA_ENVIADA; pré-reserva até hoje + 7 | RN-05 |
| CT-07 | Registrar proposta para dia com outra pré-reserva vigente | 409 `CONFLITO_DE_DATA` com o protocolo que ocupa | RN-04, RN-05 |
| CT-08 | 10 confirmações simultâneas de solicitações diferentes no mesmo dia livre | Exatamente 1 CONFIRMADA; 9 com 409; repetir 10× | RNF-01 |
| CT-09 | Pré-reserva vence; rotina roda 2× | Solicitação EM_ANALISE; um único evento PRE_RESERVA_EXPIRADA | RN-07 |
| CT-10 | Após o vencimento, outra solicitação ocupa o dia; tentar confirmar a primeira | 409 `CONFLITO_DE_DATA` | RN-06 |
| CT-11 | Após o vencimento, dia continua livre; confirmar a primeira | CONFIRMADA | RN-06 |
| CT-12 | Trocar a data da proposta de 20/11 para 27/11 | 20/11 liberado e 27/11 pré-reservado na mesma transação | RN-05 |
| CT-13 | Registrar proposta para dia bloqueado | 409 `DATA_BLOQUEADA` | RN-04, RN-08 |
| CT-14 | Bloquear dia com palestra confirmada | 409 com a solicitação em conflito | RN-08 |
| CT-15 | Cancelar CONFIRMADA sem motivo; depois com motivo | 422; depois CANCELADA e dia livre | RN-09 |
| CT-16 | Marcar realizada com data futura; depois com data passada | 409; depois REALIZADA | RN-10 |
| CT-17 | Transição inválida (RECUSADA → CONFIRMADA) | 409 `TRANSICAO_INVALIDA` | RN-03 |
| CT-18 | Duas abas alteram a mesma solicitação | A segunda recebe `VERSAO_DESATUALIZADA` | RN-13 |
| CT-19 | Toda ação do painel sobre uma solicitação | Gera o evento correspondente | RN-12, RNF-02 |
| CT-20 | Acessar `/api/solicitacoes` sem sessão | 401; página redireciona ao login | RNF-05 |
| CT-21 | 6 logins errados em 15 min | Bloqueio temporário; mensagem genérica | RNF-07 |
| CT-22 | Páginas públicas e e-mail ao contratante | Não contêm valor da proposta nem dados de outras solicitações | RN-14, RN-15 |
| CT-23 | Tema desativado | Some do catálogo e do formulário; solicitações antigas mantêm o título | RN-18 |
| CT-24 | Conteúdo em rascunho acessado pela URL | 404 | RN-19 |
| CT-25 | Serviço de e-mail desligado ao receber solicitação | Solicitação registrada; painel mostra "aviso não enviado" | RNF-10 |
| CT-26 | Mudar `palestrasPorDia` para 2 e propor num dia com 1 confirmação | Aceito | RN-04, US-12 |
| CT-27 | Reduzir `palestrasPorDia` para 1 com um dia que tem 2 ocupações | Recusado com a lista de dias | US-12 |
| CT-28 | Anonimizar por e-mail | Contato substituído; datas, tema e status mantidos | RN-17 |
| CT-29 | Uso em 360 px (formulário e painel) | Sem rolagem lateral; alvos ≥ 44 px | RNF-03 |

## 16. Implantação e transição

1. **Contas em nome do Daniel** (P-12): hospedagem, banco, domínio e serviço de e-mail. Configurar HTTPS, backup e monitor.
2. **Carga inicial:** temas reais (Q-11), textos de "Sobre", primeiros conteúdos (Q-06) e parâmetros validados.
3. **Conta do Daniel** criada por comando de implantação, com troca de senha no primeiro acesso.
4. **Treinamento de 30 minutos:** ciclo completo de uma solicitação, agenda e bloqueios, publicação de conteúdo (se o editor estiver pronto).
5. **Divulgação:** link do site na bio das redes sociais e nas propostas que o Daniel já envia.
6. **Entrega:** credenciais, manual do painel (1 página), README técnico, registro do teste de restauração e procedimento de anonimização.

## 17. Riscos

| ID | Risco | Prob. | Impacto | Resposta |
|---|---|---|---|---|
| R-01 | Cliente não confirma as premissas (limite diário, pré-reserva) | Média | Médio | Tudo configurável; o Grupo 4 valida até a Review 1 |
| R-02 | Conteúdo e textos não chegam a tempo | Alta | Médio | Site entra no ar com textos provisórios aprovados; conteúdos em Markdown são fáceis de trocar |
| R-03 | Concorrência mal implementada permite duas confirmações | Média | Alto | Trava do dia + restrição única; CT-08 obrigatório na Review 2 |
| R-04 | Equipe trata o projeto como "site" e deixa o painel para o fim | Média | Alto | O Sprint 1 já entrega o funil de solicitações; o site institucional é mínimo |
| R-05 | Spam no formulário | Alta | Baixo | Proteções da RN-16 desde o Sprint 1 |
| R-06 | E-mails de aviso caem no spam | Média | Médio | Domínio próprio com SPF/DKIM; painel como fonte da verdade |
| R-07 | Daniel não adota o painel e continua só no WhatsApp | Média | Alto | Aviso por e-mail com link direto; ações em poucos toques; treinamento |
| R-08 | Código gerado por IA sem compreensão | Média | Médio | *Code review* obrigatório; explicação nas Reviews |

## 18. Questões em aberto e validação

### 18.1 Perguntas para o cliente

O Grupo 4, como ponte com o cliente, deve levar estas perguntas ao Daniel e registrar as respostas, com data e forma. Até lá, valem as premissas indicadas.

| ID | Pergunta | Premissa até a resposta | Bloqueia? |
|---|---|---|---|
| Q-01 | **Registro da validação:** em que data e de que forma (presencial, chamada, mensagem) o Daniel aprovou o escopo revisado? Guardar print ou mensagem. | — | **Sim, para o registro do projeto de extensão** |
| Q-02 | Por onde chegam os pedidos hoje e quantos por mês? Quais etapas acontecem entre o pedido e a palestra? | Fluxo validado (Seção 6.4) | Não |
| Q-03 | Faz mais de uma palestra no mesmo dia? Uma presencial e uma online no mesmo dia é possível? | 1 por dia, vale para ambos (P-01, P-10) | Não |
| Q-04 | Costuma "segurar" a data enquanto o contratante decide? Por quantos dias? | 7 dias (P-02) | Não |
| Q-05 | Precisa bloquear só meio período em algum caso? | Dia inteiro (P-03) | Não |
| Q-06 | Quem vai escrever os conteúdos, com que frequência? Texto, vídeo do YouTube ou ambos? Já existe material? | Markdown no MVP; editor no Sprint 2 (P-04) | Não |
| Q-07 | Tem logotipo, cores, fotos profissionais e depoimentos autorizados? | Identidade visual provisória e sóbria | Não |
| Q-08 | Já tem domínio? Quanto pode gastar por mês com hospedagem e domínio? Em nome de quem ficam as contas? | ≤ R$ 50, em nome do Daniel (P-12) | Sim, para a implantação |
| Q-09 | Qual e-mail recebe os avisos? Quer confirmação automática para o contratante? | Aviso ao Daniel (Should); confirmação Could | Não |
| Q-10 | Com quanta antecedência mínima aceita pedidos? | 7 dias (P-09) | Não |
| Q-11 | Quais são os temas de palestra, com duração, público indicado e formatos? | Temas fictícios na homologação | Sim, para a entrega |
| Q-12 | Quer registrar o valor da proposta no painel (uso interno)? | Campo opcional (P-06) | Não |
| Q-13 | Quais redes sociais e qual número de WhatsApp devem aparecer no site? | Placeholder até a resposta | Não |

### 18.2 Termo de validação (modelo)

> Eu, **Daniel Takeo Aihara**, declaro que li (ou me foi apresentado) o escopo desta especificação, versão ____, e que ela representa o que espero do sistema, com as seguintes observações: ______________________________.
>
> Respostas às questões Q-01 a Q-13: em anexo.
>
> ____________, ____/____/2026. Assinatura: ____________________. Integrantes do Grupo 4 presentes: ____________________.

Pode ser substituído por mensagem escrita do cliente (print ou e-mail) que cite a versão do documento.

## 19. Matriz de rastreabilidade

| História | Requisitos | Casos de uso | Regras | Testes |
|---|---|---|---|---|
| US-01 | RF-01, 02, 08 | UC01 | — | CT-29 |
| US-02 | RF-05 | UC02 | RN-19 | CT-24 |
| US-03 | RF-03, 04, 27 | UC01, UC14 | RN-18 | CT-23 |
| US-04 | RF-09, 10, 11 | UC03 | RN-01, 02, 15, 16 | CT-01 a 05, 22 |
| US-05 | RF-06, 32 | UC04 | RN-15, 16 | CT-05 |
| US-06 | RF-14 a 17, 21 | UC05, UC06, UC09, UC10 | RN-03, 09, 10, 13 | CT-15 a 18, 20, 21 |
| US-07 | RF-18, 24, 25 | UC07, UC13 | RN-04, 05, 07, 11 | CT-06, 07, 09, 12, 13 |
| US-08 | RF-22, 23, 24 | UC08, UC11, UC12 | RN-04, 06, 08 | CT-08, 10, 11, 14 |
| US-09 | RF-19 | UC06 | RN-12 | CT-19 |
| US-10 | RF-12, 13 | UC03 | RN-14 | CT-25 |
| US-11 | RF-29 | UC15 | RN-19 | CT-24 |
| US-12 | RF-28, 30 | UC16 | RN-04, 17 | CT-26, 27, 28 |
| — | RF-07, 20, 26, 31 | UC01, UC06, UC10 | RN-10 | Demonstração |

**Verificação de cobertura:** todo RF está ligado a uma história ou caso de uso; as regras RN-01 a RN-20 aparecem em pelo menos um teste ou RNF (RN-20 é coberta pelo relógio injetável em todos os testes de data); toda história tem ao menos um caso de teste.

## 20. Apêndice — Fontes dos diagramas

Os diagramas foram escritos em **PlantUML** e estão na pasta `diagramas/`. Para editar, instale Java e o `plantuml.jar` (ou a extensão do VS Code), edite o `.puml` e gere a imagem com `java -jar plantuml.jar -tpng diagramas/*.puml`.

| Arquivo | Diagrama |
|---|---|
| 01_contexto.puml | Contexto do sistema |
| 02_casos_uso_publico.puml, 03_casos_uso_painel.puml | Casos de uso |
| 04a_dominio_solicitacoes.puml, 04b_dominio_site.puml | Classes do domínio |
| 05_estados.puml | Estados da solicitação |
| 06_atividade_disponibilidade.puml | Atividade: verificação de disponibilidade |
| 07_sequencia_confirmacao.puml | Sequência: confirmação de palestra |
| 08_navegacao.puml | Mapa de navegação |
| 09_implantacao.puml | Implantação sugerida |
| 10_wire_publico.puml, 11_wire_painel.puml | Wireframes (PlantUML Salt) |

