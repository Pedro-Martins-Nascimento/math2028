# Math2048

Jogo 2048 com desafios matemáticos obrigatórios ("Gatekeeper" — equações de
1º grau reais) nos blocos 16, 64, 256 e 1024, ranking global via Supabase,
empacotado com Apache Cordova.

## Como rodar (rápido)

```bash
npm install
npm start
```

O `npm start` builda o bundle e sobe um servidor local, mostrando a URL no
terminal (ex.: `http://127.0.0.1:5173`). Abra esse endereço no navegador —
o app é **mobile-first**: use o modo de dispositivo do navegador (F12 →
ícone de celular) ou uma janela estreita para ver como fica num celular de
verdade.

Sem nenhuma configuração adicional, o jogo inteiro já funciona: motor do
2048, Gatekeeper matemático, HUD com recorde local, navegação entre telas
e ranking. Login/cadastro/ranking real via Supabase são opcionais (ver
"Configurar Supabase (opcional)" abaixo) — sem isso, essas telas mostram um
aviso amigável em vez de travar o app.

## Fluxo de telas

O app segue a ordem de telas definida no design ("Arcade Neo-Brutalism",
ver `docs/design-system.md`):

1. **Login / Boas-vindas** — primeira tela, sempre, toda vez que o app é
   aberto, sem navegação inferior. Entrar, criar conta, ou
   **"Jogar sem conta"** para pular direto para a Home.
2. **Home** — banner do jogo, card do Modo Clássico com o recorde atual, e
   a navegação inferior (Jogar / Ranking / Perfil) passa a ficar visível.
3. **Jogar** — o tabuleiro 4x4, com Pontos/Recorde reais e botão "Voltar"
   para a Home sem perder a partida (ela continua salva).
4. **Ranking** e **Perfil** — abas reais da navegação inferior (não são
   mais modais por cima do jogo).

Ao atingir os blocos 16/64/256/1024, o tabuleiro trava e o Gatekeeper exibe
uma equação de 1º grau real (ex.: `2x + 4 = 10`) com teclado numérico e
dica — resolvida corretamente, o bloco se funde e o jogo destrava.

## Status por milestone

**M1 — Motor do jogo:** completo. Tabuleiro 4x4, movimento/merge nas 4
direções, geração de blocos, vitória (2048) e modo infinito, game over,
persistência local da partida (`www/js/storage/localSession.js`).

**M2 — Gatekeeper matemático:** completo. Banco de 20 equações reais de
1º grau (5 por bloco gatilho, dificuldade crescente) com dica em
`www/data/equations.json`, validação e modal em
`www/js/gatekeeper/`, `www/js/ui/modals/equationModal.js`.

**M3 — Supabase (auth, score, leaderboard):** completo, opcional em tempo
de execução. Cliente e fluxo de auth em `www/js/auth/`, envio de score e
ranking Top 10 em `www/js/ranking/`. Sem `supabaseConfig.js`, essas telas
degradam para uma mensagem amigável em vez de quebrar.

**M4 — Build Android, responsividade, i18n, CI:** ver seção "Cordova"
abaixo e "Limitações conhecidas".

**Redesign de UI (Arcade Neo-Brutalism):** todas as telas (Login, Home,
Jogar, Gatekeeper, Fim de Jogo, Vitória, Ranking, Perfil) foram alinhadas a
esse sistema de design — cores, tipografia e navegação real por abas em
vez de modais empilhados. 100% local (fontes do sistema, sem CDN). Ver
`docs/design-system.md` para a especificação completa (cores, tipografia,
bordas/sombras, componentes).

## Configurar Supabase (opcional)

```bash
cp www/js/config/supabaseConfig.example.js www/js/config/supabaseConfig.js
# edite supabaseConfig.js com a URL e a anon key do projeto Supabase
```

