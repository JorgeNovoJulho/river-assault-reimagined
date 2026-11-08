# Atualizações do RiverStorm

As versões instaladas consultam a release estável mais recente ao abrir o jogo. A opção **Configurações → Atualizações do jogo** permite repetir a verificação. O diálogo mostra a versão instalada e a candidata e pede confirmação antes do download.

## Publicar

1. Envie o código ao GitHub. Crie e envie uma tag estável crescente no formato `vMAJOR.MINOR.PATCH`, por exemplo `v0.2.0`. O workflow **Publicar atualização assinada do RiverStorm** também pode ser disparado manualmente para uma tag existente que ainda não tenha release.
2. A automação compila o instalador Windows x64 e o APK Android, assina os pacotes e monta os manifestos. Ela publica a release como a mais recente depois de anexar os arquivos.
3. Distribua uma primeira instalação assinada que já inclua o atualizador. As versões anteriores precisam receber esse primeiro instalador manualmente.

### Assinaturas no GitHub Actions

- Variável `RIVER_UPDATE_PUBLIC_KEY` com o conteúdo da chave pública do atualizador Tauri. Gere o par com `npx tauri signer generate -w CAMINHO_DA_CHAVE`. Cadastre `TAURI_SIGNING_PRIVATE_KEY` como secret e, se houver senha, `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.
- Variável `RIVER_ANDROID_KEY_ALIAS`. Cadastre como secrets `RIVER_ANDROID_KEYSTORE` (arquivo de keystore de release em Base64), `RIVER_ANDROID_STORE_PASSWORD` e `RIVER_ANDROID_KEY_PASSWORD`.
- Preserve as chaves entre releases. Para atualização de uma instalação Android existente, a identidade `com.riverstorm.game` e a assinatura do APK precisam corresponder à instalação. O APK de teste usa assinatura de debug e não é o canal de atualização de produção.

## Instalação

No Windows, o Tauri verifica a assinatura do instalador antes de executá-lo. No Android, o jogo verifica o hash, o pacote, a versão e a assinatura do APK baixado e abre o instalador do sistema. Se for necessário permitir instalações desta origem, volte ao jogo depois de habilitar a permissão e confirme novamente. O Android ainda pede a confirmação do próprio sistema.

Um commit no GitHub por si só não é um pacote instalável. A prévia web continua sendo servida pelo navegador.

- [Documentação do atualizador do Tauri](https://v2.tauri.app/plugin/updater/)
- [Assinatura e atualizações Android](https://developer.android.com/studio/publish/app-signing)
