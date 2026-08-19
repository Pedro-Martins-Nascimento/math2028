const { createEmptyBoard, cloneBoard, getEmptyCells, boardsEqual } = require('../../www/js/core/board');

describe('board', () => {
  test('createEmptyBoard cria matriz 4x4 de zeros', () => {
    const board = createEmptyBoard();
    expect(board.length).toBe(4);
    board.forEach((row) => {
      expect(row.length).toBe(4);
      row.forEach((cell) => expect(cell).toBe(0));
    });
  });

  test('cloneBoard gera cópia independente (sem referência compartilhada)', () => {
    const board = createEmptyBoard();
    const clone = cloneBoard(board);
    clone[0][0] = 2;
    expect(board[0][0]).toBe(0);
    expect(clone).not.toBe(board);
    expect(clone[0]).not.toBe(board[0]);
  });

  test('getEmptyCells retorna todas as células vazias de um board novo', () => {
    const board = createEmptyBoard();
    expect(getEmptyCells(board).length).toBe(16);
  });

  test('getEmptyCells ignora células preenchidas', () => {
    const board = createEmptyBoard();
    board[0][0] = 2;
    board[3][3] = 4;
    expect(getEmptyCells(board).length).toBe(14);
  });

  test('boardsEqual compara por valor, não por referência', () => {
    const a = createEmptyBoard();
    const b = cloneBoard(a);
    expect(boardsEqual(a, b)).toBe(true);
    b[1][1] = 2;
    expect(boardsEqual(a, b)).toBe(false);
  });
});
