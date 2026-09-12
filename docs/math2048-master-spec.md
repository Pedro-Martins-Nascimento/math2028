# Math2048 — Documento Mestre do Projeto

> **Para quem for continuar este projeto (humano ou IA):** este documento é a fonte única de verdade. Ele reflete o **estado real do código** (auditado diretamente no repositório GitHub em 12/09/2026), não o board do Notion, que está desatualizado em relação ao código (ver seção "Aviso importante" abaixo). Leia isso inteiro antes de tocar em qualquer arquivo.

---

## 0. Aviso importante — Notion vs. Código real

O board do Notion ("Math2048 Tasks AI") está cronologicamente defasado: ele mostra M3-02 como "Em andamento" e M3-03 em diante como "Não iniciada", com previsão de conclusão só em outubro. **Isso não reflete a realidade.** Uma auditoria direta no repositório (`github.com/Pedro-Martins-Nascimento/math2028`, branch `main`) em 12/09/2026 confirmou, rodando os testes de verdade (não só lendo o README):

- `npm test` → **83 testes passando, 11 suites, 0 falhas**
- `npm run lint` → **0 erros**
- Todas as milestones M1, M2, M3 e M4 têm código implementado e testado
- Existe um banco Supabase real e configurado (projeto `math2048`, ref `vtmnczqnrwbqxysddfdz`) com RLS

Ou seja: **o jogo em si está funcionalmente completo**, exceto pelas lacunas listadas na Seção 4. Este documento usa o código real como fonte de verdade para "o que já foi feito", e as tarefas do Notion (com toda sua especificação detalhada) como fonte de verdade para "o que cada parte deveria fazer e por quê".

**Ação recomendada:** o board do Notion deveria ser atualizado para refletir isso, mas isso foi propositalmente deixado de fora deste documento a pedido do responsável pelo projeto — trate a atualização do Notion como uma tarefa separada, não descrita aqui.

---

## 1. Contexto do projeto

- **Nome:** Math2048 — jogo sério que ensina equações de 1º grau usando a mecânica do 2048.
- **Disciplina:** Projeto de Aprendizagem Colaborativa Extensionista III/IV — Engenharia de Software, Católica de Santa Catarina, Jaraguá do Sul.
- **Equipe:** Felipe Vieira, Júlia Paz e Silva, Klaus Christoph Emmerich Jourdain, Lucas Montimór Soares Barra, Pedro Martins do Nascimento.
- **Orientação:** Prof. Andrei Carniel (e Profa. Beatriz M. Reichert, conforme relatório de progresso mais recente).
- **Decisão de execução:** apenas Pedro está implementando o código a partir de determinado ponto do projeto — a divisão de papéis abaixo é histórica/planejada, não necessariamente quem de fato escreveu cada linha.
- **Público-alvo do jogo:** estudantes do Ensino Fundamental II / Médio, para praticar raciocínio lógico-matemático.

### Entregas do PAC IV (2º semestre 2026)
| Entrega | Peso | Prazo | Escopo esperado |
|---|---|---|---|
| N1 | 20% | 15/09/2026 | 35% do jogo — cobre M1 + M2 |
| N2 | 20% | 20/10/2026 | 70% do jogo — cobre até M3 |
| N3 | 60% | 23/11/2026 | Entrega final, relatório e seminário — M4 completo |

Aulas presenciais/EAD alternadas às terças desde 28/07; encerramento das atividades em 12/12 (sábado, remoto).

**Situação real vs. cronograma:** dado que M1–M4 já estão implementados no código, o projeto está **adiantado** em relação a N2 e até N3 — falta reportar isso adequadamente e endereçar as lacunas reais (Seção 4) antes da entrega final.

---

## 2. Documentos-fonte do projeto

Três documentos acadêmicos definem o escopo e não devem ser contrariados sem justificativa:

