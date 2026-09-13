/**
 * Roteador simples entre as telas do app (Home, Board, Ranking, Perfil).
 * Não há framework de rotas — só alterna `hidden` entre seções e destaca
 * o item correspondente na navegação inferior.
 */

/**
 * @param {Record<string, HTMLElement>} screens - mapa nome -> elemento da tela.
 * @param {HTMLElement[]} navButtons - botões da navegação inferior (data-screen).
 * @returns {{show: (screenName: string, navKey?: string) => void}}
 */
function createScreenRouter(screens, navButtons) {
  /**
   * Mostra uma tela e destaca o item de navegação correspondente.
   * @param {string} screenName - chave em `screens` a exibir.
   * @param {string} [navKey] - data-screen do item de nav a destacar, caso
   *   diferente de `screenName` (ex.: a tela "board" pertence ao item "home").
   */
  function show(screenName, navKey = screenName) {
    Object.keys(screens).forEach((key) => {
      screens[key].hidden = key !== screenName;
    });
    navButtons.forEach((btn) => {
      btn.classList.toggle('bottom-nav__item--active', btn.dataset.screen === navKey);
    });
  }

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => show(btn.dataset.screen));
  });

  return { show };
}

module.exports = { createScreenRouter };
