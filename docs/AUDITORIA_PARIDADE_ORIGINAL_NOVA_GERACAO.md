# Auditoria de paridade — RiverStorm Original × Nova Geração (26/10/2026)

## Decisão estrutural
O arquivo principal `index.html` da Nova Geração foi reconstruído a partir da versão exata da `main`, com **apenas** a inserção do botão separado de comparação de gráficos antes do `</body>`. O restante do conteúdo do arquivo é idêntico ao original. Commit: `3317ee2a`.

Essa decisão restaura sem reimplementar:
- Condição de disparo do RED ALERT e contadores de missão.
- Pausa `BOSS_SELECT` e painel de habilidades.
- Seleção obrigatória (inclusive `LUTAR SEM PODER`) e confirmação.
- Equipamento, cargas, recargas, afinidades e habilidades especiais de chefes.
- Inicialização do chefe e retorno ao fluxo `PLAYING`.
- Progressão entre missões, munição/bombas e seus estados.
- Controles, combate, danos, efeitos e transições definidos no HTML.

## Comparação dos módulos principais (SHA de conteúdo idêntico)
- `src/game/aircraft.js` — idêntico.
- `src/game/clock.js` — idêntico.
- `src/game/pilot-progress.js` — idêntico.
- `src/game/campaign.js` — idêntico.
- `src/input/gamepad.js` — idêntico.
- `src/audio/music.js` — idêntico.
- `src/audio/sfx-modern.js` — idêntico.

## Diferenças intencionais e mantidas isoladas
- `src/render/scene2d5.js` — modernização gráfica, sprites e composição.
- `src/audio/playlist.js` — alterações de carregamento, caminhos `public/music/`, recuperação de reprodução.

## Não homologado
- A equivalência acima é estática, baseada em arquivos e hashes. Não prova que o RED ALERT, o áudio, os 20 chefes ou todas as missões funcionam em navegador.
- Fazer testes reais da transição RED ALERT → escolha → confirmação → batalha → vitória → próxima missão.
- Fazer teste real das 14 músicas, incluindo faixa de chefe, carregamento inicial, retomada e codec.
- Validar erros JavaScript e consumo de memória/FPS antes de aprovar o produto final.

## Regra de continuidade
Não alterar novamente a máquina de estados/chefes do `index.html` sem teste que demonstre defeito no código original e revisão explícita da diferença. Melhorias visuais devem ocorrer no renderizador independente.
