/**
 * Validação da resposta numérica do usuário para o desafio matemático.
 * Não conhece UI nem o banco de equações — apenas compara valores.
 */

/**
 * Normaliza uma entrada de texto para número, aceitando vírgula ou ponto
 * como separador decimal e removendo espaços.
 * @param {string|number} rawValue
 * @returns {number} NaN se a entrada não for um número válido.
 */
function parseAnswer(rawValue) {
  if (typeof rawValue === 'number') return rawValue;
  if (typeof rawValue !== 'string') return NaN;

  const normalized = rawValue.trim().replace(',', '.');
  if (normalized === '') return NaN;

  return Number(normalized);
}

/**
 * Valida se a resposta do usuário está correta para a equação fornecida.
 * @param {{answer: number}} equation
 * @param {string|number} userAnswer
 * @returns {boolean}
 */
function validateAnswer(equation, userAnswer) {
  const parsed = parseAnswer(userAnswer);
  if (Number.isNaN(parsed)) return false;
  return parsed === equation.answer;
}

module.exports = { parseAnswer, validateAnswer };
