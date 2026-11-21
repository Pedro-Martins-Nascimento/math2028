/**
 * Tela de autenticação: alterna entre login e cadastro, e mostra o
 * usuário logado no HUD após sucesso.
 */

const { signup } = require('../../auth/signup');
const { login } = require('../../auth/login');
const { resetPasswordForEmail } = require('../../auth/resetPassword');
const { t } = require('../../i18n/i18n');

/**
 * Renderiza a tela de auth dentro do elemento fornecido.
 * @param {HTMLElement} screenEl
 * @param {object} params
 * @param {(user: object) => void} params.onAuthenticated
 * @param {() => void} [params.onSkip] - permite jogar sem autenticar (offline).
 */
function renderAuthScreen(screenEl, { onAuthenticated, onSkip }) {
  let mode = 'login'; // 'login' | 'signup' | 'reset'

  function draw() {
    const isSignup = mode === 'signup';
    const isReset = mode === 'reset';

    let title = t('auth.titleLogin');
    if (isSignup) title = t('auth.titleSignup');
    if (isReset) title = t('auth.titleReset');

    screenEl.innerHTML = `
      <div class="modal__card auth-card">
        <h2 class="modal__title">${title}</h2>
        <input id="auth-email" class="modal__input" type="email" placeholder="${t('auth.emailPlaceholder')}" autocomplete="email" />
        ${!isReset ? `
          <input id="auth-password" class="modal__input" type="password" placeholder="${t('auth.passwordPlaceholder')}" autocomplete="${isSignup ? 'new-password' : 'current-password'}" />
        ` : ''}
        <p id="auth-error" class="modal__error" role="alert"></p>
        
        <div class="auth-actions">
          <button id="auth-submit" class="btn btn--cyan auth-btn-primary">
            ${isReset ? t('auth.btnReset') : (isSignup ? t('auth.btnSignup') : t('auth.btnLogin'))}
          </button>
          
          <div class="auth-secondary-actions">
            ${mode === 'login' ? `
              <button id="auth-forgot-btn" type="button" class="btn auth-btn-link" style="font-size:11px;opacity:0.85;">
                ${t('auth.forgotPassword')}
              </button>
            ` : ''}
            
            <button id="auth-toggle-mode" type="button" class="btn auth-btn-link">
              ${isReset ? t('auth.backToLogin') : (isSignup ? t('auth.toggleToLogin') : t('auth.toggleToSignup'))}
            </button>

            ${onSkip && !isReset ? `
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

    const forgotBtn = screenEl.querySelector('#auth-forgot-btn');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', () => {
        mode = 'reset';
        draw();
      });
    }

    screenEl.querySelector('#auth-toggle-mode').addEventListener('click', () => {
      if (mode === 'reset') {
        mode = 'login';
      } else {
        mode = isSignup ? 'login' : 'signup';
      }
      draw();
    });

    if (onSkip && !isReset) {
      const skipBtn = screenEl.querySelector('#auth-skip');
      if (skipBtn) {
        skipBtn.addEventListener('click', () => {
          screenEl.hidden = true;
          onSkip();
        });
      }
    }

    screenEl.querySelector('#auth-submit').addEventListener('click', async () => {
      errorEl.textContent = '';
      errorEl.style.color = '';
      const email = emailEl.value.trim();

      if (isReset) {
        const { success, error } = await resetPasswordForEmail(email);
        if (error) {
          errorEl.textContent = error;
          errorEl.style.color = 'var(--color-pink)';
        } else {
          errorEl.textContent = t('auth.resetSent');
          errorEl.style.color = 'var(--color-green)';
        }
        return;
      }

      const password = passwordEl ? passwordEl.value : '';
      const action = isSignup ? signup : login;
      const { user, error } = await action(email, password);

      if (error) {
        errorEl.textContent = error;
        errorEl.style.color = 'var(--color-pink)';
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
