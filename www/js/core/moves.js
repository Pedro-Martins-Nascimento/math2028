/**
 * Movimento do tabuleiro nas 4 direções, construído sobre mergeLineLeft
 * (merge.js). Cada direção é implementada transformando o board para que
 * a operação sempre aconteça "para a esquerda", e depois desfazendo a
 * transformação.
 */

const { cloneBoard } = require('./board');
const { mergeLineLeft } = require('./merge');

const DIRECTIONS = Object.freeze({
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN'
});

/** Inverte a ordem das colunas de cada linha (espelha horizontalmente). */
function reverseRows(board) {
  return board.map((row) => row.slice().reverse());
}

/** Transpõe o tabuleiro (linhas viram colunas). */
function transpose(board) {
  const size = board.length;
  const result = [];
  for (let col = 0; col < size; col++) {
    const row = [];
    for (let r = 0; r < size; r++) {
      row.push(board[r][col]);
    }
    result.push(row);
  }
  return result;
}

/**
 * Move e funde o tabuleiro em uma direção.
 * @param {number[][]} board
 * @param {string} direction - um dos valores de DIRECTIONS.
 * @returns {{board: number[][], gained: number, moved: boolean}}
 */
function move(board, direction) {
  let working = cloneBoard(board);
  let needsTranspose = false;
  let needsReverse = false;

  switch (direction) {
    case DIRECTIONS.LEFT:
      break;
    case DIRECTIONS.RIGHT:
      needsReverse = true;
      break;
    case DIRECTIONS.UP:
      needsTranspose = true;
      break;
    case DIRECTIONS.DOWN:
      needsTranspose = true;
      needsReverse = true;
      break;
    default:
      throw new Error(`Direção inválida: ${direction}`);
  }

  if (needsTranspose) working = transpose(working);
  if (needsReverse) working = reverseRows(working);

  let gained = 0;
  let moved = false;
  const mergedValues = [];

  const resultRows = working.map((line) => {
    const { line: newLine, gained: lineGained, moved: lineMoved, mergedValues: lineMerged } = mergeLineLeft(line);
    gained += lineGained;
    if (lineMoved) moved = true;
    mergedValues.push(...lineMerged);
    return newLine;
  });

  let finalBoard = resultRows;
  if (needsReverse) finalBoard = reverseRows(finalBoard);
  if (needsTranspose) finalBoard = transpose(finalBoard);

  return { board: finalBoard, gained, moved, mergedValues };
}

/**
 * Verifica se existe algum movimento válido possível no tabuleiro atual
 * (usado para detectar game over).
 * @param {number[][]} board
 * @returns {boolean}
 */
function hasValidMove(board) {
  return Object.values(DIRECTIONS).some((direction) => move(board, direction).moved);
}

module.exports = {
  DIRECTIONS,
  move,
  hasValidMove,
  reverseRows,
  transpose
};
