const { createEmptyBoard } = require('../../www/js/core/board');
const { move, hasValidMove, DIRECTIONS } = require('../../www/js/core/moves');

function boardFrom(rows) {
  const board = createEmptyBoard();
  rows.forEach((row, r) => row.forEach((value, c) => { board[r][c] = value; }));
  return board;
}

describe('moves', () => {
  test('LEFT desloca e funde corretamente', () => {
    const board = boardFrom([
      [0, 2, 2, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    const { board: result, moved, gained } = move(board, DIRECTIONS.LEFT);
    expect(result[0]).toEqual([4, 0, 0, 0]);
    expect(moved).toBe(true);
    expect(gained).toBe(4);
  });

  test('RIGHT desloca e funde para a direita', () => {
    const board = boardFrom([
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    const { board: result } = move(board, DIRECTIONS.RIGHT);
    expect(result[0]).toEqual([0, 0, 0, 4]);
  });

  test('UP desloca e funde para cima', () => {
    const board = boardFrom([
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    const { board: result } = move(board, DIRECTIONS.UP);
    expect(result[0][0]).toBe(4);
    expect(result[1][0]).toBe(0);
  });

  test('DOWN desloca e funde para baixo', () => {
    const board = boardFrom([
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    const { board: result } = move(board, DIRECTIONS.DOWN);
    expect(result[3][0]).toBe(4);
    expect(result[0][0]).toBe(0);
  });

  test('não permite merge duplo na mesma jogada (evita duplicar blocos)', () => {
    const board = boardFrom([
      [2, 2, 4, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
    const { board: result, gained } = move(board, DIRECTIONS.LEFT);
    expect(result[0]).toEqual([4, 8, 0, 0]);
    expect(gained).toBe(12);
  });

  test('hasValidMove retorna false em tabuleiro cheio e travado', () => {
    const board = boardFrom([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2]
    ]);
    expect(hasValidMove(board)).toBe(false);
  });

  test('hasValidMove retorna true quando existe merge possível', () => {
    const board = boardFrom([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 4]
    ]);
    expect(hasValidMove(board)).toBe(true);
  });
});
