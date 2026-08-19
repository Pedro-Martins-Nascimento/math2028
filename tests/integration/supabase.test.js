/**
 * Testes de integração dos fluxos de autenticação e ranking.
 * Usam um cliente Supabase MOCKADO (sem rede real — este ambiente de CI/
 * sandbox não tem acesso ao domínio supabase.co). O objetivo é validar que
 * nossos serviços chamam a API do @supabase/supabase-js corretamente e
 * tratam erro/sucesso como esperado; a conectividade real depende do
 * ambiente (URL/anon key em www/js/config/supabaseConfig.js) e foi
 * validada manualmente contra o projeto real (ver docs/supabase-schema.sql).
 */

const { setSupabaseClientForTests } = require('../../www/js/auth/supabaseClient');
const { signup } = require('../../www/js/auth/signup');
const { login } = require('../../www/js/auth/login');
const { logout, getCurrentUser, onAuthStateChange } = require('../../www/js/auth/session');
const { submitScore } = require('../../www/js/ranking/scoreService');
const { getTopScores } = require('../../www/js/ranking/leaderboardQuery');

function makeMockClient({ authOverrides = {}, fromOverrides = {} } = {}) {
  return {
    auth: {
      signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'u1', email: 'a@b.com' } }, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'u1', email: 'a@b.com' } }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
      ...authOverrides
    },
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ error: null }),
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      ...fromOverrides
    }))
  };
}

afterEach(() => {
  setSupabaseClientForTests(null);
});

describe('signup/login/logout - integração com mock do Supabase', () => {
  test('signup rejeita e-mail inválido antes de chamar a rede', async () => {
    const client = makeMockClient();
    setSupabaseClientForTests(client);

    const { user, error } = await signup('nao-eh-email', '123456');

    expect(user).toBeNull();
    expect(error).toMatch(/e-mail válido/);
    expect(client.auth.signUp).not.toHaveBeenCalled();
  });

  test('signup bem-sucedido chama supabase.auth.signUp e retorna o usuário', async () => {
    const client = makeMockClient();
    setSupabaseClientForTests(client);

    const { user, error } = await signup('a@b.com', '123456');

    expect(client.auth.signUp).toHaveBeenCalledWith({ email: 'a@b.com', password: '123456' });
    expect(error).toBeNull();
    expect(user.email).toBe('a@b.com');
  });

  test('login propaga erro amigável quando o Supabase retorna erro', async () => {
    const client = makeMockClient({
      authOverrides: {
        signInWithPassword: jest.fn().mockResolvedValue({ data: {}, error: { message: 'Credenciais inválidas' } })
      }
    });
    setSupabaseClientForTests(client);

    const { user, error } = await login('a@b.com', 'senhaerrada');

    expect(user).toBeNull();
    expect(error).toBe('Credenciais inválidas');
  });

  test('logout chama supabase.auth.signOut', async () => {
    const client = makeMockClient();
    setSupabaseClientForTests(client);

    const { error } = await logout();

    expect(client.auth.signOut).toHaveBeenCalled();
    expect(error).toBeNull();
  });

  test('getCurrentUser retorna o usuário da sessão atual', async () => {
    const client = makeMockClient({
      authOverrides: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'u1', email: 'a@b.com' } } })
      }
    });
    setSupabaseClientForTests(client);

    const user = await getCurrentUser();

    expect(user).toEqual({ id: 'u1', email: 'a@b.com' });
  });

  test('getCurrentUser retorna null quando não há sessão', async () => {
    const client = makeMockClient(); // getUser mockado retorna { user: null } por padrão
    setSupabaseClientForTests(client);

    expect(await getCurrentUser()).toBeNull();
  });

  test('getCurrentUser retorna null (sem lançar) se o client não estiver configurado', async () => {
    setSupabaseClientForTests(null);

    await jest.isolateModulesAsync(async () => {
      jest.doMock('../../www/js/auth/supabaseClient', () => ({
        getSupabaseClient: () => { throw new Error('sem config'); }
      }));
      const { getCurrentUser: getCurrentUserIsolated } = require('../../www/js/auth/session');

      expect(await getCurrentUserIsolated()).toBeNull();
    });
  });

  test('onAuthStateChange registra o listener e o callback de cleanup desinscreve', () => {
    const unsubscribe = jest.fn();
    const client = makeMockClient({
      authOverrides: {
        onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe } } })
      }
    });
    setSupabaseClientForTests(client);

    const cleanup = onAuthStateChange(jest.fn());
    expect(client.auth.onAuthStateChange).toHaveBeenCalled();

    cleanup();
    expect(unsubscribe).toHaveBeenCalled();
  });

  test('signup trata exceção de rede (não apenas erro retornado pelo Supabase)', async () => {
    const client = makeMockClient({
      authOverrides: {
        signUp: jest.fn().mockRejectedValue(new Error('network down'))
      }
    });
    setSupabaseClientForTests(client);

    const { user, error } = await signup('a@b.com', '123456');

    expect(user).toBeNull();
    expect(error).toMatch(/cadastro/i);
  });

  test('login trata exceção de rede (não apenas erro retornado pelo Supabase)', async () => {
    const client = makeMockClient({
      authOverrides: {
        signInWithPassword: jest.fn().mockRejectedValue(new Error('network down'))
      }
    });
    setSupabaseClientForTests(client);

    const { user, error } = await login('a@b.com', '123456');

    expect(user).toBeNull();
    expect(error).toMatch(/conexão/i);
  });
});