1. **TDD (Test Design Document)** — arquitetura de software, stack, requisitos funcionais (RF-01 a RF-20) e não funcionais (RNF-01 a RNF-20). É a fonte de verdade técnica.
2. **WDD (World Design Document)** — ambientação, tom visual, a metáfora do "Gatekeeper" e dos "Portais de Gatekeeping", paleta de cores por valor de bloco, som e atmosfera.
3. **GDD (Game Design Document)** — história, gameplay, personagens, controles, câmera, universo do jogo, interface, cronograma original.

### 2.1 Lore e identidade (do WDD/GDD — não é só estética, faz parte do escopo entregável)
- O jogador é um "estudante-desafiante" num universo numérico abstrato e minimalista.
- **O Gatekeeper**: entidade abstrata sem forma física, manifestada como o modal de equação. É o único "NPC"/antagonista do jogo. Representa a barreira entre conhecimento superficial e maestria matemática.
- **Portais de Gatekeeping**: os travamentos obrigatórios do tabuleiro nos blocos 16, 64, 256 e 1024.
- **Estados do mundo**: Estado Fluido (tabuleiro livre) e Estado Bloqueado (desafio ativo, congela o tabuleiro).
- **Linha do tempo narrativa**: Era da Gênese (init) → Eras de Barreira (gatekeeper) → Apocalipse (Game Over) ou Ascensão (You Win, libera Modo Infinito).
- **Paleta de cores progressiva** (WDD seção 8): tons pastel suaves para blocos baixos (2, 4, 8), cores quentes/vibrantes para blocos médios (16, 64, 128), tons dourados/brilhantes para blocos altos (1024, 2048).
- **Direção de arte**: Flat Design minimalista, sem elementos 3D, sem cutscenes (decisão técnica deliberada por causa do limite de 5MB de assets e leveza em dispositivos antigos).
- **Facções (fluff, não afeta mecânica)**: "Os Aprendizes" (jogadores casuais) vs. "Os Mestres do Grid" (competidores do ranking).

---

## 3. Arquitetura e decisões técnicas (já implementadas)

### 3.1 Stack
- **Sem bundler** — JS puro, ES6 Modules nativos, carregado direto pelo navegador/WebView. Decisão deliberada para manter o projeto simples e alinhado ao TDD original.
- **HTML5 + CSS3** (Flexbox/Grid) para toda a UI.
- **Supabase** (Postgres + Auth) para autenticação e ranking.
- **Apache Cordova** para empacotamento Android.
- **Jest + babel-jest** para testes — babel só transforma ESM→CJS no pipeline de teste; o app em si continua sem build step.

### 3.2 Estrutura de pastas (padrão Cordova nativo)
```
math2028/
├── www/                        # Raiz servida pelo Cordova — é o app em si
│   ├── index.html
│   ├── js/
│   │   ├── core/                # board.js, moves.js, merge.js, gameState.js
│   │   ├── gatekeeper/           # equationBank.js, validator.js
│   │   ├── auth/                 # supabaseClient.js, login.js, signup.js, session.js
│   │   ├── ranking/               # scoreService.js, leaderboardQuery.js
│   │   ├── storage/                # localSession.js
│   │   ├── ui/                      # boardRenderer.js, hud.js, modals/, screens/
│   │   ├── input/                    # keyboard.js, swipe.js
│   │   ├── i18n/                      # (extra, adicionado além do escopo original)
│   │   └── main.js
│   ├── css/                     # base.css, board.css, modals.css, responsive.css
│   ├── data/equations.json      # banco estático de equações (5 por gatilho: 16/64/256/1024)
│   └── assets/                  # icons/, sounds/, fonts/ — ATUALMENTE VAZIO (ver Seção 4)
├── config.xml                    # Config Cordova
├── res/                           # ícones/splash Android — ATUALMENTE SÓ TEM README (ver Seção 4)
├── tests/unit/ + tests/integration/
├── docs/                          # inclui load-testing.md, supabase-schema.sql
├── .github/workflows/ci.yml       # CI: lint + testes
├── babel.config.js, jest.config.js, .eslintrc.json
└── package.json
```

