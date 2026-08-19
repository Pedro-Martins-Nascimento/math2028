/**
 * Modal de game over. Exibido quando gameState detecta que não há mais
 * movimentos válidos possíveis.
 */

const { t } = require('../../i18n/i18n');

function renderGameOverModal(modalEl, { score, onRestart }) {
  modalEl.innerHTML = `
    <div class="modal__card">
      <h2 class="modal__title">${t('gameOver.title')}</h2>
      <p class="modal__text">${t('gameOver.text')} <strong>${score}</strong></p>
      <div class="modal__actions">
        <button id="game-over-restart" class="btn btn--secondary">${t('gameOver.btnRestart')}</button>
      </div>
    </div>
  `;
  modalEl.hidden = false;

  modalEl.querySelector('#game-over-restart').addEventListener('click', () => {
    modalEl.hidden = true;
    onRestart();
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
