/**
 * Persistência local da sessão de jogo (localStorage). Permite salvar e
 * restaurar o estado atual (board, score, status, modo infinito e desafio
 * pendente) entre recarregamentos da página/app.
 */

const STORAGE_KEY = 'math2048:session';

/**
 * Salva o estado atual da partida no localStorage.
 * Silenciosamente não faz nada se localStorage não estiver disponível
 * (ex.: ambiente de teste sem DOM, modo privado bloqueando storage).
 * @param {object} state
 */
function saveSession(state) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Falha ao persistir (quota excedida, storage bloqueado etc.) não deve
    // quebrar o jogo — a partida continua apenas em memória.
    console.warn('Não foi possível salvar a sessão local:', error);
  }
}

/**
 * Restaura o estado salvo da partida, se existir e for válido.
 * @returns {object|null} estado salvo, ou null se não houver nada válido.
 */
function loadSession() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.board)) return null;

    return parsed;
  } catch (error) {
    console.warn('Não foi possível restaurar a sessão local:', error);
    return null;
  }
}

/**
 * Remove a sessão salva (usado ao iniciar um novo jogo).
 */
function clearSession() {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Não foi possível limpar a sessão local:', error);
  }
}

module.exports = { STORAGE_KEY, saveSession, loadSession, clearSession };
