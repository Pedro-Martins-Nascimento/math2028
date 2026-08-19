/**
 * Input de swipe (toque) sobre o tabuleiro. Detecta a direção dominante
 * do gesto e dispara o callback assim que o dedo é solto, mantendo a
 * resposta dentro do orçamento de 100ms (RNF-01).
 */

const { DIRECTIONS } = require('../core/moves');

const MIN_SWIPE_DISTANCE = 24; // px — evita disparo em toques acidentais

/**
 * Liga o listener de swipe a um elemento (normalmente o container do board).
 * @param {HTMLElement} element
 * @param {(direction: string) => void} onMove
 * @returns {() => void} função de cleanup.
 */
function attachSwipeInput(element, onMove) {
  let startX = 0;
  let startY = 0;
  let tracking = false;

  function handleTouchStart(event) {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    tracking = true;
  }

  function handleTouchEnd(event) {
    if (!tracking) return;
    tracking = false;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (Math.max(absX, absY) < MIN_SWIPE_DISTANCE) return;

    let direction;
    if (absX > absY) {
      direction = deltaX > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
    } else {
      direction = deltaY > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
    }

    onMove(direction);
  }

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

module.exports = { attachSwipeInput, MIN_SWIPE_DISTANCE };
