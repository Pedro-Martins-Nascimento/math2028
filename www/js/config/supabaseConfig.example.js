/**
 * Template de configuração do Supabase.
 *
 * Copie este arquivo para `supabaseConfig.js` (mesmo diretório) e preencha
 * com as credenciais reais do projeto. `supabaseConfig.js` está no
 * .gitignore e NUNCA deve ser commitado — é assim que evitamos misturar
 * credenciais no front (ver M3-01 "Não fazer").
 *
 * SUPABASE_URL: use a URL BASE do projeto (ex: https://xxxx.supabase.co),
 * sem o sufixo /rest/v1/ — o cliente @supabase/supabase-js monta o resto.
 */
module.exports = {
  SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_ANON_KEY'
};
