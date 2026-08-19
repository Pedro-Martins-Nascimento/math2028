/**
 * Input de teclado: mapeia setas e WASD para direções do jogo.
 * Resposta ao input em até 100ms (RNF-01) — o listener chama o callback
 * diretamente, sem debounce ou fila.
 */

const { DIRECTIONS } = require('../core/moves');

const KEY_MAP = {
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  a: DIRECTIONS.LEFT,
  d: DIRECTIONS.RIGHT,
  w: DIRECTIONS.UP,
  s: DIRECTIONS.DOWN
};

const TEXT_INPUT_TAGS = ['INPUT', 'TEXTAREA'];

/**
 * Verifica se o evento partiu de um campo de texto focado (input de
 * resposta do desafio, e-mail/senha do login etc.). Nesses casos as
 * setas/WASD precisam continuar controlando o cursor/digitação
 * normalmente, e não mover o tabuleiro.
 * @param {KeyboardEvent} event
 * @returns {boolean}
 */
function isTypingInTextField(event) {
  const target = event.target;
  return !!target && TEXT_INPUT_TAGS.includes(target.tagName);
}

/**
 * Liga o listener de teclado ao documento.
 * @param {(direction: string) => void} onMove - callback chamado com a direção.
 * @returns {() => void} função para remover o listener (cleanup).
 */
function attachKeyboardInput(onMove) {
  function handleKeydown(event) {
    if (isTypingInTextField(event)) return;

    const direction = KEY_MAP[event.key];
    if (!direction) return;
    event.preventDefault();
    onMove(direction);
  }

  document.addEventListener('keydown', handleKeydown);
  return () => document.removeEventListener('keydown', handleKeydown);
}

module.exports = { attachKeyboardInput, KEY_MAP, isTypingInTextField };
