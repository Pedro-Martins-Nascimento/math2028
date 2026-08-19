/**
 * Fluxo de cadastro (signup) de usuário via Supabase Auth.
 */

const { getSupabaseClient } = require('./supabaseClient');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Cadastra um novo usuário com e-mail e senha.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object|null, error: string|null}>}
 *   Nunca lança — erros de rede/validação voltam como `error` (mensagem
 *   amigável), conforme RNF de tratamento de erro (M3-05).
 */
async function signup(email, password) {
  if (!EMAIL_PATTERN.test(String(email || '').trim())) {
    return { user: null, error: 'Informe um e-mail válido.' };
  }
  if (!password || password.length < 6) {
    return { user: null, error: 'A senha precisa ter ao menos 6 caracteres.' };
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: 'Não foi possível concluir o cadastro. Tente novamente.' };
  }
}

module.exports = { signup };
