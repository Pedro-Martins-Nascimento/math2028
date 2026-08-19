/**
 * Tela do ranking global (Top 10). Busca dados via leaderboardQuery e
 * apenas renderiza — nenhuma lógica de rede aqui.
 */

const { getTopScores } = require('../../ranking/leaderboardQuery');
const { t } = require('../../i18n/i18n');

/**
 * Renderiza a tela de leaderboard dentro do elemento fornecido.
 * @param {HTMLElement} screenEl
 * @param {object} params
 * @param {() => void} params.onClose
 */
async function renderLeaderboardScreen(screenEl, { onClose }) {
  screenEl.innerHTML = `
    <div class="modal__card">
      <h2 class="modal__title">${t('leaderboard.title')}</h2>
      <div id="leaderboard-list" class="modal__text">${t('leaderboard.loading')}</div>
      <div class="modal__actions">
        <button id="leaderboard-close" class="btn btn--secondary">${t('leaderboard.btnClose')}</button>
      </div>
    </div>
  `;
  screenEl.hidden = false;
  screenEl.querySelector('#leaderboard-close').addEventListener('click', () => {
    screenEl.hidden = true;
    onClose();
  });

  const listEl = screenEl.querySelector('#leaderboard-list');
  const { entries, error } = await getTopScores();

  if (error) {
    listEl.textContent = error;
    return;
  }

  if (entries.length === 0) {
    listEl.textContent = t('leaderboard.empty');
    return;
  }

  listEl.innerHTML = `
    <ol style="text-align:left; padding-left: 20px; margin: 0;">
      ${entries.map((entry) => `<li>${entry.username} — ${entry.score}</li>`).join('')}
    </ol>
  `;
}

function hideLeaderboardScreen(screenEl) {
  screenEl.hidden = true;
}

module.exports = { renderLeaderboardScreen, hideLeaderboardScreen };