### 3.3 Regras de negócio decididas (não renegociar sem motivo forte)
- Matriz 4x4, inicializa com dois blocos aleatórios (2 ou 4) — **RF-01**
- Movimento em 4 direções (N/S/L/O), swipe no mobile, setas no desktop — **RF-02**
- Fusão de blocos iguais ao colidir — **RF-03**
- Novo bloco gerado após cada movimento válido — **RF-04**
- Travamento obrigatório do tabuleiro (Gatekeeper) ao atingir **16, 64, 256, 1024** (primeira vez) — **RF-05 a RF-08**
- Resposta validada contra banco fixo (JSON local, sem geração dinâmica de equações) — **RF-09**
- Cadastro/login/logout via Supabase Auth — **RF-10, RF-11, RF-20**
- Nome do usuário logado exibido no HUD — **RF-12**
- Score final enviado à tabela `leaderboard` no fim da partida — **RF-13**
- Ranking Top 10 global — **RF-14**
- Botão "Novo Jogo" a qualquer momento — **RF-15**
- Mensagem de Game Over quando não há mais movimentos possíveis — **RF-16**
- Mensagem "You Win" ao atingir 2048, com opção de continuar em Modo Infinito — **RF-17, RF-18**
- Estado local salvo via `localStorage` para sobreviver a refresh acidental — **RF-19**

### 3.4 O que está fora do escopo (decisão deliberada, não é lacuna)
- Funcionamento 100% offline (exige internet por causa de Auth/ranking)
- Geração dinâmica de equações via IA (banco é estático e fixo)
- Multiplayer em tempo real (só ranking assíncrono)
- Gráficos 3D / engines pesadas (Unity, Three.js) — deliberadamente evitado
- Microtransações / compras in-app

---

## 4. LACUNAS REAIS — o que ainda falta fazer

Estas são as únicas pendências genuínas encontradas na auditoria do código contra o TDD/WDD/GDD. Todo o resto do escopo funcional já está implementado e testado.

### 4.1 Sistema de áudio (ausência total) — WDD seção 9 + TDD seção 11
**Status:** zero implementação. Nenhum arquivo de som no repositório, nenhum módulo de áudio no código (`grep` por "audio", "sound", ".wav", "Tone." não retornou nada em `www/js/`).

**O que fazer:**
- Criar `www/js/audio/soundManager.js` — módulo simples de reprodução de efeitos sonoros via `HTMLAudioElement` ou Web Audio API.
- Adicionar 5 efeitos sonoros curtos em WAV (leves, poucos KB cada, respeitando o limite de 5MB total de assets — **RNF-17**):
  - Som suave de "deslize" ao mover blocos
  - Som "harmônico" de fusão ao juntar blocos iguais
  - Alerta sonoro ao abrir o modal de desafio (Gatekeeper)
  - Fanfarra curta de vitória (You Win)
  - Som grave de derrota (Game Over)
- Trilha ambiente Lo-Fi/minimalista de fundo (opcional, mas citada no WDD) — deve poder ser mutada, e não pode comprometer o limite de 5MB.
- **Pode mexer:** `www/js/audio/`, `www/assets/sounds/`, `www/js/main.js` (para disparar os sons nos eventos certos), `www/js/core/gameState.js` (hooks de evento).
- **Critérios de aceite:** cada ação (mover, fundir, abrir desafio, vencer, perder) dispara o som correspondente; o app funciona normalmente com áudio desabilitado/bloqueado pelo navegador (fallback silencioso, sem quebrar); pacote total de assets continua abaixo de 5MB.
- **Não fazer:** não adicionar dependências pesadas de áudio (nada de engines de áudio complexas) — é um jogo leve, o som deve ser simples.

