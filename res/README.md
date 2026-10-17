# Ícones e Splash Screen (Android)

Esta pasta armazena os recursos gráficos utilizados pelo Apache Cordova para gerar o aplicativo Android do **Math2048**.

---

## 🎨 Assets Vetoriais Disponíveis

Os assets mestres foram desenhados em formato vetorial SVG, seguindo o padrão de design **Arcade Neo-Brutalism**:

- **Ícone Principal:** `res/icon/android/icon.svg` (fundo cósmico, borda ciano e badge "MATH 2048" de alto contraste).
- **Splash Screen:** `res/screen/android/splash.svg` (tela de abertura temática com mensagem de carregamento).

---

## 📱 Gerando Densidades PNG para o Cordova

Para o empacotamento completo do APK (`cordova build android`), o Android utiliza densidades específicas de tela. Caso deseje converter os SVGs para PNGs rasterizados:

### Densidades de Ícone (`res/icon/android/`):
- `ldpi.png`: 36 × 36 px
- `mdpi.png`: 48 × 48 px
- `hdpi.png`: 72 × 72 px
- `xhdpi.png`: 96 × 96 px
- `xxhdpi.png`: 144 × 144 px
- `xxxhdpi.png`: 192 × 192 px

### Densidades de Splash Screen (`res/screen/android/`):
- `drawable-port-hdpi-screen.png`: 480 × 800 px
- `drawable-port-xhdpi-screen.png`: 720 × 1280 px
- `drawable-port-xxhdpi-screen.png`: 960 × 1600 px
- `drawable-port-xxxhdpi-screen.png`: 1280 × 1920 px

Após gerar os arquivos PNG, inclua o mapeamento correspondente dentro da tag `<platform name="android">` no arquivo `config.xml`.
