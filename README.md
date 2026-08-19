# Math2048

Jogo 2048 com desafios matemáticos obrigatórios ("gatekeeper") nos blocos 16, 64, 256 e 1024, ranking global via Supabase, empacotado com Apache Cordova.

## Auditoria completa (pente-fino pós-M4)

Depois do M4, foi feita uma revisão linha a linha de todo o código, validação
matemática de todas as equações, checagem direta no banco Supabase real via
MCP, e ampliação da cobertura de testes (66 → 83 testes). **6 bugs reais**
foram encontrados e corrigidos:

1. **`continueInfinite` travava o jogo para sempre**: vencer (2048) com o
   tabuleiro cheio/sem jogadas e escolher "continuar jogando" deixava o
   status preso em `'playing'` sem nunca detectar game over. Corrigido em
   `gameState.js`; coberto por `tests/unit/gameState.test.js`.
2. **Setas do teclado quebravam a digitação em campos de texto**: `ArrowLeft`/
   `ArrowRight` moviam o tabuleiro mesmo com foco num `<input>` (ex.: resposta
   do desafio matemático), impedindo mover o cursor de texto. Corrigido em
   `keyboard.js`; coberto por `tests/unit/keyboard.test.js`.
3. **Reenvio duplicado de score ao Supabase**: recarregar a página após game
   over podia reenviar a mesma pontuação. Corrigido em `main.js`.
4. **Falha de envio de score não permitia retry**: se `submitScore` falhasse
   por rede, o flag já tinha marcado como "enviado", perdendo qualquer chance
   de reenvio. Corrigido com um lock de envio em andamento (`main.js`).
5. **Blocos acima de 2048 (modo infinito) ficavam sem estilo**: `board.css`
   não tinha regra para 4096+, então esses blocos apareciam com a cor do
   bloco "2" (mais clara), quebrando a progressão visual. Corrigido com
   estilos para 4096/8192 e um fallback genérico para qualquer valor maior.
6. **Ranking/login podiam abrir por cima do desafio matemático**: os botões
   não eram desabilitados durante `status: 'challenge'`, permitindo empilhar
   modais. Corrigido desabilitando `leaderboard-btn`/`auth-btn` nesse estado.

Também verificado e confirmado **sem bugs**: lógica de merge/movimento nas 4
direções (incluindo o caso de merge triplo `[2,2,2,0]→[4,2,0,0]`), as 20
equações do gatekeeper (validadas matematicamente uma a uma), e a conexão
real com o Supabase — tabela `scores`, RLS, as 2 policies esperadas e o
índice de performance, todos confirmados diretamente no projeto via MCP.

## Status atual — MVP completo (M1 a M4)

**Milestone 1 (motor do jogo) — completo:**
- Modelo de tabuleiro 4x4 (`www/js/core/board.js`)
- Movimento e merge nas 4 direções (`www/js/core/moves.js`, `merge.js`)
- Geração de blocos, vitória, game over e modo infinito (`www/js/core/gameState.js`)
- Renderização, input de teclado e swipe (`www/js/ui/`, `www/js/input/`)
- Modais de game over e vitória

**Milestone 2 (gatekeeper matemático) — completo:**
- Banco estático de equações por bloco gatilho (`www/data/equations.json`)
- Carregamento e filtro por gatilho (`www/js/gatekeeper/equationBank.js`)
- Validação de resposta e modal do desafio (`www/js/gatekeeper/validator.js`, `www/js/ui/modals/equationModal.js`)
- Triggers conectados aos blocos 16/64/256/1024 — `gameState.js` detecta o merge que forma um bloco gatilho e trava o jogo em `status: 'challenge'` até a resposta correta
- Tabuleiro congelado durante o desafio (HUD reflete o estado via `hud.js`) e botão "novo jogo" sempre disponível
- Persistência local da sessão (`www/js/storage/localSession.js`) — restaura board/score/status ao recarregar

**Milestone 3 (Supabase — auth, score, leaderboard) — completo:**
- Cliente Supabase (`www/js/auth/supabaseClient.js`), config real fora do git (`www/js/config/supabaseConfig.js`, gitignored — use `supabaseConfig.example.js` como template)
- **Banco de dados criado no projeto Supabase real** (`math2048` / `vtmnczqnrwbqxysddfdz`): tabela `scores` com RLS habilitado — ver `docs/supabase-schema.sql`
  - Leitura pública (ranking global sem exigir login)
  - Inserção só permitida com `auth.uid() = user_id` (evita enviar score em nome de outro usuário)
  - Sem policy de UPDATE/DELETE — pontuação enviada não pode ser adulterada depois
- Fluxo de cadastro/login/logout (`www/js/auth/signup.js`, `login.js`, `session.js`) com validação básica de e-mail/senha antes de qualquer chamada de rede
- Tela de autenticação com opção de jogar sem conta (`www/js/ui/screens/authScreen.js`)
- Envio automático do score ao fim de partida para usuários autenticados (`www/js/ranking/scoreService.js`) e tela de ranking Top 10 (`leaderboardQuery.js` + `leaderboardScreen.js`)

