/**
 * @jest-environment jsdom
 */

const { attachKeyboardInput, isTypingInTextField } = require('../../www/js/input/keyboard');
const { DIRECTIONS } = require('../../www/js/core/moves');

function fireKeydown(target, key) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  Object.defineProperty(event, 'target', { value: target, enumerable: true });
  target.dispatchEvent(event);
  return event;
}

describe('keyboard input', () => {
  let onMove;
  let detach;

  beforeEach(() => {
    onMove = jest.fn();
    detach = attachKeyboardInput(onMove);
  });

  afterEach(() => {
    detach();
    document.body.innerHTML = '';
  });

  test('ArrowLeft no body dispara movimento para a esquerda', () => {
    fireKeydown(document.body, 'ArrowLeft');
    expect(onMove).toHaveBeenCalledWith(DIRECTIONS.LEFT);
  });

  test('WASD dispara os 4 movimentos corretamente', () => {
    fireKeydown(document.body, 'w');
    fireKeydown(document.body, 'a');
    fireKeydown(document.body, 's');
    fireKeydown(document.body, 'd');
    expect(onMove.mock.calls.map((c) => c[0])).toEqual([
      DIRECTIONS.UP,
      DIRECTIONS.LEFT,
      DIRECTIONS.DOWN,
      DIRECTIONS.RIGHT
    ]);
  });

  test('tecla sem mapeamento não chama onMove', () => {
    fireKeydown(document.body, 'q');
    expect(onMove).not.toHaveBeenCalled();
  });

  test('BUG CORRIGIDO: seta digitada dentro de um <input> não move o tabuleiro', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    fireKeydown(input, 'ArrowLeft');
    fireKeydown(input, 'ArrowRight');

    expect(onMove).not.toHaveBeenCalled();
  });

  test('BUG CORRIGIDO: não faz preventDefault no cursor de texto de um <input>', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    const event = fireKeydown(input, 'ArrowLeft');

    expect(event.defaultPrevented).toBe(false);
  });

  test('isTypingInTextField reconhece INPUT e TEXTAREA', () => {
    const input = document.createElement('input');
    const textarea = document.createElement('textarea');
    const div = document.createElement('div');

    expect(isTypingInTextField({ target: input })).toBe(true);
    expect(isTypingInTextField({ target: textarea })).toBe(true);
    expect(isTypingInTextField({ target: div })).toBe(false);
  });
});
