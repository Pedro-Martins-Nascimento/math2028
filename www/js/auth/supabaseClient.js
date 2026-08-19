/**
 * Inicialização do cliente Supabase. Não implementa login, ranking nem UI
 * (ver auth/ e ranking/) — apenas prepara o cliente para ser consumido
 * pelas telas de autenticação.
 *
 * As chamadas de rede do Supabase são sempre assíncronas e não bloqueiam
 * o processamento local do jogo (RNF-03) — este módulo nunca é chamado de
 * forma síncrona a partir do motor do jogo (core/).
 */

const { createClient } = require('@supabase/supabase-js');

let cachedClient = null;

/**
 * Carrega a config do Supabase. Retorna null se o arquivo local
 * (supabaseConfig.js, gitignored) ainda não foi criado a partir do
 * supabaseConfig.example.js.
 * @returns {{SUPABASE_URL: string, SUPABASE_ANON_KEY: string}|null}
 */
function loadConfig() {
  try {
    // eslint-disable-next-line global-require
    return require('../config/supabaseConfig');
  } catch (error) {
    return null;
  }
}

/**
 * Retorna a instância única (singleton) do cliente Supabase, criando-a na
 * primeira chamada.
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 * @throws {Error} se a configuração não estiver presente.
 */
function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const config = loadConfig();
  if (!config || !config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase não configurado. Copie www/js/config/supabaseConfig.example.js ' +
      'para supabaseConfig.js e preencha SUPABASE_URL e SUPABASE_ANON_KEY.'
    );
  }

  cachedClient = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });

  return cachedClient;
}

/**
 * Permite injetar/zerar o cliente em testes, sem depender de config real.
 * @param {import('@supabase/supabase-js').SupabaseClient|null} client
 */
function setSupabaseClientForTests(client) {
  cachedClient = client;
}

module.exports = { getSupabaseClient, setSupabaseClientForTests };