**Milestone 4 (build Android, responsividade, i18n, CI, entrega) — completo:**
- `config.xml` revisado para build Android básico (ver seção "Cordova" abaixo)
- Responsividade reforçada: breakpoints para telas pequenas, paisagem em celular e `prefers-reduced-motion`; posição dos blocos recalculada em resize/rotação
- Estrutura i18n-ready (`www/js/i18n/i18n.js`) — todos os textos visíveis da UI passam por `t('chave')`; adicionar um idioma novo é só criar outra entrada em `LOCALES`, sem tocar nos componentes
- Build de produção minificado (`npm run build:web:prod`) — bundle caiu de ~930kb para ~274kb
- CI (`.github/workflows/ci.yml`) roda lint, testes e build de produção a cada push/PR, com um limite de tamanho de bundle (falha se passar de 1.5MB)
- JSDoc revisado em todas as funções públicas do código
- Testes de carga/estresse simulados do ranking (`tests/integration/supabase.test.js`) + documentação de gargalos conhecidos (`docs/load-testing.md`)
- **83 testes no total** (unitários + integração, após a auditoria), todos passando; lint limpo

## Limitações conhecidas (registradas para transparência)

- **Gatekeeper — trigger duplo na mesma jogada**: se uma única jogada formar dois blocos-gatilho simultaneamente (ex.: 16 e 64 no mesmo swipe), só o primeiro dispara um desafio; não há fila para o segundo. Caso raro na prática, documentado em `www/js/core/gameState.js`.
- **Ícones e splash screen do Android**: `config.xml` não referencia nenhum PNG (evita quebrar o build); os assets reais ainda não foram fornecidos. Ver `res/README.md` para o que falta antes de gerar um build de produção assinado.
- **Build Android real não foi executado**: este ambiente de desenvolvimento não tem Android SDK/Gradle instalado, então só foi possível validar que `config.xml` é XML válido e consistente — o build real (`cordova build android`) precisa ser rodado numa máquina com o SDK instalado (ou CI com esse setup).
- **Testes de carga do Supabase são simulados**: sem acesso de rede real ao domínio `supabase.co` neste ambiente, a carga foi simulada sobre um cliente mockado (valida a camada de serviço, não a latência real do banco). Ver `docs/load-testing.md`.
- **Sem rodada de beta real**: o item "revisar feedback de beta" do M4-06 não pôde ser feito com feedback de usuários reais neste momento — o que existe é a autorrevisão registrada abaixo. Quando houver uma rodada de beta com o grupo, os ajustes de usabilidade decorrentes devem entrar aqui.
- **Push para GitHub pendente**: o código está commitado localmente; falta autenticação (token ou conector) para subir num repositório remoto.

## Setup local

```bash
npm install
cp www/js/config/supabaseConfig.example.js www/js/config/supabaseConfig.js
# edite supabaseConfig.js com a URL e a anon key do projeto Supabase
npm run build:web   # gera www/dist/bundle.js a partir de www/js/main.js
```

Depois abra `www/index.html` num navegador (ou sirva a pasta `www/` com qualquer servidor estático) para jogar. Sem o `supabaseConfig.js`, o jogo funciona normalmente offline — só login/ranking ficam indisponíveis.

## Scripts

| Comando | O que faz |
|---|---|
| `npm test` | Roda os testes (Jest) — unitários + integração |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npm run lint` | ESLint sobre `www/js/**` |
| `npm run build:web` | Bundle de desenvolvimento (não minificado) |
| `npm run build:web:prod` | Bundle de produção minificado (usado na CI) |
| `npm run watch:web` | Build em modo watch |

## Cordova (build Android)

```bash
npm install -g cordova
cordova platform add android
cordova build android
```

> Antes de gerar um build de produção/assinado, adicione ícones e splash
> reais em `res/` — ver `res/README.md`. O build acima só foi validado
> estruturalmente (XML do `config.xml`); rodar de fato requer Android
> SDK/Gradle instalados no ambiente.

## Estrutura

```
www/
  index.html
  css/            base, board, modals, responsive
  data/           equations.json (banco estático do gatekeeper)
  js/
    core/         board, moves, merge, gameState (motor puro, sem DOM)
    gatekeeper/    equationBank, validator (desafio matemático, sem DOM)
    auth/         supabaseClient, signup, login, session
    ranking/      scoreService, leaderboardQuery
    config/       supabaseConfig.js (gitignored) + .example (template)
    i18n/         i18n.js (dicionário de strings + helper t())
    ui/           boardRenderer, hud, modais, telas (auth, leaderboard)
    input/        keyboard, swipe
    storage/      localSession (persistência local)
    main.js       entrypoint (empacotado via esbuild)
  dist/           bundle.js gerado (não versionado)
res/              ícones/splash do Android (ver res/README.md — vazio por ora)
docs/             supabase-schema.sql, load-testing.md
tests/
  unit/           motor, gatekeeper, i18n
  integration/    auth, ranking e carga/estresse (mock do Supabase)
```

## CI

`.github/workflows/ci.yml` roda lint, testes e o build de produção a cada
push/PR em `main`/`develop`, com um limite de tamanho de bundle (1.5MB).

## Checklist de entrega (autorrevisão M4-06)

- [x] Motor do jogo funcional e testado (M1)
- [x] Gatekeeper matemático conectado aos 4 blocos gatilho (M2)
- [x] Auth + ranking funcionando contra um projeto Supabase real, com RLS (M3)
- [x] `config.xml` sem referências quebradas (M4-01)
- [x] Responsividade revisada (pequenas telas, paisagem, resize) (M4-02)
- [x] Estrutura i18n-ready e assets sob controle de tamanho (M4-03)
- [x] CI com lint + testes + build, JSDoc revisado (M4-04)
- [x] Teste de carga simulado + documentação de gargalos (M4-05)
- [x] Documentação final consolidada neste README (M4-06)
- [ ] Rodada de beta com usuários reais (pendente — sem acesso a testers neste momento)
- [ ] Push para o repositório remoto no GitHub (pendente — falta autenticação)
