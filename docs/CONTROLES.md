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

## Próximas melhorias
- Tela de configuração para remapear teclas e botões.
- Indicador de controle conectado e opção de ocultar controles virtuais quando gamepad estiver ativo.
- Perfil de sensibilidade/deadzone e calibração.
- Menu navegável inteiramente por controle.
- Testes de múltiplos gamepads e reconexão.
