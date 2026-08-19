const { t } = require('../../www/js/i18n/i18n');

describe('i18n', () => {
  test('t() traduz uma chave conhecida', () => {
    expect(t('hud.btnNewGame')).toBe('Novo jogo');
  });

  test('t() retorna a própria chave como fallback quando não encontrada', () => {
    expect(t('chave.inexistente')).toBe('chave.inexistente');
  });
});
