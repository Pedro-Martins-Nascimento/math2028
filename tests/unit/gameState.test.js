const { createEmptyBoard } = require('../../www/js/core/board');
const { computeStatus, continueInfinite, resolveChallenge } = require('../../www/js/core/gameState');

function boardFrom(rows) {
  const board = createEmptyBoard();
  rows.forEach((row, r) => row.forEach((value, c) => { board[r][c] = value; }));
  return board;
}

describe('gameState - computeStatus', () => {
  test('detecta vitória quando há um bloco 2048 e não está em modo infinito', () => {
    const board = boardFrom([[2048, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
    expect(computeStatus(board, false)).toBe('won');
  });

  test('em modo infinito, não volta a travar em won mesmo com 2048 no tabuleiro', () => {
    const board = boardFrom([[2048, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
    expect(computeStatus(board, true)).toBe('playing');
  });

  test('detecta gameOver quando não há vitória nem jogadas possíveis', () => {
    const board = boardFrom([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2]
    ]);
    expect(computeStatus(board, false)).toBe('gameOver');
  });
});

describe('gameState - continueInfinite (bug: tabuleiro vencido e travado)', () => {
  test('vitória com tabuleiro cheio e sem jogadas possíveis vai direto para gameOver ao continuar', () => {
    // Tabuleiro cheio, com um 2048 e nenhum par adjacente igual — vencido
    // e travado ao mesmo tempo.
    const stuckWinningBoard = boardFrom([
      [2048, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2]
    ]);
    const wonState = {
      board: stuckWinningBoard,
      score: 4000,
      status: 'won',
      infiniteMode: false,
      pendingChallenge: null
    };

    const next = continueInfinite(wonState);

    // Antes da correção, isso ficava incorretamente 'playing' para sempre
    // (tabuleiro travado, mas sem nunca detectar/mostrar o game over).
    expect(next.status).toBe('gameOver');
    expect(next.infiniteMode).toBe(true);
  });

  test('vitória com tabuleiro ainda jogável continua normalmente em playing', () => {
    const winnableBoard = boardFrom([[2048, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
    const wonState = {
      board: winnableBoard,
      score: 4000,
      status: 'won',
      infiniteMode: false,
      pendingChallenge: null
    };

    const next = continueInfinite(wonState);

    expect(next.status).toBe('playing');
    expect(next.infiniteMode).toBe(true);
  });
});

describe('gameState - resolveChallenge após vitória travada', () => {
  test('responder corretamente um desafio com tabuleiro vencido e travado leva a won (não gameOver direto)', () => {
    // hasWinningTile tem prioridade sobre hasValidMove em computeStatus,
    // então mesmo travado, se ainda não estiver em modo infinito o status
    // correto é 'won' (o jogador decide depois se continua ou não).
    const board = boardFrom([
      [2048, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2]
    ]);
    const challengeState = {
      board,
      score: 4000,
      status: 'challenge',
      infiniteMode: false,
      pendingChallenge: 1024
    };

    const next = resolveChallenge(challengeState, true);
    expect(next.status).toBe('won');
  });
});