O schema esperado (tabela `scores`, RLS) está em `docs/supabase-schema.sql`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm start` | Builda e sobe o app localmente (`http://127.0.0.1:5173`) — use este para testar |
| `npm test` | Roda os testes (Jest) — unitários + integração |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npm run lint` | ESLint sobre `www/js/**` |
| `npm run build:web` | Bundle de desenvolvimento (não minificado) |
| `npm run build:web:prod` | Bundle de produção minificado (usado na CI) |
| `npm run watch:web` | Build em modo watch (rebuilda a cada mudança) |

**Testes:** 87 testes (unitários + integração), todos passando; lint sem
erros.

## Cordova (build Android)

```bash
npm install -g cordova
cordova platform add android
cordova build android
```

> Antes de gerar um build de produção/assinado, adicione ícones e splash
> reais em `res/` — ver `res/README.md`. O build acima só foi validado
> estruturalmente (XML do `config.xml`); rodar de fato requer Android
> SDK/Gradle instalados no ambiente (ver "Limitações conhecidas").

## Estrutura

```
www/
  index.html
  css/            base (design system), board, modals, responsive
  data/           equations.json (banco de equações de 1º grau + dicas)
  js/
    core/         board, moves, merge, gameState (motor puro, sem DOM)
    gatekeeper/    equationBank, validator (desafio matemático, sem DOM)
    auth/         supabaseClient, signup, login, session
    ranking/      scoreService, leaderboardQuery
    config/       supabaseConfig.js (gitignored) + .example (template)
    i18n/         i18n.js (dicionário de strings + helper t())
    ui/
      navigation.js       roteador entre telas (Login/Home/Board/Ranking/Perfil)
      boardRenderer.js    desenho do tabuleiro
      hud.js              placar/recorde/estado congelado
      modals/             equationModal, gameOverModal, winModal
      screens/             authScreen, leaderboardScreen
    input/        keyboard, swipe
    storage/      localSession, highScore (persistência local)
    main.js       entrypoint (empacotado via esbuild)
  dist/           bundle.js gerado (não versionado)
res/              ícones/splash do Android (ver res/README.md — vazio por ora)
docs/             supabase-schema.sql, load-testing.md, specs (TDD/WDD/GDD),
                  design-system.md (sistema de design Arcade Neo-Brutalism)
tests/
  unit/           motor, gatekeeper, i18n, storage (highScore, localSession)
  integration/    auth, ranking e carga/estresse (mock do Supabase)
```

## CI

`.github/workflows/ci.yml` roda lint, testes e o build de produção a cada
push/PR em `main`/`develop`, com um limite de tamanho de bundle (1.5MB).

## Limitações conhecidas (registradas para transparência)

- **Ícones e splash screen do Android**: `config.xml` não referencia nenhum
  PNG (evita quebrar o build); os assets reais ainda não foram fornecidos.
  Ver `res/README.md` para o que falta antes de gerar um build assinado.
- **Build Android real não foi executado**: este ambiente de desenvolvimento
  não tem Android SDK/Gradle instalado, então só foi possível validar que
  `config.xml` é XML válido e consistente — o build real
  (`cordova build android`) precisa ser rodado numa máquina com o SDK
  instalado (ou CI com esse setup).
- **Testes de carga do Supabase são simulados**: sem acesso de rede real ao
  domínio `supabase.co` neste ambiente, a carga foi simulada sobre um
  cliente mockado (valida a camada de serviço, não a latência real do
  banco). Ver `docs/load-testing.md`.
- **Sem rodada de beta real**: ainda não há feedback de usuários externos
  reais — apenas autorrevisão do código.
- **Gatekeeper — trigger duplo na mesma jogada**: se uma única jogada
  formar dois blocos-gatilho simultaneamente (ex.: 16 e 64 no mesmo swipe),
  só o primeiro dispara um desafio; não há fila para o segundo. Caso raro
  na prática, documentado em `www/js/core/gameState.js`.

## Checklist de entrega (N1 — M1 + M2, 35% do jogo)

- [x] Motor do jogo funcional e testado (M1)
- [x] Gatekeeper matemático com equações de 1º grau reais, conectado aos 4
      blocos gatilho (M2)
- [x] Navegação real entre telas (Login → Home → Jogar/Ranking/Perfil)
- [x] Recorde persistido localmente e exibido no HUD
- [x] Auth + ranking funcionando contra um projeto Supabase real, com RLS
      (M3 — opcional em tempo de execução)
- [x] Responsividade revisada (mobile-first, pequenas telas, paisagem)
- [x] Estrutura i18n-ready
- [x] CI com lint + testes + build
- [x] 87 testes automatizados, todos passando; lint limpo
- [x] Código versionado e disponível no GitHub
- [ ] Ícones/splash e build Android real (pendente Android SDK — ver
      "Limitações conhecidas")
- [ ] Rodada de beta com usuários reais (pendente)
