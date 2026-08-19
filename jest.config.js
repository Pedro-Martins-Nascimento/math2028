module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['www/js/core/**/*.js', 'www/js/gatekeeper/**/*.js', 'www/js/input/**/*.js', 'www/js/storage/**/*.js', 'www/js/i18n/**/*.js', 'www/js/auth/**/*.js', 'www/js/ranking/**/*.js'],
  verbose: true
};
