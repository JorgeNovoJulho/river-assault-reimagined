# Controles — teclado, mouse, touchscreen e gamepad

## Windows (navegador ou futura versão instalável)
- Setas ou WASD: direção esquerda/direita e aceleração/desaceleração.
- Espaço ou Z: atirar.
- X, F ou Shift esquerdo: bomba.
- P ou Esc: pausar/retomar.
- Mouse sobre a área do jogo: seguir posição horizontal do cursor; perto da parte superior acelera, perto da inferior desacelera.
- Botão esquerdo do mouse (manter): atirar; botão direito: bomba.
- Mouse fora da área do jogo desativa seu comando de movimento.

## Android
- Alavanca analógica virtual esquerda e botões de tiro, bomba e pausa à direita.
- Controles Bluetooth ou USB reconhecidos pelo sistema operacional podem usar a API Gamepad, desde que a WebView/navegador disponibilize o dispositivo.

## Gamepad (mapeamento inicial padrão)
- Analógico esquerdo ou D-Pad: esquerda/direita/cima/baixo.
- Botão inferior (A no estilo Xbox / X no estilo PlayStation): tiro; RB/RT também disparam.
- Botão direito (B no estilo Xbox / círculo no estilo PlayStation) ou botão esquerdo (X/quadrado): bomba (um disparo por pressão).
- Start/Options/Menu: iniciar/reiniciar ou pausar/retomar.

**Observação:** nomes e posições de botões dependem do controle e do mapeamento oferecido pelo sistema. Pareamento é feito nas configurações Bluetooth do Windows ou Android, não pelo jogo. Alguns controles genéricos, modelos antigos, Android WebViews e navegadores podem não expor os eventos como esperado. Ainda faltam testes em controles reais e nos pacotes APK e EXE.

## Implementado (ainda sem homologação em hardware real)
- Botão **CONTROLE** no topo do jogo abre painel de ajustes.
- Nome/status do gamepad conectado visível.
- Remapeamento dos botões de tiro, bomba e pausa: clicar em remapear e pressionar botão físico.
- Controle de zona morta do analógico, de 8% a 55%.
- Preferências armazenadas localmente neste navegador.
- Navegação do painel por direcional vertical; botão de tiro confirma a opção selecionada e Start fecha.

## Próximas melhorias
- Personalização de teclado/mouse e controle de múltiplos jogadores.
- Menu inicial completo navegável por gamepad, além do painel de configuração.
- Ocultação dos controles virtuais quando um gamepad está ativo (opcional).
- Testes com gamepads reais, reconexão e compatibilidade Android APK / Windows EXE.
