/**
 * Modal de game over. Exibido quando gameState detecta que não há mais
 * movimentos válidos possíveis.
 */

const { t } = require('../../i18n/i18n');

/**
 * @param {HTMLElement} modalEl
 * @param {object} params
 * @param {number} params.score
 * @param {number} params.record
 * @param {number} params.equationsSolved
 * @param {() => void} params.onRestart
 * @param {() => void} params.onViewRanking
 */
function renderGameOverModal(modalEl, { score, record, equationsSolved, onRestart, onViewRanking }) {
  modalEl.innerHTML = `
    <div class="modal__card">
      <span class="result-badge result-badge--lost">${t('gameOver.badge')}</span>
      <h2 class="modal__title">${t('gameOver.title')}</h2>
      <p class="modal__text">${t('gameOver.text')}</p>
      <div class="result-card result-card--primary">
        <div>
          <span class="result-card__label">${t('gameOver.scoreLabel')}</span>
        </div>
        <span class="result-card__value">${score}</span>
      </div>
      <div class="result-grid">
        <div class="result-card result-card--yellow">
          <span class="result-card__label">${t('gameOver.recordLabel')}</span>
          <span class="result-card__value">${record}</span>
        </div>
        <div class="result-card result-card--mint">
          <span class="result-card__label">${t('gameOver.equationsLabel')}</span>
          <span class="result-card__value">${equationsSolved}</span>
        </div>
      </div>
      <div class="btn-row">
        <button id="game-over-restart" class="btn btn--cyan">${t('gameOver.btnRestart')}</button>
        <button id="game-over-ranking" class="btn btn--lavender">${t('gameOver.btnRanking')}</button>
      </div>
      <p class="modal__quote">${t('gameOver.quote')}</p>
    </div>
  `;
  modalEl.hidden = false;

  modalEl.querySelector('#game-over-restart').addEventListener('click', () => {
    modalEl.hidden = true;
    onRestart();
  });

  modalEl.querySelector('#game-over-ranking').addEventListener('click', () => {
    modalEl.hidden = true;
    onViewRanking();
  });
}

/**
 * Esconde o modal de game over (usado ao reiniciar/sair desse estado).
 * @param {HTMLElement} modalEl
 */
function hideGameOverModal(modalEl) {
  modalEl.hidden = true;
}

module.exports = { renderGameOverModal, hideGameOverModal };
