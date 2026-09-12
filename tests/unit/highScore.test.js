const { STORAGE_KEY, getHighScore, updateHighScore } = require('../../www/js/storage/highScore');

describe('highScore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('getHighScore retorna 0 quando não há nada salvo', () => {
    expect(getHighScore()).toBe(0);
  });

  test('updateHighScore salva e retorna a pontuação quando ela supera o recorde', () => {
    expect(updateHighScore(100)).toBe(100);
    expect(getHighScore()).toBe(100);
  });

  test('updateHighScore mantém o recorde quando a pontuação é menor ou igual', () => {
    updateHighScore(100);
    expect(updateHighScore(50)).toBe(100);
    expect(updateHighScore(100)).toBe(100);
    expect(getHighScore()).toBe(100);
  });

  test('getHighScore retorna 0 para um valor corrompido, sem lançar erro', () => {
    localStorage.setItem(STORAGE_KEY, 'não-é-um-número');
    expect(getHighScore()).toBe(0);
  });
});
