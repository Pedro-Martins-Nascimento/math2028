# Ícones e splash screen (Android)

Esta pasta segue a convenção padrão do Cordova para recursos de plataforma
(`res/icon/android/`, `res/screen/android/`), mas **ainda não contém os
PNGs finais** — nenhum recurso de design (logo, splash) foi fornecido até
o momento.

`config.xml` **não referencia nenhum arquivo aqui** propositalmente: uma
referência a um PNG inexistente quebra `cordova build android` com um erro
de arquivo não encontrado. Antes de gerar o build de produção (fora do
escopo do M4, que cobre só o setup básico), adicione:

- `res/icon/android/`: ícones nas densidades padrão do Android
  (`ldpi` 36x36, `mdpi` 48x48, `hdpi` 72x72, `xhdpi` 96x96, `xxhdpi` 144x144,
  `xxxhdpi` 192x192)
- `res/screen/android/`: splash screens (ver
  [docs do cordova-android](https://cordova.apache.org/docs/en/latest/config_ref/images.html))

Depois de adicionar os PNGs, inclua em `config.xml` (dentro de
`<platform name="android">`):

```xml
<icon density="ldpi" src="res/icon/android/ldpi.png" />
<icon density="mdpi" src="res/icon/android/mdpi.png" />
<icon density="hdpi" src="res/icon/android/hdpi.png" />
<icon density="xhdpi" src="res/icon/android/xhdpi.png" />
<icon density="xxhdpi" src="res/icon/android/xxhdpi.png" />
<icon density="xxxhdpi" src="res/icon/android/xxxhdpi.png" />
```
