/**
 * Atualiza o HUD para refletir o estado congelado do tabuleiro durante um
 * desafio do gatekeeper (M2-05: "novo jogo" continua liberado, mas o board
 * fica bloqueado — ver gameState status 'challenge').
 */

const FROZEN_CLASS = 'hud--frozen';

/**
 * @param {HTMLElement} hudEl
 * @param {boolean} frozen
 */
function setHudFrozen(hudEl, frozen) {
  hudEl.classList.toggle(FROZEN_CLASS, frozen);
}

/**
 * Mostra o usuário autenticado no HUD (usado futuramente pelo M3 — auth).
 * @param {HTMLElement} hudUserEl
 * @param {string|null} userLabel
 */
function renderHudUser(hudUserEl, userLabel) {
  if (!userLabel) {
    hudUserEl.hidden = true;
    hudUserEl.textContent = '';
    return;
  }
  hudUserEl.hidden = false;
  hudUserEl.textContent = userLabel;
}

/**
 * Atualiza o valor de Recorde exibido no HUD, ao lado de Pontos (mockup
 * da tela principal do GDD/WDD).
 * @param {HTMLElement} recordEl
 * @param {number} record
 */
function renderHudRecord(recordEl, record) {
  recordEl.textContent = String(record);
}

/**
 * Renderiza o progresso visual de fases/portais no HUD do jogo (16, 64, 256, 1024, 2048).
 * Atende ao critério de 'Progressão entre fases' da N2.
 * @param {HTMLElement} phasesContainerEl
 * @param {number[][]} board
 */
function renderHudPhases(phasesContainerEl, board) {
  if (!phasesContainerEl) return;

  let maxTile = 0;
  if (Array.isArray(board)) {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] > maxTile) maxTile = board[r][c];
      }
    }
  }

  const milestones = [
    { label: 'Fase 1', target: 16, icon: '🔓' },
    { label: 'Fase 2', target: 64, icon: '⚡' },
    { label: 'Fase 3', target: 256, icon: '🔮' },
    { label: 'Fase 4', target: 1024, icon: '🔥' },
    { label: 'Vitória', target: 2048, icon: '🏆' }
  ];

  phasesContainerEl.innerHTML = milestones.map((m) => {
    const isDone = maxTile >= m.target;
    const statusClass = isDone ? 'phase-node--done' : 'phase-node--pending';
    return `
      <div class="phase-node ${statusClass}" title="${m.label} (Bloco ${m.target})">
        <span class="phase-node__icon">${isDone ? '✅' : m.icon}</span>
        <span class="phase-node__target">${m.target}</span>
      </div>
    `;
  }).join('<span class="phase-connector">➔</span>');
}

module.exports = {
  FROZEN_CLASS,
  setHudFrozen,
  renderHudUser,
  renderHudRecord,
  renderHudPhases
};
