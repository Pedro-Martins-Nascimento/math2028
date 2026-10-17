/**
 * Tela de autenticação: alterna entre login e cadastro, e mostra o
 * usuário logado no HUD após sucesso.
 */

const { signup } = require('../../auth/signup');
const { login } = require('../../auth/login');
const { t } = require('../../i18n/i18n');

/**
 * Renderiza a tela de auth dentro do elemento fornecido.
 * @param {HTMLElement} screenEl
 * @param {object} params
 * @param {(user: object) => void} params.onAuthenticated
 * @param {() => void} [params.onSkip] - permite jogar sem autenticar (offline).
 */
function renderAuthScreen(screenEl, { onAuthenticated, onSkip }) {
  let mode = 'login'; // 'login' | 'signup'

  function draw() {
    const isSignup = mode === 'signup';
    screenEl.innerHTML = `
      <div class="modal__card auth-card">
        <h2 class="modal__title">${isSignup ? t('auth.titleSignup') : t('auth.titleLogin')}</h2>
        <input id="auth-email" class="modal__input" type="email" placeholder="${t('auth.emailPlaceholder')}" autocomplete="email" />
        <input id="auth-password" class="modal__input" type="password" placeholder="${t('auth.passwordPlaceholder')}" autocomplete="${isSignup ? 'new-password' : 'current-password'}" />
        <p id="auth-error" class="modal__error" role="alert"></p>
        
        <div class="auth-actions">
          <button id="auth-submit" class="btn btn--cyan auth-btn-primary">${isSignup ? t('auth.btnSignup') : t('auth.btnLogin')}</button>
          
          <div class="auth-secondary-actions">
            <button id="auth-toggle-mode" type="button" class="btn auth-btn-link">
              ${isSignup ? t('auth.toggleToLogin') : t('auth.toggleToSignup')}
            </button>
            ${onSkip ? `
              <button id="auth-skip" type="button" class="btn auth-btn-link auth-btn-skip">
                ${t('auth.skip')}
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    screenEl.hidden = false;

    const emailEl = screenEl.querySelector('#auth-email');
    const passwordEl = screenEl.querySelector('#auth-password');
    const errorEl = screenEl.querySelector('#auth-error');

    screenEl.querySelector('#auth-toggle-mode').addEventListener('click', () => {
      mode = isSignup ? 'login' : 'signup';
      draw();
    });

    if (onSkip) {
      screenEl.querySelector('#auth-skip').addEventListener('click', () => {
        screenEl.hidden = true;
        onSkip();
      });
    }

    screenEl.querySelector('#auth-submit').addEventListener('click', async () => {
      errorEl.textContent = '';
      const email = emailEl.value.trim();
      const password = passwordEl.value;

      const action = isSignup ? signup : login;
      const { user, error } = await action(email, password);

      if (error) {
        errorEl.textContent = error;
        return;
      }

      screenEl.hidden = true;
      onAuthenticated(user);
    });
  }

  draw();
}

function hideAuthScreen(screenEl) {
  screenEl.hidden = true;
}

module.exports = { renderAuthScreen, hideAuthScreen };
