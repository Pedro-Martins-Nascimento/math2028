/**
 * Controle de sessão: logout e leitura do usuário/sessão atual.
 * Junto com signup.js e login.js forma o fluxo único de autenticação
 * (M3-02).
 */

const { getSupabaseClient } = require('./supabaseClient');

/**
 * Encerra a sessão do usuário atual.
 * @returns {Promise<{error: string|null}>}
 */
async function logout() {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  } catch (error) {
    return { error: 'Não foi possível sair. Tente novamente.' };
  }
}

/**
 * Retorna o usuário autenticado atualmente, ou null se não houver sessão.
 * @returns {Promise<object|null>}
 */
async function getCurrentUser() {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase.auth.getUser();
    return data?.user ?? null;
  } catch (error) {
    return null;
  }
}

/**
 * Registra um callback para mudanças de estado de autenticação
 * (login, logout, refresh de token).
 * @param {(user: object|null) => void} callback
 * @returns {() => void} função para cancelar a inscrição.
 */
function onAuthStateChange(callback) {
  try {
    const supabase = getSupabaseClient();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  } catch (error) {
    return () => {};
  }
}

module.exports = { logout, getCurrentUser, onAuthStateChange };
