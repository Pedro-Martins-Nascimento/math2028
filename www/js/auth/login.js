/**
 * Fluxo de login de usuário via Supabase Auth.
 */

const { getSupabaseClient } = require('./supabaseClient');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Autentica um usuário com e-mail e senha.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object|null, error: string|null}>}
 */
async function login(email, password) {
  if (!EMAIL_PATTERN.test(String(email || '').trim())) {
    return { user: null, error: 'Informe um e-mail válido.' };
  }
  if (!password) {
    return { user: null, error: 'Informe a senha.' };
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: 'Não foi possível entrar. Verifique sua conexão e tente novamente.' };
  }
}

module.exports = { login };