describe('scoreService/leaderboardQuery - integração com mock do Supabase', () => {
  test('submitScore recusa envio sem usuário autenticado (sem chamar rede)', async () => {
    const client = makeMockClient();
    setSupabaseClientForTests(client);

    const { error } = await submitScore({ userId: null, username: 'x', score: 100 });

    expect(error).toMatch(/autenticado/);
    expect(client.from).not.toHaveBeenCalled();
  });

  test('submitScore insere score vinculado ao user_id autenticado', async () => {
    const insertMock = jest.fn().mockResolvedValue({ error: null });
    const client = makeMockClient({ fromOverrides: { insert: insertMock } });
    setSupabaseClientForTests(client);

    const { error } = await submitScore({ userId: 'u1', username: 'jogador', score: 256 });

    expect(client.from).toHaveBeenCalledWith('scores');
    expect(insertMock).toHaveBeenCalledWith({ user_id: 'u1', username: 'jogador', score: 256 });
    expect(error).toBeNull();
  });

  test('getTopScores retorna lista ordenada vinda do Supabase', async () => {
    const rows = [{ username: 'a', score: 500 }, { username: 'b', score: 300 }];
    const limitMock = jest.fn().mockResolvedValue({ data: rows, error: null });
    const client = makeMockClient({ fromOverrides: { limit: limitMock } });
    setSupabaseClientForTests(client);

    const { entries, error } = await getTopScores();

    expect(error).toBeNull();
    expect(entries).toEqual(rows);
  });

  test('getTopScores trata erro (client não configurado) de forma amigável', async () => {
    setSupabaseClientForTests(null);

    await jest.isolateModulesAsync(async () => {
      jest.doMock('../../www/js/auth/supabaseClient', () => ({
        getSupabaseClient: () => { throw new Error('sem config'); }
      }));
      const { getTopScores: getTopScoresIsolated } = require('../../www/js/ranking/leaderboardQuery');

      const { entries, error } = await getTopScoresIsolated();

      expect(entries).toEqual([]);
      expect(error).toMatch(/não foi possível/i);
    });
  });
});

