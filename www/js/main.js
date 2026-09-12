/**
 * Ponto de entrada do jogo. Conecta gameState ao input (teclado/swipe), à
 * renderização (boardRenderer + modais), ao gatekeeper matemático e à
 * autenticação/ranking via Supabase (M3). Empacotado com esbuild para
 * `www/dist/bundle.js` (ver `npm run build:web`).
 */

const { createInitialState, applyMove, resolveChallenge, continueInfinite } = require('./core/gameState');
const { getRandomEquationForTrigger } = require('./gatekeeper/equationBank');
const { attachKeyboardInput } = require('./input/keyboard');
const { attachSwipeInput } = require('./input/swipe');
const { renderBoard, renderScore } = require('./ui/boardRenderer');
const { renderGameOverModal, hideGameOverModal } = require('./ui/modals/gameOverModal');
const { renderWinModal, hideWinModal } = require('./ui/modals/winModal');
const { renderEquationModal, hideEquationModal } = require('./ui/modals/equationModal');
const { setHudFrozen, renderHudUser, renderHudRecord } = require('./ui/hud');
const { saveSession, loadSession, clearSession } = require('./storage/localSession');
const { updateHighScore } = require('./storage/highScore');
const { renderAuthScreen, hideAuthScreen } = require('./ui/screens/authScreen');
const { renderLeaderboardScreen } = require('./ui/screens/leaderboardScreen');
const { getCurrentUser, logout } = require('./auth/session');
const { submitScore } = require('./ranking/scoreService');
const { t } = require('./i18n/i18n');

/**
 * Aplica as traduções nos elementos estáticos marcados com [data-i18n]
 * (ver www/index.html). Textos gerados dinamicamente pelos modais/telas
 * já usam t() diretamente em seus próprios módulos.
 */
function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}

function initGame() {
  const boardEl = document.getElementById('board');
  const boardContainerEl = document.getElementById('board-container');
  const scoreEl = document.getElementById('score-value');
  const recordEl = document.getElementById('record-value');
  const hudEl = document.getElementById('hud');
  const hudUserEl = document.getElementById('hud-user');
  const newGameBtn = document.getElementById('new-game-btn');
  const authBtn = document.getElementById('auth-btn');
  const leaderboardBtn = document.getElementById('leaderboard-btn');
  const gameOverModalEl = document.getElementById('game-over-modal');
  const winModalEl = document.getElementById('win-modal');
  const equationModalEl = document.getElementById('equation-modal');
  const authScreenEl = document.getElementById('auth-screen');
  const leaderboardScreenEl = document.getElementById('leaderboard-screen');

  let state = loadSession() || createInitialState();
  let currentUser = null;
  // Se a sessão restaurada já estava em 'gameOver', consideramos que o
  // envio (se aplicável) já foi tentado antes do reload — evita reenviar
  // a mesma pontuação ao Supabase a cada recarregamento da página.
  let scoreSubmittedForThisGame = state.status === 'gameOver';
  let scoreSubmitInFlight = false;

  function updateAuthUi() {
    renderHudUser(hudUserEl, currentUser ? currentUser.email : null);
    authBtn.textContent = currentUser ? t('hud.btnLogout') : t('hud.btnLogin');
  }

  async function maybeSubmitScore() {
    if (!currentUser || scoreSubmittedForThisGame || scoreSubmitInFlight) return;
    scoreSubmitInFlight = true;
    // Envio assíncrono e não bloqueante (RNF-03): não impede a UI de
    // mostrar o modal de game over enquanto a rede responde.
    const { error } = await submitScore({
      userId: currentUser.id,
      username: currentUser.email,
      score: state.score
    });
    scoreSubmitInFlight = false;
    // Só marca como enviado em caso de sucesso — se falhar (ex.: rede
    // instável), uma futura chamada a render() nesta mesma partida pode
    // tentar reenviar em vez de desistir silenciosamente.
    if (!error) scoreSubmittedForThisGame = true;
  }

  function render() {
    renderBoard(boardEl, state.board);
    renderScore(scoreEl, state.score);
    renderHudRecord(recordEl, updateHighScore(state.score));
    setHudFrozen(hudEl, state.status === 'challenge');
    leaderboardBtn.disabled = state.status === 'challenge';
    authBtn.disabled = state.status === 'challenge';
    saveSession(state);

    if (state.status === 'gameOver') {
      hideEquationModal(equationModalEl);
      maybeSubmitScore();
      renderGameOverModal(gameOverModalEl, {
        score: state.score,
        onRestart: restart
      });
    } else if (state.status === 'won') {
      hideEquationModal(equationModalEl);
      renderWinModal(winModalEl, {
        score: state.score,
        onContinue: () => {
          state = continueInfinite(state);
          render();
        },
        onStop: restart
      });
    } else if (state.status === 'challenge') {
      hideGameOverModal(gameOverModalEl);
      hideWinModal(winModalEl);
      const equation = getRandomEquationForTrigger(state.pendingChallenge);
      renderEquationModal(equationModalEl, {
        equation,
        trigger: state.pendingChallenge,
        onCorrect: () => {
          state = resolveChallenge(state, true);
          render();
        },
        onIncorrect: () => {
          state = resolveChallenge(state, false);
        }
      });
    } else {
      hideGameOverModal(gameOverModalEl);
      hideWinModal(winModalEl);
      hideEquationModal(equationModalEl);
    }
  }

  function handleMove(direction) {
    if (state.status === 'gameOver' || state.status === 'challenge') return;
    state = applyMove(state, direction);
    render();
  }

  function restart() {
    clearSession();
    state = createInitialState();
    scoreSubmittedForThisGame = false;
    render();
  }

  attachKeyboardInput(handleMove);
  attachSwipeInput(boardContainerEl, handleMove);
  newGameBtn.addEventListener('click', restart);

  // Recalcula a posição dos blocos ao redimensionar/rotacionar (troca de
  // orientação no celular, mudança de janela no desktop). Sem isso, os
  // tiles ficam com a posição em px calculada para o tamanho antigo do
  // tabuleiro até a próxima jogada (M4-02/M4-03 — responsividade).
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => renderBoard(boardEl, state.board), 120);
  });

  authBtn.addEventListener('click', async () => {
    if (currentUser) {
      await logout();
      currentUser = null;
      updateAuthUi();
      return;
    }

    renderAuthScreen(authScreenEl, {
      onAuthenticated: (user) => {
        currentUser = user;
        updateAuthUi();
        hideAuthScreen(authScreenEl);
      },
      onSkip: () => hideAuthScreen(authScreenEl)
    });
  });

  leaderboardBtn.addEventListener('click', () => {
    renderLeaderboardScreen(leaderboardScreenEl, {
      onClose: () => {}
    });
  });

  getCurrentUser().then((user) => {
    currentUser = user;
    updateAuthUi();
  });

  applyStaticI18n();
  render();
}

document.addEventListener('DOMContentLoaded', initGame);

module.exports = { initGame };
