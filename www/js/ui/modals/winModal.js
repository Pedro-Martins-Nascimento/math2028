/**
 * Modal de vitória (bloco 2048 atingido). Oferece continuar em modo
 * infinito ou encerrar a partida.
 */

const { t } = require('../../i18n/i18n');

/**
 * @param {HTMLElement} modalEl
 * @param {object} params
 * @param {number} params.score
 * @param {number} params.equationsSolved
 * @param {boolean} params.isNewRecord
 * @param {() => void} params.onContinue
 * @param {() => void} params.onStop
 */
function renderWinModal(modalEl, { score, equationsSolved, isNewRecord, onContinue, onStop }) {
  modalEl.innerHTML = `
    <div class="modal__card">
      <span class="result-badge result-badge--won">${t('win.badge')}</span>
      <h2 class="modal__title">🏆 ${t('win.title')}</h2>
      <p class="modal__text">${t('win.text')}</p>
      <div class="result-card result-card--won">
        <div>
          <span class="result-card__label">${t('win.scoreLabel')}</span>
          <span class="result-card__value">${score}</span>
        </div>
        ${isNewRecord ? `<span class="result-card__new-badge">${t('win.newRecordBadge')}</span>` : ''}
      </div>
      <div class="result-card result-card--mint">
        <span class="result-card__label">${t('win.equationsLabel')}</span>
        <span class="result-card__value">${equationsSolved}</span>
      </div>
      <div class="btn-row" style="flex-direction:column;">
        <button id="win-continue" class="btn btn--yellow" style="width:100%;">${t('win.btnContinue')} 🔥</button>
        <button id="win-stop" class="btn btn--cyan" style="width:100%;">${t('win.btnStop')}</button>
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
