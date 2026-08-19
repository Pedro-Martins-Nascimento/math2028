const { STORAGE_KEY, saveSession, loadSession, clearSession } = require('../../www/js/storage/localSession');

describe('localSession', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('saveSession + loadSession restaura o mesmo estado salvo', () => {
    const state = { board: [[2, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], score: 42, status: 'playing', infiniteMode: false, pendingChallenge: null };

    saveSession(state);
    const restored = loadSession();

    expect(restored).toEqual(state);
  });

  test('loadSession retorna null quando não há nada salvo', () => {
    expect(loadSession()).toBeNull();
  });

  test('loadSession retorna null para JSON corrompido, sem lançar erro', () => {
    localStorage.setItem(STORAGE_KEY, '{isso não é json válido');
    expect(loadSession()).toBeNull();
  });

  test('loadSession retorna null quando o board salvo não é uma matriz válida', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ score: 10 }));
    expect(loadSession()).toBeNull();
  });

  test('clearSession remove a sessão salva', () => {
    saveSession({ board: [[0]], score: 0, status: 'playing', infiniteMode: false, pendingChallenge: null });
    clearSession();
    expect(loadSession()).toBeNull();
  });
});
