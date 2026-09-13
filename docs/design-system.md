# Math2048 — Sistema de Design "Arcade Neo-Brutalism"

> Este documento arquiva o sistema de design implementado atualmente na UI
> do jogo. Ele nasceu de telas de referência geradas com o Google Stitch
> (pasta `screens/stitch_math2048_login/`, removida do repositório depois
> de o design ter sido aplicado no código — ver `www/css/base.css`,
> `board.css`, `modals.css`). Este arquivo existe para que a identidade
> visual não se perca com a remoção daquela pasta, e substitui a descrição
> de estilo visual antiga do WDD (ver `math2048-wdd.md`, seção 8, que
> aponta pra cá).

## Conceito

Arcade Neo-Brutalism une a energia tátil de fliperamas retrô dos anos 90
com o neo-brutalismo moderno: fundo roxo escuro e cósmico, cores neon de
alta saturação, bordas pretas grossas (2px–4px) e sombras duras com
deslocamento (sem blur), como se cada elemento fosse uma peça física de
plástico empilhada sobre a tela.

## Cores

Implementadas como variáveis CSS em `www/css/base.css` (`:root`):

| Token | Hex | Uso |
|---|---|---|
| `--color-bg` | `#150f28` | Fundo geral do app |
| `--color-surface-card` | `#251842` | Cards, cabeçalho, telas |
| `--color-surface-banner` | `#381f68` | Banner de destaque na Home |
| `--color-board-bg` | `#251545` | Fundo do tabuleiro |
| `--color-slot-recessed` | `#1a0c33` | Células vazias / campos recessos |
| `--color-yellow` (arcade-yellow) | `#ffe600` | Cor primária — CTAs, destaque, blocos altos |
| `--color-pink` (arcade-pink) | `#ff3385` | Recorde, alertas, blocos médios |
| `--color-cyan` (arcade-cyan) | `#00f0ff` | Ações principais (Jogar, Confirmar) |
| `--color-green` (arcade-green) | `#39ff88` | Sucesso / confirmação |
| `--color-orange` (arcade-orange) | `#ff7a00` | Acentos quentes |
| `--color-purple` (arcade-purple) | `#8a3ffc` | Modo infinito / blocos além de 8192 |

Blocos do tabuleiro (progressão por valor, ver `board.css`):
- **Baixos (2, 4, 8):** pastel pop — menta `#a8ffd6`, limão `#fff490`, pêssego `#ffb37c`.
- **Médios (16, 32, 64):** vermelho arcade de alta voltagem `#ff3366`, texto branco.
- **Altos (128, 256, 512, 1024):** dourado/âmbar `#ffe600` → `#ff9f00`, com brilho (`box-shadow`) crescente.
- **2048:** dourado claro com borda e glow mais fortes — o bloco lendário.
- **Modo infinito (4096+):** roxo `#8a3ffc`/`#1b1d3a` — um "universo" à parte.

Todas as cores de texto foram escolhidas visando contraste adequado
(RNF-09) sobre cada fundo.

## Tipografia

- **Títulos/números (headline):** fonte bold arredondada — no design de
  referência, "Fredoka"; implementado com fallback de sistema
  (`'Baloo 2', 'Segoe UI Rounded', 'Arial Rounded MT Bold', sans-serif`)
  para manter o app 100% local, sem depender de fontes via CDN.
- **Corpo de texto:** fonte de sistema padrão (`Segoe UI`, `Roboto`, etc.).
- Textos de destaque em maiúsculas, com `letter-spacing` levemente
  aumentado, imitando etiquetas de fliperama.

## Bordas e sombras (o "neo" do neo-brutalismo)

- Bordas sempre pretas sólidas (`--border-color: #000000`), 2px–4px.
- Sombras duras, sem blur, deslocadas:
  - `--shadow-sm`: `2px 2px 0 #000`
  - `--shadow-md`: `4px 4px 0 #000`
  - `--shadow-lg`: `6px 6px 0 #000`
- Estado `:active` de botões "afunda" o elemento (`translate(3px, 3px)` +
  sombra reduzida a `1px 1px 0 #000`), simulando um botão físico sendo
  pressionado.
- Cantos arredondados (`12px`–`16px`) equilibram a rigidez das bordas
  pretas com a leveza pop do estilo.

## Componentes de referência

- **`.neo-card`** — card padrão (fundo, borda, sombra, raio).
- **`.btn` + modificadores** (`--yellow`, `--cyan`, `--pink`, `--green`,
  `--lavender`, `--ghost`) — botões neo-brutalistas com feedback tátil.
- **`.pill`** — badges/etiquetas em cápsula.
- **`.bottom-nav`** — navegação inferior fixa, item ativo destacado em
  amarelo com borda preta.
- **`.modal__equation-banner` / `.modal__keypad`** — banner de equação e
  teclado numérico tátil do desafio do Gatekeeper.
- **`.result-card` / `.result-badge`** — cards de resultado das telas de
  Fim de Jogo e Vitória.

## Por que isso substitui a paleta original do WDD

A seção 8 do WDD original descrevia uma direção "Flat Design" minimalista
com paleta pastel→dourada suave. Essa paleta foi implementada em uma
primeira passada, mas depois foi substituída por este sistema Arcade
Neo-Brutalism a pedido do responsável pelo projeto, com base em telas de
referência (Stitch) que definem a identidade visual atual do jogo. O WDD
foi atualizado para refletir isso — ver nota na seção 8 daquele documento.
