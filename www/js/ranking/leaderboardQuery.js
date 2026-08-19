/**
 * Consulta do ranking global (Top 10) na tabela `scores`.
 */

const { getSupabaseClient } = require('../auth/supabaseClient');

const LEADERBOARD_LIMIT = 10;

/**
 * Busca as melhores pontuações globais.
 * @returns {Promise<{entries: Array<{username: string, score: number}>, error: string|null}>}
 */
async function getTopScores() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('scores')
      .select('username, score')
      .order('score', { ascending: false })
      .limit(LEADERBOARD_LIMIT);

    if (error) {
      return { entries: [], error: error.message };
    }

    return { entries: data ?? [], error: null };
  } catch (error) {
    return { entries: [], error: 'Não foi possível carregar o ranking agora.' };
  }
}

module.exports = { getTopScores, LEADERBOARD_LIMIT };
