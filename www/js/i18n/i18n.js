/**
 * Estrutura i18n-ready: centraliza os textos da UI num dicionário por
 * idioma, para que adicionar um novo idioma no futuro seja só criar uma
 * nova chave em LOCALES (ex.: 'en') e traduzir os valores — sem precisar
 * tocar nos componentes de UI, que só chamam t('chave').
 *
 * Ainda não há seletor de idioma na UI (fora do escopo do M4); o idioma
 * ativo é sempre 'pt-BR'. Isso é o que "pronto para tradução futura"
 * significa aqui (M4-03).
 */

const LOCALES = {
  'pt-BR': {
    'hud.title': 'Math2048',
    'hud.scoreLabel': 'Pontos',
    'hud.btnRanking': 'Ranking',
    'hud.btnLogin': 'Entrar',
    'hud.btnLogout': 'Sair',
    'hud.btnNewGame': 'Novo jogo',
    'footer.hint': 'Junte os blocos e resolva as equações para avançar.',
    'gameOver.title': 'Fim de jogo',
    'gameOver.text': 'Você não tem mais movimentos possíveis. Pontuação final:',
    'gameOver.btnRestart': 'Jogar novamente',
    'win.title': 'Você venceu! 🎉',
    'win.text': 'Você alcançou o bloco 2048! Pontuação:',
    'win.btnContinue': 'Continuar jogando',
    'win.btnStop': 'Encerrar',
    'equation.titlePrefix': 'Bloco',
    'equation.titleSuffix': '! Resolva para continuar',
    'equation.btnSubmit': 'Responder',
    'equation.errorWrong': 'Resposta incorreta. Tente novamente.',
    'auth.titleLogin': 'Entrar',
    'auth.titleSignup': 'Criar conta',
    'auth.emailPlaceholder': 'E-mail',
    'auth.passwordPlaceholder': 'Senha',
    'auth.btnLogin': 'Entrar',
    'auth.btnSignup': 'Cadastrar',
    'auth.toggleToSignup': 'Criar uma conta',
    'auth.toggleToLogin': 'Já tenho conta',
    'auth.skip': 'Jogar sem conta',
    'leaderboard.title': 'Ranking global — Top 10',
    'leaderboard.loading': 'Carregando...',
    'leaderboard.empty': 'Nenhuma pontuação registrada ainda.',
    'leaderboard.btnClose': 'Fechar'
  }
};

const activeLocale = 'pt-BR';

/**
 * Traduz uma chave para o idioma ativo.
 * @param {string} key
 * @returns {string} a string traduzida, ou a própria chave se não encontrada
 *   (fallback visível em vez de UI quebrada, útil durante a expansão do
 *   dicionário).
 */
function t(key) {
  return LOCALES[activeLocale][key] ?? key;
}

module.exports = { t, LOCALES, activeLocale };