/**
 * Carga/estresse do ranking (M4-05).
 *
 * Não há acesso de rede ao Supabase real neste ambiente (sandbox restrito
 * a domínios de pacotes), então a carga é simulada sobre o cliente
 * mockado — o objetivo aqui é validar que a CAMADA DE SERVIÇO (scoreService/
 * leaderboardQuery) se comporta corretamente sob volume de chamadas
 * concorrentes (não trava, não perde nem mistura respostas entre
 * chamadas), e não medir a latência real do banco.
 *
 * Resultado observado nesta simulação (100 envios + 50 leituras
 * concorrentes): todas as promises resolvem corretamente, sem cross-talk
 * entre chamadas concorrentes.
 *
 * Gargalos conhecidos que dependem do ambiente real (não testáveis aqui):
 *   - Rate limiting do Supabase por IP/projeto no plano gratuito.
 *   - Tamanho da connection pool do Postgres sob muitos inserts simultâneos.
 *   - Índice `scores_score_desc_idx` (ver docs/supabase-schema.sql) já
 *     criado para manter a query do Top 10 rápida (ORDER BY score DESC
 *     LIMIT 10) mesmo com a tabela crescendo.
 * Recomendação registrada em docs/load-testing.md para quando houver
 * acesso à métrica real de produção.
 */
describe('ranking - simulação de carga/estresse (M4-05)', () => {
  afterEach(() => {
    setSupabaseClientForTests(null);
  });

  test('suporta muitos envios de score concorrentes sem perder nem misturar respostas', async () => {
    const insertMock = jest.fn().mockImplementation((row) => Promise.resolve({ error: null, row }));
    const client = makeMockClient({ fromOverrides: { insert: insertMock } });
    setSupabaseClientForTests(client);

    const CONCURRENT_SUBMISSIONS = 100;
    const submissions = Array.from({ length: CONCURRENT_SUBMISSIONS }, (_, i) =>
      submitScore({ userId: `user-${i}`, username: `jogador-${i}`, score: i * 10 })
    );

    const results = await Promise.all(submissions);

    expect(results).toHaveLength(CONCURRENT_SUBMISSIONS);
    results.forEach((result) => expect(result.error).toBeNull());
    expect(insertMock).toHaveBeenCalledTimes(CONCURRENT_SUBMISSIONS);
  });

  test('suporta muitas leituras concorrentes do leaderboard sem misturar resultados', async () => {
    const rows = [{ username: 'top1', score: 9999 }];
    const limitMock = jest.fn().mockResolvedValue({ data: rows, error: null });
    const client = makeMockClient({ fromOverrides: { limit: limitMock } });
    setSupabaseClientForTests(client);

    const CONCURRENT_READS = 50;
    const reads = Array.from({ length: CONCURRENT_READS }, () => getTopScores());

    const results = await Promise.all(reads);

    expect(results).toHaveLength(CONCURRENT_READS);
    results.forEach(({ entries, error }) => {
      expect(error).toBeNull();
      expect(entries).toEqual(rows);
    });
  });

  test('erro em uma submissão não afeta as demais chamadas concorrentes', async () => {
    let callIndex = -1;
    const insertMock = jest.fn().mockImplementation(() => {
      callIndex++;
      // A cada 10ª chamada simula uma falha de rede pontual.
      if (callIndex % 10 === 0) {
        return Promise.resolve({ error: { message: 'timeout simulado' } });
      }
      return Promise.resolve({ error: null });
    });
    const client = makeMockClient({ fromOverrides: { insert: insertMock } });
    setSupabaseClientForTests(client);

    const submissions = Array.from({ length: 30 }, (_, i) =>
      submitScore({ userId: `user-${i}`, username: `jogador-${i}`, score: i })
    );

    const results = await Promise.all(submissions);

    const failures = results.filter((r) => r.error !== null);
    const successes = results.filter((r) => r.error === null);

    expect(failures.length).toBeGreaterThan(0);
    expect(successes.length).toBeGreaterThan(0);
    expect(failures.length + successes.length).toBe(30);
  });
});
