/**
 * Ponto de entrada do jogo. Conecta gameState ao input (teclado/swipe), à
 * renderização (boardRenderer + modais), à navegação entre telas, ao
 * gatekeeper matemático e à autenticação/ranking via Supabase (M3).
 * Empacotado com esbuild para `www/dist/bundle.js` (ver `npm run build:web`).
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
const { createScreenRouter } = require('./ui/navigation');
const { saveSession, loadSession, clearSession } = require('./storage/localSession');
const { getHighScore, updateHighScore } = require('./storage/highScore');
const { renderAuthScreen } = require('./ui/screens/authScreen');
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
  const boardHudEl = document.getElementById('board-hud');
  const scoreEl = document.getElementById('score-value');
  const recordEl = document.getElementById('record-value');
  const homeRecordEl = document.getElementById('home-record-value');
  const homePlayBtn = document.getElementById('home-play-btn');
  const backToHomeBtn = document.getElementById('back-to-home-btn');
  const hudUserEl = document.getElementById('hud-user');
  const newGameBtn = document.getElementById('new-game-btn');
  const gameOverModalEl = document.getElementById('game-over-modal');
  const winModalEl = document.getElementById('win-modal');
  const equationModalEl = document.getElementById('equation-modal');

  const screens = {
    login: document.getElementById('screen-login'),
    home: document.getElementById('screen-home'),
    board: document.getElementById('screen-board'),
    ranking: document.getElementById('screen-ranking'),
    perfil: document.getElementById('screen-perfil')
  };
  const bottomNavEl = document.getElementById('bottom-nav');
  const navButtons = Array.from(document.querySelectorAll('.bottom-nav__item'));
  const router = createScreenRouter(screens, navButtons);

  let state = loadSession() || createInitialState();
  let currentUser = null;
  // Se a sessão restaurada já estava em 'gameOver', consideramos que o
  // envio (se aplicável) já foi tentado antes do reload — evita reenviar
  // a mesma pontuação ao Supabase a cada recarregamento da página.
  let scoreSubmittedForThisGame = state.status === 'gameOver';
  let scoreSubmitInFlight = false;

  function updateAuthUi() {
    renderHudUser(hudUserEl, currentUser ? currentUser.email : null);
  }

  function renderPerfilScreen() {
    if (currentUser) {
      screens.perfil.innerHTML = `
        <div class="modal__card">
          <h2 class="modal__title">👤 ${t('nav.account')}</h2>
          <p id="perfil-email" class="modal__text"></p>
          <button id="perfil-logout" class="btn btn--pink" style="width:100%;">${t('hud.btnLogout')}</button>
        </div>
      `;
      screens.perfil.querySelector('#perfil-email').textContent = currentUser.email;
      screens.perfil.querySelector('#perfil-logout').addEventListener('click', async () => {
        await logout();
        currentUser = null;
        updateAuthUi();
        renderPerfilScreen();
      });
    } else {
      renderAuthScreen(screens.perfil, {
        onAuthenticated: (user) => {
          currentUser = user;
          updateAuthUi();
          renderPerfilScreen();
        }
      });
    }
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
    const previousRecord = getHighScore();
    const record = updateHighScore(state.score);
    const isNewRecord = state.score > previousRecord;

    renderBoard(boardEl, state.board);
    renderScore(scoreEl, state.score);
    renderHudRecord(recordEl, record);
    renderHudRecord(homeRecordEl, record);
    homePlayBtn.querySelector('[data-i18n]').textContent = state.score > 0 ? t('home.btnContinue') : t('home.btnPlay');
    setHudFrozen(boardHudEl, state.status === 'challenge');
    saveSession(state);

    if (state.status === 'gameOver') {
      hideEquationModal(equationModalEl);
      maybeSubmitScore();
      renderGameOverModal(gameOverModalEl, {
        score: state.score,
        record,
        equationsSolved: state.equationsSolved || 0,
        onRestart: restart,
        onViewRanking: () => {
          hideGameOverModal(gameOverModalEl);
          router.show('ranking');
          renderRankingScreen();
        }
      });
    } else if (state.status === 'won') {
      hideEquationModal(equationModalEl);
      renderWinModal(winModalEl, {
        score: state.score,
        equationsSolved: state.equationsSolved || 0,
        isNewRecord,
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
    router.show('board', 'home');
  }

  function renderRankingScreen() {
    renderLeaderboardScreen(screens.ranking);
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

  homePlayBtn.addEventListener('click', () => {
    router.show('board', 'home');
    // O tabuleiro pode ter sido desenhado pela última vez enquanto a tela
    // "board" ainda estava escondida (clientWidth 0, ver getCellSize em
    // boardRenderer.js) — redesenha agora que o container tem layout real,
    // senão os blocos ficam com posição/tamanho quebrados até a próxima
    // jogada.
    renderBoard(boardEl, state.board);
  });
  backToHomeBtn.addEventListener('click', () => router.show('home'));

  document.getElementById('nav-ranking').addEventListener('click', renderRankingScreen);
  document.getElementById('nav-perfil').addEventListener('click', renderPerfilScreen);

  /**
   * Sai da tela de login/boas-vindas (a primeira coisa que o jogador vê,
   * toda vez que o app é aberto) para a Home, liberando a navegação
   * inferior. Chamado tanto ao entrar ou se cadastrar quanto ao escolher
   * "jogar sem conta".
   * @param {object|null} user
   */
  function enterApp(user) {
    currentUser = user;
    updateAuthUi();
    bottomNavEl.hidden = false;
    router.show('home');
    // Só desenha o jogo (tabuleiro e possíveis modais de desafio/fim de
    // jogo de uma sessão salva) depois que o jogador realmente entra no
    // app — sem isso, um desafio do gatekeeper salvo no meio de uma
    // partida anterior aparecia por cima da própria tela de login.
    render();
  }

  router.show('login');
  renderAuthScreen(screens.login, {
    onAuthenticated: enterApp,
    onSkip: () => enterApp(null)
  });

  getCurrentUser().then((user) => {
    currentUser = user;
    updateAuthUi();
  });

  applyStaticI18n();
}

document.addEventListener('DOMContentLoaded', initGame);

module.exports = { initGame };
