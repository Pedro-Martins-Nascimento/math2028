/**
 * Atualiza o HUD para refletir o estado congelado do tabuleiro durante um
 * desafio do gatekeeper (M2-05: "novo jogo" continua liberado, mas o board
 * fica bloqueado — ver gameState status 'challenge').
 */

const FROZEN_CLASS = 'hud--frozen';

/**
 * @param {HTMLElement} hudEl
 * @param {boolean} frozen
 */
function setHudFrozen(hudEl, frozen) {
  hudEl.classList.toggle(FROZEN_CLASS, frozen);
}

/**
 * Mostra o usuário autenticado no HUD (usado futuramente pelo M3 — auth).
 * @param {HTMLElement} hudUserEl
 * @param {string|null} userLabel
 */
function renderHudUser(hudUserEl, userLabel) {
  if (!userLabel) {
    hudUserEl.hidden = true;
    hudUserEl.textContent = '';
    return;
  }
  hudUserEl.hidden = false;
  hudUserEl.textContent = userLabel;
}

module.exports = { FROZEN_CLASS, setHudFrozen, renderHudUser };
