# Trilha oficial — 14 músicas em Opus

## Conversão concluída
Os 14 MP3s do pacote enviado foram convertidos para **Opus 96 kbps VBR**, com ffmpeg/libopus, totalizando aproximadamente **38,95 MB**, contra cerca de 124,75 MB dos MP3s.

O carregador procura os arquivos `/music/track-01.opus` até `track-14.opus` relativos ao endereço do jogo (`./music/...`). Quando estiverem na pasta `public/music/`, o Vite irá copiá-los automaticamente para o HTML publicado e para os assets do APK gerado.

## PUBLICAÇÃO DOS ARQUIVOS (passo final necessário)
A conexão GitHub disponível para edição de código não transfere estes binários de 39 MB diretamente; o pacote Opus é entregue separadamente ao responsável pelo repositório.

1. Baixe e extraia o pacote **River_Assault_Trilha_14_Opus_96kbps.zip** entregue na conversa.
2. Abra https://github.com/JorgeNovoJulho/river-assault-reimagined/upload/main/public/music
3. Arraste todos os **14 arquivos .opus** da pasta extraída `public/music` (sem a pasta em si) para a página.
4. Confirme **Commit changes**. O GitHub Actions recompila e republica o jogo.
5. Confira https://jorgenovojulho.github.io/river-assault-reimagined/music/track-01.opus: deve tocar ou baixar em vez de mostrar 404.
6. Abra o jogo e entre em Configurações → Trilha musical. As 14 faixas aparecerão automaticamente; ordem aleatória é padrão; botões ▶ ↑ ↓ permitem ouvir e organizar.

Não publique arquivos de composições/gravações de terceiros sem possuir os direitos necessários. Remixar ou renomear não elimina direitos subjacentes.

## Comportamento
- Site HTML carrega Opus sob demanda; o player não precisa baixar tudo antes de começar a partida.
- Android recebe os mesmos assets no build da versão APK quando os Opus forem adicionados ao GitHub.
- Se faltar um arquivo, o carregador ignora a faixa e mantém o jogo funcional; o sintetizador original funciona como fallback.
- Importação manual de MP3/Opus permanece disponível.
- Opus em contêiner Ogg pode não ser reproduzido por alguns navegadores Apple; disponibilizar fallback AAC/MP3 caso seja necessário suporte a esses aparelhos.
