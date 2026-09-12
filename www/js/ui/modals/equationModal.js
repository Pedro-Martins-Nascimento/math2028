/**
 * Modal do desafio matemático (gatekeeper). Exibe a equação do bloco
 * gatilho atual, valida a resposta e chama os callbacks conforme o
 * resultado. O tabuleiro permanece congelado enquanto este modal está
 * visível (ver gameState: status 'challenge').
 */

const { validateAnswer } = require('../../gatekeeper/validator');
const { t } = require('../../i18n/i18n');

/**
 * Renderiza o modal de desafio para uma equação específica.
 * @param {HTMLElement} modalEl
 * @param {object} params
 * @param {{id:string, question:string, answer:number}} params.equation
 * @param {number} params.trigger - bloco que disparou o desafio (16/64/256/1024).
 * @param {() => void} params.onCorrect
 * @param {() => void} params.onIncorrect
 */
function renderEquationModal(modalEl, { equation, trigger, onCorrect, onIncorrect }) {
  modalEl.innerHTML = `
    <div class="modal__card modal__card--gatekeeper">
      <h2 class="modal__title">${t('equation.title')}</h2>
      <p class="modal__subtitle">${t('equation.subtitlePrefix')} ${trigger} ${t('equation.subtitleSuffix')}</p>
      <p class="modal__equation">${equation.question}</p>
      <label class="modal__input-label" for="equation-answer-input">${t('equation.inputLabel')}</label>
      <input
        id="equation-answer-input"
        class="modal__input"
        type="text"
        inputmode="numeric"
        autocomplete="off"
      />
      <p id="equation-error" class="modal__error" role="alert"></p>
      <div class="modal__actions">
        <button id="equation-submit" class="btn btn--secondary">${t('equation.btnSubmit')}</button>
      </div>
      <p class="modal__warning">${t('equation.warning')}</p>
    </div>
  `;
  modalEl.hidden = false;

  const inputEl = modalEl.querySelector('#equation-answer-input');
  const errorEl = modalEl.querySelector('#equation-error');
  const submitEl = modalEl.querySelector('#equation-submit');

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

  inputEl.focus();
}

function hideEquationModal(modalEl) {
  modalEl.hidden = true;
}

module.exports = { renderEquationModal, hideEquationModal };
