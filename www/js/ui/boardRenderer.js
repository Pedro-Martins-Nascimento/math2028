/**
 * Renderiza o estado do tabuleiro no DOM.
 * Usa requestAnimationFrame + CSS transform para manter animações fluidas
 * (RNF-02: 60 FPS estáveis).
 */

const CELL_GAP = 10;
const CELL_PADDING = 10;

function getCellSize(boardEl) {
  const size = boardEl.clientWidth;
  return (size - CELL_PADDING * 2 - CELL_GAP * 3) / 4;
}

function ensureBackgroundCells(boardEl) {
  if (boardEl.dataset.initialized === 'true') return;
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    boardEl.appendChild(cell);
  }
  boardEl.dataset.initialized = 'true';
}

/**
 * Renderiza o tabuleiro dentro do elemento fornecido.
 * @param {HTMLElement} boardEl - container do tabuleiro (#board).
 * @param {number[][]} board - matriz 4x4 de valores.
 */
function renderBoard(boardEl, board) {
  ensureBackgroundCells(boardEl);

  requestAnimationFrame(() => {
    const cellSize = getCellSize(boardEl);

    // Remove tiles antigos antes de redesenhar (abordagem simples e correta;
    // otimizações de diffing podem vir depois sem mudar a API pública).
    boardEl.querySelectorAll('.tile').forEach((tile) => tile.remove());

    board.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value === 0) return;

        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.value = String(value);
        tile.textContent = String(value);
        tile.style.width = `${cellSize}px`;
        tile.style.height = `${cellSize}px`;

        const x = CELL_PADDING + c * (cellSize + CELL_GAP);
        const y = CELL_PADDING + r * (cellSize + CELL_GAP);
        tile.style.transform = `translate(${x}px, ${y}px)`;

        boardEl.appendChild(tile);
      });
    });
  });
}

/**
 * Atualiza o placar exibido no HUD.
 * @param {HTMLElement} scoreEl
 * @param {number} score
 */
function renderScore(scoreEl, score) {
  scoreEl.textContent = String(score);
}

module.exports = {
  renderBoard,
  renderScore,
  getCellSize
};