### 4.2 Ícones e assets visuais (SVG) — TDD seção 11
**Status:** `res/` só tem um `README.md` placeholder. Nenhum ícone real, nenhum splash screen do Android.

**O que fazer:**
- Criar ícones em SVG (formato vetorial, conforme TDD) para o app — pelo menos um ícone principal e variações de tamanho para Android (`res/icon/android/`).
- Criar splash screen simples (pode ser minimalista, alinhado com o Flat Design do WDD) em `res/screen/android/`.
- Referenciar os ícones/splash corretamente no `config.xml`.
- **Critérios de aceite:** `cordova build android` (quando executado com Android SDK disponível) usa os ícones e splash reais, não os placeholders padrão do Cordova.

### 4.3 Build Android real nunca executado — RNF-14
**Status:** o ambiente de desenvolvimento usado até agora não tem Android SDK; só foi validado que `config.xml` é XML bem-formado. `cordova build android` nunca rodou de fato.

**O que fazer:**
- Em um ambiente com Android SDK (ou usando um serviço de CI com esse suporte, ex: GitHub Actions com `android-actions/setup-android`), rodar `cordova platform add android` e `cordova build android` de verdade.
- Corrigir qualquer erro de build que aparecer (é esperado que apareça algo na primeira tentativa real).
- Gerar um `.apk` funcional e testável em um emulador ou dispositivo físico.
- **Critérios de aceite:** existe um `.apk` gerado que abre e roda o jogo em um dispositivo/emulador Android real, não só a validação estática do XML.

### 4.4 Teste de carga real, não simulado — RNF-12
**Status:** `docs/load-testing.md` existe, mas o teste foi feito com mock do Supabase (rede simulada), não contra o banco real com 100+ requisições simultâneas de verdade.

**O que fazer:**
- Rodar um teste de carga real contra o projeto Supabase (`math2048` / `vtmnczqnrwbqxysddfdz`), simulando pelo menos 100 requisições simultâneas de leitura/escrita no ranking.
- Ferramentas possíveis: `autocannon`, `k6`, ou um script simples em Node disparando requisições em paralelo com `Promise.all`.
- Documentar os resultados reais (latência, taxa de erro, se houve throttling do Supabase) em `docs/load-testing.md`, substituindo os dados simulados.
- **Critérios de aceite:** existe um registro de teste de carga contra o banco real, com números reais de latência/erro, não estimativas.

### 4.5 Beta test com usuários reais — M4-06 original
**Status:** o que existe até agora é autorrevisão do próprio código (a "auditoria pós-M4" citada no README), não feedback de usuários externos.

**O que fazer:**
- Distribuir o `.apk` (ou uma versão web hospedada) para um pequeno grupo de testadores reais (colegas, outros alunos).
- Coletar feedback estruturado sobre usabilidade, dificuldade das equações, e eventuais bugs não pegos pelos testes automatizados.
- Ajustar com base no feedback antes da entrega final (N3, 23/11).
- **Critérios de aceite:** existe um registro (ainda que simples — um formulário, uma planilha, um documento) do feedback coletado e das mudanças feitas em resposta a ele.

---

## 5. Checklist completo de Requisitos (RF/RNF) — status real

