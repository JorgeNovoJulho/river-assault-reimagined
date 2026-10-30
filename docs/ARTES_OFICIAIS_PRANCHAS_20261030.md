# RiverStorm — Pranchas de referência aprovadas (30/10/2026)

## Regra de integração
As oito pranchas fornecidas pelo usuário nesta conversa são **referências oficiais de arte**. Não tratá-las como PNGs de sprites recortados automaticamente. Elas contêm textos, painéis, fundos e conjuntos de personagens. É necessário extrair imagens individuais em RGBA com alfa transparente real, validar direção (vista superior para campanha), dimensões, margens e animação antes de integrar.

## Pranchas recebidas na conversa
1. Nível 01 — Rio Verde / Boss 01 Ponte Fortificada: sprite completo, módulos, 8 quadros de movimento, danos, canhões, torres, projéteis, explosões, HUD.
2. Boss 02 — Encouraçado Abissal: corpo, torres e canhões separados, quatro fases, animações e ataques.
3. Biblioteca completa de bosses: vinte identidades, poses e quadros de exemplo.
4. Biblioteca Arcade de Sprites: inimigos exclusivos e recorrentes, cenários, tiros, itens.
5. Biblioteca de Bosses: vinte designs e modelos de sete aeronaves.
6. Biblioteca de Sprites: inimigos, pontes/represas, objetos, cenários, FX e coletáveis.
7. Boss 02 — atlas de movimentos, ataques, danos e destruição.
8. Atlas de cenário e efeitos — Rio: correnteza, ribanceiras, espuma, detritos e explosões.

## Atenção à coerência
Há diferenças entre nomes/numeração de setores e bosses em algumas pranchas. Antes de substituir sprites, cruzar com a identidade realmente definida no núcleo do jogo e preservar a arte aprovada pela missão correspondente. Não trocar a identidade de um boss baseando-se apenas no índice visual da prancha.

## Estado atual
O código do Setor 1 já utiliza alguns PNGs premium no caminho `assets/sprites/premium/runtime/`, porém faltam integrar diversos quadros de animação, outras aeronaves, estruturas e HUD. Não declarar as 8 pranchas implementadas até todos os elementos terem sido recortados e testados in-game.

## Arquivos recomendados
`assets/sprites/premium/runtime/player/` — aeronaves separadas;
`assets/sprites/premium/runtime/boss01/` — core, torres, canhões e sequências;
`assets/sprites/premium/runtime/boss02/` — partes, estados e animações;
`assets/sprites/premium/runtime/structures/` — pontes, represas e obstáculos;
`assets/sprites/premium/runtime/environment/` — tiles seam-safe sem textos;
`assets/sprites/premium/runtime/hud/` — molduras e ícones sem números estáticos.

Nunca substituir a campanha original por uma imagem demonstrativa ou por uma prancha inteira.
