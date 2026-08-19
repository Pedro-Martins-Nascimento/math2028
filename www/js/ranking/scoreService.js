/**
 * Envio da pontuação final da partida para o Supabase.
 * Depende da tabela `scores` (ver docs/supabase-schema.sql) e de RLS que
 * só permite ao usuário inserir linhas com o próprio user_id — isso evita
 * que o score seja trivialmente adulterado por outro usuário (M3-05).
 */

const { getSupabaseClient } = require('../auth/supabaseClient');

/**
 * Envia a pontuação final de uma partida.
 * @param {object} params
 * @param {string} params.userId - id do usuário autenticado (auth.uid()).
 * @param {string} params.username - nome exibido no leaderboard.
 * @param {number} params.score
 * @returns {Promise<{error: string|null}>}
 */
async function submitScore({ userId, username, score }) {
  if (!userId) {
    return { error: 'É preciso estar autenticado para enviar a pontuação.' };
  }
  if (!Number.isFinite(score) || score < 0) {
    return { error: 'Pontuação inválida.' };
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('scores').insert({
      user_id: userId,
      username,
      score
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: 'Não foi possível enviar a pontuação agora. Ela pode ser reenviada mais tarde.' };
  }
}

module.exports = { submitScore };
