/**
 * Persistência local do recorde pessoal (High Score) exibido no HUD ao
 * lado da pontuação atual (GDD/WDD — mockup da tela principal). Guardado
 * separadamente da sessão de jogo (localSession.js) porque sobrevive a
 * partidas e a "Novo Jogo", diferente do estado da partida em si.
 */

const STORAGE_KEY = 'math2048:highscore';

/**
 * Lê o recorde salvo.
 * Silenciosamente retorna 0 se localStorage não estiver disponível ou o
 * valor salvo estiver corrompido, em vez de quebrar o HUD.
 * @returns {number}
 */
function getHighScore() {
  try {
    if (typeof localStorage === 'undefined') return 0;
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch (error) {
    console.warn('Não foi possível ler o recorde local:', error);
    return 0;
  }
}

/**
 * Atualiza o recorde salvo se a pontuação informada for maior que a atual.
 * @param {number} score
 * @returns {number} o recorde vigente após a comparação (o novo ou o antigo).
 */
function updateHighScore(score) {
  const current = getHighScore();
  if (score <= current) return current;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(score));
    }
  } catch (error) {
    console.warn('Não foi possível salvar o recorde local:', error);
  }
  return score;
}

module.exports = { STORAGE_KEY, getHighScore, updateHighScore };
