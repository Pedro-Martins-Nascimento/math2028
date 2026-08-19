/**
 * Carrega e filtra o banco estático de equações (www/data/equations.json)
 * conforme o bloco gatilho alcançado no jogo.
 */

const equations = require('../../data/equations.json');

// Blocos que disparam o desafio matemático obrigatório (M2-04).
const TRIGGER_BLOCKS = [16, 64, 256, 1024];

/**
 * Retorna todas as equações cadastradas para um bloco gatilho.
 * @param {number} trigger - um dos valores de TRIGGER_BLOCKS.
 * @returns {{id:string, question:string, answer:number}[]}
 */
function filterByTrigger(trigger) {
  const list = equations[String(trigger)];
  return Array.isArray(list) ? list.slice() : [];
}

/**
 * Retorna uma equação aleatória válida para o bloco gatilho informado.
 * @param {number} trigger
 * @returns {{id:string, question:string, answer:number}}
 * @throws {Error} se não houver equações cadastradas para o gatilho.
 */
function getRandomEquationForTrigger(trigger) {
  const list = filterByTrigger(trigger);
  if (list.length === 0) {
    throw new Error(`Nenhuma equação cadastrada para o gatilho ${trigger}`);
  }
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

/**
 * Verifica se um valor de bloco é um gatilho válido do gatekeeper.
 * @param {number} value
 * @returns {boolean}
 */
function isTriggerBlock(value) {
  return TRIGGER_BLOCKS.includes(value);
}

module.exports = {
  TRIGGER_BLOCKS,
  filterByTrigger,
  getRandomEquationForTrigger,
  isTriggerBlock
};
