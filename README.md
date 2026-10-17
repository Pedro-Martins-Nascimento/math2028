# 🎮 Math2048 — Arcade Edition

> **Jogo 2048 educativo com desafios matemáticos ("Gatekeeper" — equações de 1º grau), sistema de áudio nativo, autenticação e ranking global via Supabase, empacotado para Android com Apache Cordova.**

[![CI](https://github.com/Pedro-Martins-Nascimento/math2028/actions/workflows/ci.yml/badge.svg)](https://github.com/Pedro-Martins-Nascimento/math2028/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/tests-96%20passed-brightgreen.svg)](https://github.com/Pedro-Martins-Nascimento/math2028)
[![Lint](https://img.shields.io/badge/lint-clean-blue.svg)](https://github.com/Pedro-Martins-Nascimento/math2028)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

---

## 📚 Contexto Acadêmico

- **Instituição:** Católica de Santa Catarina — Centro Universitário, Jaraguá do Sul.
- **Curso:** Engenharia de Software.
- **Disciplina:** Projeto de Aprendizagem Colaborativa Extensionista III/IV (PAC).
- **Orientação:** Prof. Andrei Carniel e Profa. Beatriz M. Reichert.
- **Equipe:** Felipe Vieira, Júlia Paz e Silva, Klaus Christoph Emmerich Jourdain, Lucas Montimór Soares Barra, Pedro Martins do Nascimento.

---

## ⚡ Como Rodar Localmente (Passo a Passo)

### 1. Clonar e Instalar Dependências
```bash
git clone https://github.com/Pedro-Martins-Nascimento/math2028.git
cd math2028
npm install
```

### 2. Configurar o Supabase (Autenticação e Ranking)
Por diretrizes de segurança (M3-01 / M3-05), o arquivo com as credenciais não fica no repositório público.
1. Crie o arquivo **`www/js/config/supabaseConfig.js`** (você pode copiar o modelo de `www/js/config/supabaseConfig.example.js`).
2. Cole as credenciais compartilhadas pela equipe (ex.: via **Bitwarden Send** ou cofre seguro):
```javascript
module.exports = {
  SUPABASE_URL: 'SUA_SUPABASE_URL_RECEBIDA_VIA_BITWARDEN',
  SUPABASE_ANON_KEY: 'SUA_ANON_KEY_RECEBIDA_VIA_BITWARDEN'
};
```
> 💡 *Nota: Se você rodar sem criar esse arquivo, o jogo funcionará normalmente no modo **"Jogar sem conta" (offline)**, apenas sem sincronização do ranking na nuvem.*

### 3. Iniciar o Servidor
```bash
npm start
```

O comando irá empacotar o bundle (`bundle.js`) e abrir o servidor em:
👉 **`http://localhost:5173`**

> 📱 **Mobile-First:** Pressione `F12` no navegador e ative a emulação de dispositivo móvel (ou redimensione a janela) para experimentar a proporção ideal para smartphones.

---

## 🕹️ Funcionalidades e Gameplay

1. **Motor 2048 Puro:**
   - Grade clássica 4x4 com deslizamento suave nas 4 direções cardeais (teclas direcionais/WASD no desktop ou gestos de *swipe* no mobile).
   - Detecção precisa de merges sem repetição dupla, cálculo de pontuação em tempo real e persistência local contínua via `localStorage`.
   - Modos Vitória (bloco 2048), Modo Infinito pós-2048 e Game Over.

2. **O "Gatekeeper" Matemático:**
   - Travamento obrigatório do tabuleiro ao formar pela primeira vez os blocos **16, 64, 256 e 1024**.
   - Exibição de desafios com equações reais de 1º grau (ex: `2x + 4 = 10`), com dificuldade progressiva, dicas contextuais e teclado virtual dedicado.
   - O jogo só é destravado após a resolução correta da equação.

3. **Sistema de Som Sintetizado (Web Audio API):**
   - Áudio nativo leve e sintetizado sem arquivos externos pesados (0KB de impacto de assets).
   - Efeitos sonoros para: deslizamento, fusão harmônica, alerta do Gatekeeper, vitória triunfante e derrota.
   - Botão de alternar som (`🔊 / 🔇`) acessível no topo, com preferência salva localmente.

4. **Nuvem & Ranking Global (Supabase):**
   - Autenticação completa (Cadastro, Login e Logout).
   - Gravação de recordes e consulta ao **Top 10 Global** em tempo real.
   - Modo convidado ("Jogar sem conta") com degradação graciosa caso esteja offline.

5. **Design Arcade Neo-Brutalism:**
   - Paleta vibrante inspirada em fliperamas (roxo cósmico, amarelo neon, ciano, rosa vibrante).
   - Bordas marcadas, sombras duras e tipografia moderna de alto contraste com total conformidade com diretrizes de acessibilidade (WCAG).

---

## 🔒 Segurança e Conexão com Supabase

As credenciais do Supabase ficam centralizadas em:
- Arquivo real: `www/js/config/supabaseConfig.js` *(ignorado pelo Git via `.gitignore`)*.
- Template de exemplo: `www/js/config/supabaseConfig.example.js`.

### Arquitetura de Segurança (M3-05)
- **Credenciais Protegidas:** Nenhuma chave secreta (`service_role`) está no front-end. Utilizamos apenas a chave pública `anon`.
- **Row Level Security (RLS) no PostgreSQL:**
  - Leitura pública (`scores_select_public`) para o mural de líderes global.
  - Inserção autenticada (`scores_insert_own`): Cada jogador só consegue gravar pontuação vinculada ao seu próprio token JWT (`auth.uid() = user_id`), impedindo adulteração de score.
  - Atualizações e exclusões bloqueadas por padrão.
- **Content Security Policy (CSP):** Cabeçalho restritivo em `www/index.html` limitando requisições externas estritamente ao domínio do Supabase.

---

## 🧪 Qualidade de Código & Testes

O projeto conta com uma suíte rigorosa de **96 testes automatizados** (unitários e de integração):

```bash
# Executar todos os testes
npm test

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar linter ESLint
npm run lint

# Gerar bundle de produção minificado
npm run build:web:prod
```

### Resumo dos Testes:
- **Motor do Jogo:** Criação de tabuleiro, clone seguro, merges, movimentos, detecção de fim de jogo e vitória.
- **Gatekeeper:** Filtro de equações, gerador pseudoaleatório, validadores numéricos e congelamento de estado.
- **Áudio:** Inicialização do sintetizador Web Audio API, disparos de frequências e persistência do mudo.
- **Supabase Mock & Integração:** Fluxos de Signup/Login/Logout, isolamento de requisições concorrentes e tratamento de quedas de rede.
- **Teste de Carga Real:** Teste de estresse real com 100 requisições simultâneas contra o Supabase (`sa-east-1`), obtendo 100% de sucesso e latência média de ~14ms (ver `docs/load-testing.md`).

---

## 📁 Estrutura de Pastas

```text
math2048/
├── www/                        # Aplicação Web / Cordova
│   ├── index.html              # Shell HTML com CSP e navegação
│   ├── css/                    # Estilos Neo-Brutalistas (base, board, modals, responsive)
│   ├── data/                   # equations.json (banco de equações de 1º grau)
│   ├── dist/                   # bundle.js compilado via esbuild (gitignored)
│   └── js/
│       ├── audio/              # soundManager.js (sintetizador Web Audio API)
│       ├── auth/               # supabaseClient.js, session.js, login.js, signup.js
│       ├── config/             # supabaseConfig.js (gitignored) + .example
│       ├── core/               # board.js, moves.js, merge.js, gameState.js
│       ├── gatekeeper/         # equationBank.js, validator.js
│       ├── i18n/               # Internacionalização (pt-BR)
│       ├── input/              # keyboard.js, swipe.js
│       ├── ranking/            # scoreService.js, leaderboardQuery.js
│       ├── storage/            # localSession.js, highScore.js
│       ├── ui/                 # boardRenderer.js, navigation.js, hud.js, modais e telas
│       └── main.js             # Ponto de entrada da aplicação
├── res/                        # Recursos de plataforma móvel
│   ├── icon/android/           # Ícone vetorial oficial (icon.svg)
│   └── screen/android/         # Splash screen oficial (splash.svg)
├── docs/                       # Documentações mestres
│   ├── math2048-master-spec.md # Especificação completa e status
│   ├── design-system.md        # Guia de estilo Arcade Neo-Brutalism
│   ├── supabase-schema.sql     # Schema DDL e políticas RLS
│   └── load-testing.md         # Relatório de teste de carga real (100 reqs)
├── tests/                      # 96 Testes Automatizados (Jest)
│   ├── unit/                   # Testes unitários do motor, áudio, storage e regras
│   └── integration/            # Testes de integração de auth, ranking e carga
├── config.xml                  # Configuração Apache Cordova (Android)
└── package.json                # Dependências e scripts npm
```

---

## 🚀 Status das Entregas do PAC

- [x] **N1 (15/09 — 35%):** M1 (Motor 2048) e M2 (Gatekeeper) completos e validados.
- [x] **N2 (20/10 — 70%):** M3 (Integração Supabase ativa, Auth, Leaderboard em tempo real e RLS).
- [x] **Áudio & Assets (Adiantado):** Sistema de áudio sintetizado e assets em `res/`.
- [ ] **N3 (23/11 — 100%):** Rodada de testes beta com usuários finais, empacotamento do APK final e relatório acadêmico de conclusão.

---

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos e pedagógicos sob a licença [MIT](LICENSE).
