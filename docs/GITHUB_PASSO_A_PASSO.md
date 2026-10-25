# Tutorial do GitHub — projeto já iniciado

Repositório: https://github.com/JorgeNovoJulho/river-assault-reimagined

## Para baixar o código
1. Abra o repositório.
2. Clique em **Code** > **Download ZIP**.
3. Descompacte em uma pasta de trabalho.

## Para testar o jogo atual
Abra `index.html` no navegador. Esta é uma versão HTML Canvas 2D, não um APK/EXE.

## Para desenvolver com GitHub Desktop
1. Baixe https://desktop.github.com/ e entre na conta JorgeNovoJulho.
2. Escolha **File** > **Clone repository**.
3. Selecione `JorgeNovoJulho/river-assault-reimagined` e uma pasta no computador.
4. Altere arquivos dentro dessa pasta e salve.
5. No GitHub Desktop, confira a lista de arquivos alterados.
6. Escreva uma mensagem curta em **Summary**, clique **Commit to main** e depois **Push origin**.
7. No site, abra a aba **Actions** para verificar a compilação da versão web.

## Para instalar dependências e testar build web
Instale https://nodejs.org/ (LTS) e, no terminal aberto dentro da pasta clonada, use:
```bash
npm install
npm run dev
npm run build
```

## Segurança
O repositório foi detectado como **público**. Configurações de visibilidade ficam em **Settings > General > Danger Zone > Change repository visibility** (requer permissões). Não envie senhas, tokens, assinatura Android, chaves Tauri, nem fotos privadas de jogadores.

## Próximas fases
Os projetos Android/Tauri, seus instaladores e atualizadores ainda serão criados e testados. Não confundir push do GitHub com atualização de aplicativos instalados.
