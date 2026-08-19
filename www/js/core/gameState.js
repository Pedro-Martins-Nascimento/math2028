/**
 * Controla o estado geral da partida: geração de novos blocos após jogada
 * válida, detecção de vitória (2048) e derrota, e o modo infinito pós-2048.
 */

const { getEmptyCells, createEmptyBoard, cloneBoard } = require('./board');
const { move, hasValidMove } = require('./moves');
const { isTriggerBlock } = require('../gatekeeper/equationBank');

const WIN_VALUE = 2048;

// Valor 2 tem 90% de chance, valor 4 tem 10% — regra clássica do 2048.
function randomTileValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

/**
 * Cria um novo estado de jogo, já com dois blocos iniciais.
 * @returns {object} estado inicial da partida.
 */
function createInitialState() {
  let board = createEmptyBoard();
  board = spawnRandomTile(board);
  board = spawnRandomTile(board);

  return {
    board,
    score: 0,
    status: 'playing', // 'playing' | 'won' | 'gameOver' | 'challenge'
    infiniteMode: false,
    pendingChallenge: null // valor do bloco gatilho (16/64/256/1024) em aberto
  };
}

/**
 * Gera um novo bloco (2 ou 4) em uma célula vazia aleatória.
 * Não faz nada se o tabuleiro estiver cheio.
 * @param {number[][]} board
 * @returns {number[][]} novo tabuleiro com o bloco adicionado (não muta o original).
 */
function spawnRandomTile(board) {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return cloneBoard(board);

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const next = cloneBoard(board);
  next[row][col] = randomTileValue();
  return next;
}

/**
 * Verifica se o tabuleiro contém o bloco de vitória (2048).
 * @param {number[][]} board
 * @returns {boolean}
 */
function hasWinningTile(board) {
  return board.some((row) => row.some((value) => value >= WIN_VALUE));
}

/**
 * Recalcula o status da partida (playing / won / gameOver) a partir do
 * tabuleiro atual, respeitando o modo infinito. Não considera desafios do
 * gatekeeper — é usado tanto logo após uma jogada normal quanto depois de
 * uma resposta correta no desafio matemático.
 * @param {number[][]} board
 * @param {boolean} infiniteMode
 * @returns {'playing'|'won'|'gameOver'}
 */
function computeStatus(board, infiniteMode) {
  if (hasWinningTile(board) && !infiniteMode) return 'won';
  if (!hasValidMove(board)) return 'gameOver';
  return 'playing';
}

/**
 * Aplica uma jogada completa: move, gera novo bloco se houve movimento,
 * e recalcula o status da partida (playing / won / gameOver / challenge).
 * Se a jogada formar um bloco gatilho (16/64/256/1024), o tabuleiro é
 * congelado em status 'challenge' até a resposta correta (ver
 * resolveChallenge). Respeita o modo infinito: se já estiver ativo, não
 * volta a travar em 'won'.
 * @param {object} state - estado atual (ver createInitialState).
 * @param {string} direction - direção do movimento (ver moves.js DIRECTIONS).
 * @returns {object} novo estado da partida.
 */
function applyMove(state, direction) {
  if (state.status === 'gameOver' || state.status === 'challenge') {
    return state;
  }

  const { board: movedBoard, gained, moved, mergedValues } = move(state.board, direction);

  if (!moved) {
    return state;
  }

  const boardWithNewTile = spawnRandomTile(movedBoard);
  const newScore = state.score + gained;

  const triggeredValue = mergedValues.find((value) => isTriggerBlock(value));
  // Limitação conhecida: se uma única jogada formar mais de um bloco
  // gatilho ao mesmo tempo (ex.: dois merges resultando em 16 e 64 no
  // mesmo swipe), apenas o primeiro dispara o desafio; o(s) outro(s) não
  // geram um desafio adicional em fila. Caso raro na prática — registrado
  // aqui para não passar despercebido (ver README, seção "Limitações").

  if (triggeredValue !== undefined) {
    return {
      board: boardWithNewTile,
      score: newScore,
      status: 'challenge',
      infiniteMode: state.infiniteMode,
      pendingChallenge: triggeredValue
    };
  }

  return {
    board: boardWithNewTile,
    score: newScore,
    status: computeStatus(boardWithNewTile, state.infiniteMode),
    infiniteMode: state.infiniteMode,
    pendingChallenge: null
  };
}

/**
 * Resolve um desafio do gatekeeper em aberto. Em caso de resposta correta,
 * destrava o tabuleiro e recalcula o status normalmente (won/gameOver/playing).
 * Em caso de resposta incorreta, mantém o tabuleiro congelado em 'challenge'.
 * @param {object} state
 * @param {boolean} wasCorrect
 * @returns {object} novo estado.
 */
function resolveChallenge(state, wasCorrect) {
  if (state.status !== 'challenge') return state;

  if (!wasCorrect) {
    return state;
  }

  return {
    ...state,
    status: computeStatus(state.board, state.infiniteMode),
    pendingChallenge: null
  };
}

/**
 * Ativa o modo infinito, permitindo continuar jogando após atingir 2048.
 * Recalcula o status com computeStatus (em vez de forçar 'playing' direto)
 * porque o tabuleiro pode já estar sem jogadas possíveis no momento da
 * vitória — nesse caso o modo infinito deve ir direto para 'gameOver' em
 * vez de deixar o jogo aparentemente travado, sem nenhuma jogada
 * funcionando e sem nunca mostrar a tela de fim de jogo.
 * @param {object} state
 * @returns {object} novo estado com infiniteMode = true e status recalculado.
 */
function continueInfinite(state) {
  const infiniteMode = true;
  return {
    ...state,
    infiniteMode,
    status: computeStatus(state.board, infiniteMode)
  };
}

module.exports = {
  WIN_VALUE,
  createInitialState,
  spawnRandomTile,
  hasWinningTile,
  applyMove,
  resolveChallenge,
  computeStatus,
  continueInfinite
};
