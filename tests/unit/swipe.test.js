/**
 * @jest-environment jsdom
 */

const { attachSwipeInput, MIN_SWIPE_DISTANCE } = require('../../www/js/input/swipe');
const { DIRECTIONS } = require('../../www/js/core/moves');

function fireTouch(target, type, x, y) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  const touchList = [{ clientX: x, clientY: y }];
  Object.defineProperty(event, 'touches', { value: touchList, enumerable: true });
  Object.defineProperty(event, 'changedTouches', { value: touchList, enumerable: true });
  target.dispatchEvent(event);
}

function swipe(target, [fromX, fromY], [toX, toY]) {
  fireTouch(target, 'touchstart', fromX, fromY);
  fireTouch(target, 'touchend', toX, toY);
}

describe('swipe input', () => {
  let element;
  let onMove;
  let detach;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    onMove = jest.fn();
    detach = attachSwipeInput(element, onMove);
  });

  afterEach(() => {
    detach();
    document.body.innerHTML = '';
  });

  test('swipe horizontal para a direita dispara RIGHT', () => {
    swipe(element, [0, 0], [100, 0]);
    expect(onMove).toHaveBeenCalledWith(DIRECTIONS.RIGHT);
  });

  test('swipe horizontal para a esquerda dispara LEFT', () => {
    swipe(element, [100, 0], [0, 0]);
    expect(onMove).toHaveBeenCalledWith(DIRECTIONS.LEFT);
  });

  test('swipe vertical para baixo dispara DOWN', () => {
    swipe(element, [0, 0], [0, 100]);
    expect(onMove).toHaveBeenCalledWith(DIRECTIONS.DOWN);
  });

  test('swipe vertical para cima dispara UP', () => {
    swipe(element, [0, 100], [0, 0]);
    expect(onMove).toHaveBeenCalledWith(DIRECTIONS.UP);
  });

  test('toque abaixo da distância mínima não dispara movimento', () => {
    swipe(element, [0, 0], [MIN_SWIPE_DISTANCE - 5, 0]);
    expect(onMove).not.toHaveBeenCalled();
  });

  test('diagonal usa o eixo dominante (maior deslocamento)', () => {
    // deltaX=80, deltaY=20 -> horizontal domina
    swipe(element, [0, 0], [80, 20]);
    expect(onMove).toHaveBeenCalledWith(DIRECTIONS.RIGHT);
  });

  test('touchend sem touchstart anterior não dispara nada', () => {
    fireTouch(element, 'touchend', 100, 0);
    expect(onMove).not.toHaveBeenCalled();
  });

  test('cleanup remove os listeners (nenhum movimento após detach)', () => {
    detach();
    swipe(element, [0, 0], [100, 0]);
    expect(onMove).not.toHaveBeenCalled();
  });
});
