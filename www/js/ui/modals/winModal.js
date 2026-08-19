/**
 * Modal de vitória (bloco 2048 atingido). Oferece continuar em modo
 * infinito ou encerrar a partida.
 */

const { t } = require('../../i18n/i18n');

function renderWinModal(modalEl, { score, onContinue, onStop }) {
  modalEl.innerHTML = `
    <div class="modal__card">
      <h2 class="modal__title">${t('win.title')}</h2>
      <p class="modal__text">${t('win.text')} <strong>${score}</strong></p>
      <div class="modal__actions">
        <button id="win-continue" class="btn btn--secondary">${t('win.btnContinue')}</button>
        <button id="win-stop" class="btn btn--secondary">${t('win.btnStop')}</button>
      </div>
    </div>
  `;
  modalEl.hidden = false;

  modalEl.querySelector('#win-continue').addEventListener('click', () => {
    modalEl.hidden = true;
    onContinue();
  });

  modalEl.querySelector('#win-stop').addEventListener('click', () => {
    modalEl.hidden = true;
    onStop();
  });
}

/**
 * Esconde o modal de vitória.
 * @param {HTMLElement} modalEl
 */
function hideWinModal(modalEl) {
  modalEl.hidden = true;
}

module.exports = { renderWinModal, hideWinModal };
