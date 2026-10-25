# Música durante a partida — primeiro playtest

## Estado
O jogo inclui um reprodutor MP3 offline em `src/audio/playlist.js`. No momento ele **não contém músicas comerciais embutidas** no código ou APK.

## Como adicionar as quatro músicas recebidas
1. Instale e abra o APK mais recente.
2. Na parte superior toque **MÚSICAS**.
3. Selecione todos os arquivos MP3 desejados no celular (extraia o ZIP se estiver usando o pacote compartilhado).
4. Toque em **INICIAR JOGO**. Uma fila aleatória é montada a cada partida.
5. Quando a faixa terminar, a próxima começa. **PRÓXIMA** pula a atual; **MÚSICA** pausa ou retoma as faixas.
6. Ao pausar ou finalizar o jogo, a música pausa. Ela retoma quando a partida continua.

As faixas importadas permanecem no armazenamento IndexedDB do aplicativo. Desinstalar o APK, limpar dados ou usar chaves diferentes em versões debug pode apagar a biblioteca; nesses casos, reimporte os arquivos.

## Quatro arquivos recebidos
- Airwolf Main Theme 2026 - The 80s Guy Official.mp3
- Airwolf - Theme (HQ Audio) - NKstudio73.mp3
- Airwolf Theme Below the Radar Synthwave Cyberpunk Cover - OmniSonic Horizon.mp3
- Airwolf Theme (Ethereal Instrumental Remix) Epic 80s Nostalgia AI BEATS.mp3

A quinta faixa informada pelo usuário não consta entre os arquivos efetivamente montados na conversa. Ela pode ser importada posteriormente do dispositivo.

## Distribuição
As músicas foram enviadas para análise pelo usuário, mas isso não estabelece uma licença para redistribuí-las publicamente. Antes de incluir faixas de terceiros em APKs públicos ou repositórios, verificar permissões dos titulares. O importador local mantém os áudios no dispositivo do jogador e permite testes sem publicar as gravações no GitHub.
