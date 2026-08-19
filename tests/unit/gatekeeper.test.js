const { filterByTrigger, getRandomEquationForTrigger, isTriggerBlock, TRIGGER_BLOCKS } = require('../../www/js/gatekeeper/equationBank');
const { validateAnswer, parseAnswer } = require('../../www/js/gatekeeper/validator');
const { createInitialState, applyMove, resolveChallenge } = require('../../www/js/core/gameState');
const { createEmptyBoard } = require('../../www/js/core/board');
const { DIRECTIONS } = require('../../www/js/core/moves');

function boardFrom(rows) {
  const board = createEmptyBoard();
  rows.forEach((row, r) => row.forEach((value, c) => { board[r][c] = value; }));
  return board;
}

describe('equationBank - filtro por gatilho', () => {
  test('TRIGGER_BLOCKS contém os 4 blocos gatilho esperados', () => {
    expect(TRIGGER_BLOCKS).toEqual([16, 64, 256, 1024]);
  });

  test.each(TRIGGER_BLOCKS)('filterByTrigger(%i) retorna ao menos uma equação', (trigger) => {
    const list = filterByTrigger(trigger);
    expect(list.length).toBeGreaterThan(0);
    list.forEach((equation) => {
      expect(typeof equation.question).toBe('string');
      expect(typeof equation.answer).toBe('number');
    });
  });

  test('filterByTrigger retorna vazio para um gatilho não cadastrado', () => {
    expect(filterByTrigger(999)).toEqual([]);
  });

  test('getRandomEquationForTrigger sempre retorna item válido do gatilho', () => {
    const equation = getRandomEquationForTrigger(64);
    expect(filterByTrigger(64)).toContainEqual(equation);
  });

  test('getRandomEquationForTrigger lança erro para gatilho sem equações', () => {
    expect(() => getRandomEquationForTrigger(999)).toThrow();
  });

  test('isTriggerBlock reconhece blocos gatilho e rejeita os demais', () => {
    expect(isTriggerBlock(64)).toBe(true);
    expect(isTriggerBlock(8)).toBe(false);
  });
});

describe('validator - validação de resposta', () => {
  test('aceita resposta numérica correta', () => {
    expect(validateAnswer({ answer: 15 }, 15)).toBe(true);
    expect(validateAnswer({ answer: 15 }, '15')).toBe(true);
  });

  test('aceita vírgula como separador decimal', () => {
    expect(parseAnswer('12,5')).toBe(12.5);
  });

  test('rejeita resposta incorreta', () => {
    expect(validateAnswer({ answer: 15 }, 14)).toBe(false);
  });

  test('rejeita entrada vazia ou não numérica', () => {
    expect(validateAnswer({ answer: 15 }, '')).toBe(false);
    expect(validateAnswer({ answer: 15 }, 'abc')).toBe(false);
  });
});

describe('gameState - fluxo do gatekeeper (bloqueio do tabuleiro)', () => {
  test('formar um bloco gatilho (16) trava o jogo em status challenge', () => {
    const state = {
      board: boardFrom([
        [8, 8, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]),
      score: 0,
      status: 'playing',
      infiniteMode: false,
      pendingChallenge: null
    };

    const next = applyMove(state, DIRECTIONS.LEFT);
    expect(next.status).toBe('challenge');
    expect(next.pendingChallenge).toBe(16);
  });

  test('tabuleiro congelado não aceita novos movimentos enquanto em challenge', () => {
    const challengeState = {
      board: boardFrom([
        [16, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]),
      score: 16,
      status: 'challenge',
      infiniteMode: false,
      pendingChallenge: 16
    };

    const next = applyMove(challengeState, DIRECTIONS.RIGHT);
    expect(next).toBe(challengeState);
  });

  test('resolveChallenge com resposta correta destrava o jogo (volta a playing)', () => {
    const challengeState = {
      board: boardFrom([
        [16, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]),
      score: 16,
      status: 'challenge',
      infiniteMode: false,
      pendingChallenge: 16
    };

    const next = resolveChallenge(challengeState, true);
    expect(next.status).toBe('playing');
    expect(next.pendingChallenge).toBeNull();
  });

  test('resolveChallenge com resposta incorreta mantém o desafio travado', () => {
    const challengeState = {
      board: boardFrom([[16, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]),
      score: 16,
      status: 'challenge',
      infiniteMode: false,
      pendingChallenge: 16
    };

    const next = resolveChallenge(challengeState, false);
    expect(next.status).toBe('challenge');
    expect(next.pendingChallenge).toBe(16);
  });

  test('createInitialState começa sem desafio pendente', () => {
    const state = createInitialState();
    expect(state.status).toBe('playing');
    expect(state.pendingChallenge).toBeNull();
  });
});
