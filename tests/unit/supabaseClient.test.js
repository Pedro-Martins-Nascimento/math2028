const { getSupabaseClient, setSupabaseClientForTests } = require('../../www/js/auth/supabaseClient');

describe('supabaseClient', () => {
  afterEach(() => {
    setSupabaseClientForTests(null);
  });

  test('getSupabaseClient retorna sempre a mesma instância (singleton)', () => {
    const fakeClient = { auth: {}, from: () => {} };
    setSupabaseClientForTests(fakeClient);

    expect(getSupabaseClient()).toBe(fakeClient);
    expect(getSupabaseClient()).toBe(getSupabaseClient());
  });

  test('lança um erro claro quando não há configuração e nenhum client foi injetado', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock('../../www/js/config/supabaseConfig', () => {
        throw new Error('Cannot find module');
      }, { virtual: true });

      const { getSupabaseClient: getSupabaseClientIsolated } = require('../../www/js/auth/supabaseClient');

      expect(() => getSupabaseClientIsolated()).toThrow(/não configurado/i);
    });
  });

  test('cria um client real (sem lançar) quando a config tem URL e anon key válidas', async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock('../../www/js/config/supabaseConfig', () => ({
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_ANON_KEY: 'fake-anon-key'
      }), { virtual: true });

      const { getSupabaseClient: getSupabaseClientIsolated } = require('../../www/js/auth/supabaseClient');

      const client = getSupabaseClientIsolated();
      expect(client).toBeTruthy();
      expect(typeof client.auth.signInWithPassword).toBe('function');
    });
  });
});