### Requisitos Funcionais
| ID | Descrição | Status |
|---|---|---|
| RF-01 | Inicializar matriz 4x4 com dois valores aleatórios | ✅ Implementado e testado |
| RF-02 | Deslizar blocos em 4 direções | ✅ Implementado e testado |
| RF-03 | Fusão de blocos com mesmo valor | ✅ Implementado e testado |
| RF-04 | Gerar novo bloco após movimento válido | ✅ Implementado e testado |
| RF-05 a RF-08 | Travar e exibir desafio nos blocos 16/64/256/1024 | ✅ Implementado e testado |
| RF-09 | Validar resposta numérica contra banco fixo | ✅ Implementado e testado |
| RF-10, RF-11 | Cadastro e login via Supabase Auth | ✅ Implementado |
| RF-12 | Exibir nome do usuário logado no HUD | ✅ Implementado |
| RF-13 | Enviar pontuação final ao leaderboard | ✅ Implementado |
| RF-14 | Exibir ranking Top 10 global | ✅ Implementado |
| RF-15 | Botão "Novo Jogo" | ✅ Implementado |
| RF-16 | Mensagem de Game Over | ✅ Implementado e testado |
| RF-17 | Mensagem "You Win" ao atingir 2048 | ✅ Implementado e testado |
| RF-18 | Modo Infinito pós-2048 | ✅ Implementado e testado |
| RF-19 | Salvar estado local (localStorage) | ✅ Implementado e testado |
| RF-20 | Botão de Logout | ✅ Implementado |

### Requisitos Não Funcionais (destaques — os demais estão implementados conforme código/CI)
| ID | Descrição | Status |
|---|---|---|
| RNF-01, RNF-02 | Input <100ms, 60 FPS | ✅ Implementado (requestAnimationFrame + CSS transform) |
| RNF-03 | Latência Supabase não trava jogo local | ✅ Chamadas assíncronas |
| RNF-05 | Splash screen <3s | ⚠️ Splash real não existe ainda (ver 4.2) |
| RNF-09 | Acessibilidade/contraste | ✅ Implementado |
| RNF-11 | Responsivo 360px–1920px | ✅ Implementado |
| RNF-12 | 100 requisições simultâneas | ⚠️ Só simulado (ver 4.4) |
| RNF-14 | Empacotável como APK | ⚠️ Nunca buildado de fato (ver 4.3) |
| RNF-17 | Assets <5MB | ✅ (mas vai precisar reconferir depois de adicionar áudio/ícones) |
| RNF-18 | ESLint sem erros críticos | ✅ Confirmado rodando `npm run lint` |
| RNF-19 | JSDoc nas funções principais | ✅ Implementado |
| RNF-20 | Tratamento de erro de rede amigável | ✅ Implementado |

---

## 6. Histórico de tarefas (Notion — especificação original de cada bloco de trabalho)

Cada tarefa abaixo já está **implementada e verificada no código real**, mas a especificação original (do Notion) é reproduzida aqui porque descreve exatamente o escopo, os limites e os critérios de aceite que qualquer IA/dev deveria respeitar se precisar revisar ou expandir essa parte do código.

### Milestone M1 — Motor 2048 Funcional
1. **M1-01 — Criar base do repositório.** Estruturar o projeto para desenvolvimento local, testes e CI. Arquivos: `.gitignore`, `package.json`, `.eslintrc.json`, `babel.config.js`, `jest.config.js`, `README.md`, `config.xml`, `.github/workflows/ci.yml`. Critério: repo com scripts básicos definidos, estrutura raiz consistente.
2. **M1-02 — Montar shell Cordova e base visual.** Tela inicial no padrão Cordova, HTML/CSS carregando corretamente. Critério: splash <3s (RNF-05), contraste/acessibilidade WCAG (RNF-09).
3. **M1-03 — Criar modelo do tabuleiro.** Estado 4x4, criação e clone seguro da matriz (`www/js/core/board.js`).
4. **M1-04 — Implementar movimento e merge.** Deslocamento e fusão em todas as direções (`moves.js`, `merge.js`).
5. **M1-05 — Gerar novos blocos e controlar estado.** Novo bloco após jogada válida, estados básicos de execução.
6. **M1-06 — Renderização e input base.** Board renderizado, teclado/swipe ligados. Critério: input <100ms (RNF-01), 60 FPS (RNF-02).
7. **M1-07 — Game over, vitória e modo infinito.** Detecção de fim de jogo, vitória, e continuação pós-2048.
8. **M1-08 — Testes unitários do motor.** Cobertura de board, moves, merge.

