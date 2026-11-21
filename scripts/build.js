const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

let supabaseUrl = process.env.SUPABASE_URL || '';
let supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  const localConfigPath = path.join(__dirname, '../www/js/config/supabaseConfig.js');
  if (fs.existsSync(localConfigPath)) {
    try {
      const localConfig = require(localConfigPath);
      supabaseUrl = supabaseUrl || localConfig.SUPABASE_URL || '';
      supabaseAnonKey = supabaseAnonKey || localConfig.SUPABASE_ANON_KEY || '';
    } catch (e) {
      // Ignorar se falhar
    }
  }
}

esbuild.build({
  entryPoints: ['www/js/main.js'],
  bundle: true,
  target: 'es2018',
  minify: true,
  outfile: 'www/dist/bundle.js',
  format: 'iife',
  define: {
    'process.env.SUPABASE_URL': JSON.stringify(supabaseUrl),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey)
  }
}).then(() => {
  console.log('Build prod concluído com sucesso!');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
