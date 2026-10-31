# RiverStorm — Mapa de upload de sprites candidatos

## Confirmação técnica
Pranchas verificadas em `assets/sprites/premium/referencias-aprovadas/boards/`:
- `Biblioteca Arcade de Sprites Riverstorm.png`
- `Biblioteca de Bosses Riverstorm.png`
- `boss02_encouracado_abissal_board_a.png`
- `boss02_encouracado_abissal_board_b.png`
- `bosses_library_20_v2.png`
- `inimigos_cenarios_v41.png`
- `level01_rio_verde_boss01_ponte_fortificada.png.png` (extensão dupla mantida para preservar o original)
- `rio_atlas_cenario_efeitos_final.png`

## Destino de upload
- Boss 01: `assets/sprites/premium/candidates/bosses/01_ponte_fortificada/`
- Boss 02: `assets/sprites/premium/candidates/bosses/02_encouracado_abissal/`
- Rio Verde: `assets/sprites/premium/candidates/environment/01_rio_verde/`
- Inimigos: `assets/sprites/premium/candidates/enemies/`
- Efeitos: `assets/sprites/premium/candidates/fx/`

## Status real
As subpastas acima foram inicializadas com README. Recortes PNG candidatos ainda **não foram enviados** para este repositório na data desta revisão. O ZIP separado contém recortes por seção e candidatos; estes arquivos devem ser inspecionados individualmente para remoção de fundo/legendas, verificação de dimensão e aprovação, antes de serem copiados para `runtime/`. Não ativar placeholders ou imagens compostas no jogo.

## Ordem de validação
1. Boss 01, peças, fases de dano e tiros.
2. Boss 02, corpo/torres/armamentos/fases.
3. Água/margens/reflexos do Setor 01; verificar continuidade.
4. Inimigos e efeitos.
5. Conferência de resolução, escala relativa à nave, limites do leito, colisões, FPS e builds.