### Milestone M2 — Sistema de Desafio Matemático (Gatekeeper)
1. **M2-01 — Estruturar banco de equações.** `www/data/equations.json`, separado por bloco gatilho, formato consistente.
2. **M2-02 — Filtrar equações por gatilho.** Carregamento e filtro por bloco em `equationBank.js`.
3. **M2-03 — Validar resposta e abrir modal.** `validator.js` + `equationModal.js`.
4. **M2-04 — Conectar triggers 16/64/256/1024.** Disparo obrigatório do desafio, sem avançar sem resposta correta.
5. **M2-05 — Congelar tabuleiro e criar novo jogo.** Freeze durante desafio, reinício de partida.
6. **M2-06 — Persistência local e testes do gatekeeper.** Salvar/restaurar estado, testes de filtro/validação/bloqueio.

### Milestone M3 — Integração Supabase
1. **M3-01 — Preparar projeto e cliente Supabase.** Inicialização do client, chamadas assíncronas não-bloqueantes (RNF-03).
2. **M3-02 — Implementar signup, login e logout.** Fluxo único de autenticação.
3. **M3-03 — Criar tela de auth e HUD do usuário.** Interface de login/cadastro, usuário exibido no HUD.
4. **M3-04 — Implementar score e leaderboard.** Envio de score, consulta Top 10 global.
5. **M3-05 — Segurança, rede e LGPD.** Tratamento de erro de rede, credenciais protegidas, anti-manipulação trivial de score.
6. **M3-06 — Testes de integração Supabase.** Cobertura dos fluxos críticos de auth/ranking.

### Milestone M4 — Build Cordova e Beta Test
1. **M4-01 — Configurar build Android no Cordova.** Ajustar `config.xml`. *(Config pronta; build real ainda pendente — ver Seção 4.3)*
2. **M4-02 — Validar responsividade e performance.** CSS responsivo 360px–1920px, consumo controlado.
3. **M4-03 — Garantir compatibilidade, i18n e assets.** Cross-browser, estrutura i18n-ready, peso de assets controlado.
4. **M4-04 — Fechar CI, lint e documentação.** CI rodando lint+testes, JSDoc nas funções principais.
5. **M4-05 — Testar carga e estresse do ranking.** *(Feito de forma simulada; teste real ainda pendente — ver Seção 4.4)*
6. **M4-06 — Ajustes finais e documentação de entrega.** *(Ajustes de beta ainda pendentes de feedback real — ver Seção 4.5)*

---

## 7. Como rodar o projeto (para quem for continuar)

```bash
# instalar dependências
npm install

# rodar testes
npm test

# rodar lint
npm run lint

# servir localmente (sem build, JS puro)
npx serve www

# build Android (requer Android SDK configurado)
cordova platform add android
cordova build android
```

Credenciais do Supabase ficam fora do controle de versão (`www/js/config/supabaseConfig.js` e `www/js/config/secrets.js` estão no `.gitignore`) — quem for continuar precisa configurar essas credenciais localmente a partir de um arquivo de exemplo (`supabaseConfig.example.js`, se existir) ou pegar as credenciais reais do projeto Supabase `math2048`.

---

## 8. Resumo executivo (TL;DR para quem só quer saber o que fazer agora)

O jogo está **funcionalmente pronto** (M1 a M4 implementados e testados). As únicas 5 pendências reais, em ordem sugerida de prioridade:

1. 🔊 **Áudio** — nenhum som implementado (WDD pede 5 efeitos + trilha ambiente)
2. 🎨 **Ícones/splash reais** — `res/` está vazio
3. 📱 **Build Android real** — nunca rodado com Android SDK de verdade
4. 📊 **Teste de carga real** — só foi simulado com mock
5. 👥 **Beta test com usuários reais** — só teve autorrevisão até agora

Tudo o mais (motor do jogo, Gatekeeper, autenticação, ranking, CI, testes, i18n, responsividade, segurança) está implementado, testado e verificado.
