/**
 * Modal do desafio matemático (gatekeeper). Exibe a equação do bloco
 * gatilho atual, valida a resposta e chama os callbacks conforme o
 * resultado. O tabuleiro permanece congelado enquanto este modal está
 * visível (ver gameState: status 'challenge').
 */

const { validateAnswer } = require('../../gatekeeper/validator');
const { t } = require('../../i18n/i18n');

const KEYPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const MAX_ANSWER_LENGTH = 4;

/**
 * Renderiza o modal de desafio para uma equação específica.
 * @param {HTMLElement} modalEl
 * @param {object} params
 * @param {{id:string, question:string, answer:number, hint?:string}} params.equation
 * @param {number} params.trigger - bloco que disparou o desafio (16/64/256/1024).
 * @param {() => void} params.onCorrect
 * @param {() => void} params.onIncorrect
 */
function renderEquationModal(modalEl, { equation, trigger, onCorrect, onIncorrect }) {
  modalEl.innerHTML = `
    <div class="modal__card modal__card--gatekeeper">
      <div class="modal__pill-row">
        <span class="pill pill--yellow">${t('equation.badge')}</span>
        <span class="pill pill--dark">${t('equation.xpBadge')} ${trigger}</span>
      </div>
      <h2 class="modal__title">${t('equation.title')}</h2>
      <p class="modal__subtitle">${t('equation.subtitlePrefix')} ${trigger} ${t('equation.subtitleSuffix')}</p>
      <div class="modal__equation-banner">
        <span class="modal__equation-tag">${t('equation.equationTag')}</span>
        <p class="modal__equation">${equation.question}</p>
      </div>
      <div class="modal__input-row">
        <label class="modal__input-label" for="equation-answer-input">${t('equation.inputLabel')} <span>x</span> =</label>
        <input
          id="equation-answer-input"
          class="modal__input"
          type="text"
          inputmode="numeric"
          autocomplete="off"
        />
      </div>
      <div class="modal__keypad" role="group" aria-label="${t('equation.inputLabel')} x">
        ${KEYPAD_KEYS.map((digit) => `<button type="button" class="modal__keypad-key" data-digit="${digit}">${digit}</button>`).join('')}
        <button type="button" class="modal__keypad-key modal__keypad-key--clear" id="equation-clear">✕</button>
      </div>
      <p id="equation-error" class="modal__error" role="alert"></p>
      <div class="modal__actions">
        <button id="equation-submit" class="btn btn--green" style="width:100%;">${t('equation.btnSubmit')}</button>
      </div>
      <p class="modal__warning">${t('equation.warning')}</p>
      ${equation.hint ? `<p class="modal__hint">💡 <strong>${t('equation.hintPrefix')}</strong> ${equation.hint}</p>` : ''}
    </div>
  `;
  modalEl.hidden = false;

  const inputEl = modalEl.querySelector('#equation-answer-input');
  const errorEl = modalEl.querySelector('#equation-error');
  const submitEl = modalEl.querySelector('#equation-submit');
  const clearEl = modalEl.querySelector('#equation-clear');

  function submit() {
    const isCorrect = validateAnswer(equation, inputEl.value);
    if (isCorrect) {
      errorEl.textContent = '';
      modalEl.hidden = true;
      onCorrect();
    } else {
      errorEl.textContent = t('equation.errorWrong');
      inputEl.value = '';
      inputEl.focus();
      onIncorrect();
    }
  }

  submitEl.addEventListener('click', submit);
  inputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') submit();
  });

  modalEl.querySelectorAll('.modal__keypad-key[data-digit]').forEach((key) => {
    key.addEventListener('click', () => {
      if (inputEl.value.length >= MAX_ANSWER_LENGTH) return;
      inputEl.value += key.dataset.digit;
      inputEl.focus();
    });
  });

  clearEl.addEventListener('click', () => {
    inputEl.value = '';
    inputEl.focus();
  });

  inputEl.focus();
}

function hideEquationModal(modalEl) {
  modalEl.hidden = true;
}

module.exports = { renderEquationModal, hideEquationModal };
