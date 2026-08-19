/**
 * Modelo do tabuleiro 4x4 do Math2048.
 * Responsável apenas pela estrutura de dados do board: criação e clone.
 * Não implementa movimento, merge nem UI (ver moves.js, merge.js, boardRenderer.js).
 */

const BOARD_SIZE = 4;

/**
 * Cria um tabuleiro vazio 4x4, preenchido com zeros (0 = célula vazia).
 * @returns {number[][]} matriz 4x4 de zeros.
 */
function createEmptyBoard() {
  const board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    board.push(new Array(BOARD_SIZE).fill(0));
  }
  return board;
}

/**
 * Clona profundamente um tabuleiro, garantindo que a matriz e as linhas
 * retornadas não compartilhem referência com o original.
 * @param {number[][]} board
 * @returns {number[][]} cópia independente do tabuleiro.
 */
function cloneBoard(board) {
  return board.map((row) => row.slice());
}

/**
 * Retorna a lista de posições {row, col} cujo valor é 0 (vazias).
 * @param {number[][]} board
 * @returns {{row:number, col:number}[]}
 */
function getEmptyCells(board) {
  const cells = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
}

/**
 * Compara duas matrizes de tabuleiro por valor (não por referência).
 * @param {number[][]} a
 * @param {number[][]} b
 * @returns {boolean}
 */
function boardsEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let row = 0; row < a.length; row++) {
    if (a[row].length !== b[row].length) return false;
    for (let col = 0; col < a[row].length; col++) {
      if (a[row][col] !== b[row][col]) return false;
    }
  }
  return true;
}

module.exports = {
  BOARD_SIZE,
  createEmptyBoard,
  cloneBoard,
  getEmptyCells,
  boardsEqual
};
