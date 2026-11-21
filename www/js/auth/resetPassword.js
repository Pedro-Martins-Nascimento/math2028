/**
 * Redefinição de senha via Supabase Auth (envia e-mail de recuperação).
 */

const { getSupabaseClient } = require('./supabaseClient');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Envia e-mail de recuperação de senha para o usuário.
 * @param {string} email
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
async function resetPasswordForEmail(email) {
  const cleanEmail = String(email || '').trim();
  if (!EMAIL_PATTERN.test(cleanEmail)) {
    return { success: false, error: 'Informe um e-mail válido para redefinir a senha.' };
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: 'Não foi possível solicitar a redefinição de senha. Tente novamente.' };
  }
}

module.exports = { resetPasswordForEmail };
