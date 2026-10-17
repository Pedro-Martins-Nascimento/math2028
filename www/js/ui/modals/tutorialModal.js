/**
 * Modal de Tutorial ("Como Jogar") para atender com excelência aos critérios da N2:
 * 1. Apresentação das regras e mecânicas (deslizar e fundir).
 * 2. Apresentação clara do objetivo final (alcançar o bloco 2048).
 * 3. Explicação do Gatekeeper Matemático (respostas corretas e incorretas).
 * 4. Apresentação da progressão de fases/portais (16 -> 64 -> 256 -> 1024 -> 2048).
 */

/**
 * Renderiza o modal de tutorial.
 * @param {HTMLElement} containerEl
 * @param {{ onClose: () => void }} handlers
 */
function renderTutorialModal(containerEl, { onClose }) {
  containerEl.innerHTML = `
    <div class="modal__card tutorial-modal__card" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <div class="modal__badge">📖 GUIA OFICIAL</div>
      <h2 id="tutorial-title" class="modal__title" style="color:var(--color-yellow);">Como Jogar</h2>
      
      <div class="tutorial-content">
        <div class="tutorial-step">
          <div class="tutorial-step__icon">🎯</div>
          <div class="tutorial-step__info">
            <h4 class="tutorial-step__title">1. Objetivo do Jogo</h4>
            <p class="tutorial-step__text">Combine números iguais para dobrar seus valores e alcançar o lendário <strong>bloco 2048</strong> sem encher a grade 4x4!</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="tutorial-step__icon">🕹️</div>
          <div class="tutorial-step__info">
            <h4 class="tutorial-step__title">2. Movimento & Fusão</h4>
            <p class="tutorial-step__text">Use as <strong>setas do teclado</strong> no PC ou <strong>deslize o dedo (swipe)</strong> no celular. Blocos iguais que colidem se fundem: <code>2+2=4</code>, <code>4+4=8</code>...</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="tutorial-step__icon">⚡</div>
          <div class="tutorial-step__info">
            <h4 class="tutorial-step__title">3. O Gatekeeper (Portais)</h4>
            <p class="tutorial-step__text">Ao atingir <strong>16, 64, 256 e 1024</strong>, o tabuleiro <strong>trava</strong>! Você deve resolver a equação de 1º grau para destravar o jogo:</p>
            <div class="tutorial-chips">
              <span class="chip chip--correct">✅ Resposta Certa: Destrava o jogo</span>
              <span class="chip chip--wrong">❌ Resposta Errada: Mantém bloqueado</span>
            </div>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="tutorial-step__icon">🚀</div>
          <div class="tutorial-step__info">
            <h4 class="tutorial-step__title">4. Progressão de Fases</h4>
            <p class="tutorial-step__text">Avance pelos 4 Portais de Dificuldade crescente até a vitória:</p>
            <div class="tutorial-phases">
              <span class="phase-pill">Fase 1 (16)</span> ➔
              <span class="phase-pill">Fase 2 (64)</span> ➔
              <span class="phase-pill">Fase 3 (256)</span> ➔
              <span class="phase-pill">Fase 4 (1024)</span> ➔
              <span class="phase-pill phase-pill--win">2048 🏆</span>
            </div>
          </div>
        </div>
      </div>

      <button id="tutorial-close-btn" class="btn btn--cyan" style="width:100%;margin-top:16px;">
        Entendido! Vamos Jogar ▶
      </button>
    </div>
  `;

  containerEl.hidden = false;

  const closeBtn = containerEl.querySelector('#tutorial-close-btn');
  closeBtn.addEventListener('click', () => {
    hideTutorialModal(containerEl);
    if (typeof onClose === 'function') onClose();
  });
}

function hideTutorialModal(containerEl) {
  containerEl.hidden = true;
  containerEl.innerHTML = '';
}

module.exports = {
  renderTutorialModal,
  hideTutorialModal
};
