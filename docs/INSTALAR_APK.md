# Instalar APK de teste no Android

O APK de teste é compilado **no próprio GitHub Actions** e é diferente da versão web. Não é necessário instalar Android Studio no computador para baixá-lo.

1. Acesse https://github.com/JorgeNovoJulho/river-assault-reimagined/actions/workflows/android-apk.yml
2. Abra a execução **Gerar APK Android de teste** que estiver marcada com símbolo verde.
3. Role até **Artifacts**.
4. Clique **RiverAssault-Android-APK-Teste**. O GitHub entrega um arquivo ZIP contendo `app-debug.apk`.
5. Extraia o ZIP no computador ou no Android e transfira apenas o `app-debug.apk` para o celular.
6. Abra o arquivo no Android e confirme a instalação somente se confiar na origem. É possível que o Android peça autorização temporária para **instalar aplicativos desconhecidos**; o caminho exato varia por aparelho e versão. Não desligue o Play Protect nem outras proteções.

**Nota sobre Chrome e downloads:** o Chrome ou o Android pode alertar sobre um APK de teste que ainda não tem reputação/assinatura de distribuição. Não há um método legítimo de garantir que navegadores não emitam alertas para um APK debug. O fluxo mais confiável de distribuição pública posterior é assinar uma versão release e publicar pela Google Play (trilha de testes ou produção).

**Limitações atuais:** compilação debug para playtest, sem distribuição Play Store, sem atualizador automático, sem homologação final e sem publicação automática em Releases. A versão de teste deve manter o mesmo ID Android e ser assinada de forma consistente nas futuras atualizações; builds debug do GitHub Actions podem usar chaves diferentes, portanto podem exigir desinstalar a versão debug anterior.
