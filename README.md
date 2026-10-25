# River Assault Reimagined

Projeto independente de jogo arcade aéreo, inspirado na mecânica de clássicos do gênero. **Não afiliado a River Raid.**

## Estado atual
A base jogável foi fornecida originalmente em HTML Canvas 2D. O pacote de migração está preparado para envio ao repositório, mas **o jogo completo ainda não foi publicado neste repositório**. Nenhum APK ou EXE final foi gerado.

## Estrutura planejada
- `index.html`: protótipo jogável para navegador.
- `legacy/`: versão original preservada.
- `docs/`: design de jogo, 20 fases e roadmap.
- `package.json`: scripts Vite, Capacitor e Tauri.
- `.github/workflows/`: verificação automática da compilação web.

## Próximo passo para completar o envio
1. Descompacte o arquivo `river-assault-github-starter.zip` recebido na conversa.
2. Abra [Adicionar arquivos](https://github.com/JorgeNovoJulho/river-assault-reimagined/upload/main).
3. Arraste **o conteúdo da pasta** `river-assault-project` (inclusive subpastas), não o arquivo ZIP.
4. Se o GitHub informar que `README.md` já existe, omita esse arquivo da remessa e mantenha o README publicado aqui.
5. Confirme o commit na branch `main`.
6. Abra a aba [Actions](https://github.com/JorgeNovoJulho/river-assault-reimagined/actions) para conferir o build.

## Meta técnica
Núcleo único de gameplay para Windows (Tauri) e Android (Capacitor), gráficos 2.5D adaptativos, três aeronaves, vinte fases não lineares, perfis gráficos de baixo custo e lançamentos assinados em GitHub Releases / Play Store.

**Atenção:** nem compilação nativa, nem assinatura de apps, nem atualização automática estão prontas. Essas funcionalidades exigem etapas de implementação e validação próprias.

## Segurança
Não publique segredos, keystores, chaves de assinatura nem dados privados. Imagens de jogadores e músicas locais deverão permanecer privadas por padrão.