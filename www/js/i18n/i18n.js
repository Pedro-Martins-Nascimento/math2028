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
    'hud.title': '2048',
    'hud.scoreLabel': 'Pontos',
    'hud.recordLabel': 'Recorde',
    'hud.btnRanking': 'Ranking',
    'hud.btnLogin': 'Entrar',
    'hud.btnLogout': 'Sair',
    'hud.btnNewGame': 'Novo jogo',
    'nav.play': 'Jogar',
    'nav.ranking': 'Ranking',
    'nav.account': 'Perfil',
    'home.tagline': 'Junte blocos, vença equações e alcance o 2048!',
    'home.modeTitle': 'Modo Clássico',
    'home.modeText': 'Deslize os números, funda blocos e resolva equações surpresa na grade 4x4!',
    'home.recordLabel': 'RECORDE:',
    'home.btnPlay': 'Jogar',
    'home.btnContinue': 'Continuar Partida',
    'board.btnBack': 'Voltar',
    'footer.hint': 'Junte os números e chegue ao bloco 2048! Use as setas ou deslize para mover os blocos.',
    'gameOver.badge': '💥 Fim de Jogo!',
    'gameOver.title': 'A progressão matemática atingiu seu limite',
    'gameOver.text': 'Sua estratégia foi formidável.',
    'gameOver.scoreLabel': 'Pontuação final',
    'gameOver.recordLabel': 'Recorde',
    'gameOver.equationsLabel': 'Equações resolvidas',
    'gameOver.btnRestart': 'Jogar Novamente',
    'gameOver.btnRanking': 'Ver Ranking',
    'gameOver.quote': 'A essência da matemática reside na sua liberdade de alcançar o impossível.',
    'win.badge': '⚡ Vitória Lendária! ⚡',
    'win.title': 'Você Venceu!',
    'win.text': 'Excelência matemática alcançada — o lendário bloco 2048 foi conquistado!',
    'win.scoreLabel': 'Pontos totais',
    'win.newRecordBadge': 'Novo Recorde',
    'win.equationsLabel': 'Equações resolvidas',
    'win.btnContinue': 'Modo Infinito',
    'win.btnStop': 'Novo Jogo',
    'equation.badge': '⚡ Desafio Gatekeeper',
    'equation.xpBadge': 'Bloco',
    'equation.title': 'Desbloqueie a Fusão!',
    'equation.subtitlePrefix': 'Portal do bloco',
    'equation.subtitleSuffix': '— resolva para continuar',
    'equation.equationTag': 'Equação de 1º grau',
    'equation.inputLabel': 'Valor de',
    'equation.warning': 'Uma resposta correta é necessária para fundir blocos de nível superior.',
    'equation.hintPrefix': 'Dica:',
    'equation.btnSubmit': 'Confirmar Resposta',
    'equation.errorWrong': 'Ops! Resposta incorreta. Tente novamente.',
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
