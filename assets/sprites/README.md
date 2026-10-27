# RiverStorm — guia de sprites e consistência

Direção visual canônica: arcade 2.5D visto de cima, silhuetas legíveis, detalhes mecânicos de leitura imediata, sem polígonos quadrados genéricos.

## Estrutura planejada
- `assets/sprites/bosses/`: 20 bosses distintos com silhuetas, articulações e armas únicas
- `assets/sprites/enemies/`: inimigos com braços, torres, rotores ou pernas reconhecíveis
- `assets/sprites/projectiles/`: projéteis estreitos e luminosidade limitada, sem rastros grossos
- `assets/sprites/terrain/`: árvores, prédios, margens, pontes, represas e ilhas
- `assets/sprites/weather/`: chuva, neve, vento, relâmpagos ramificados e névoa

## Regras
1. PNG ou WebP com transparência e resolução base de 2x a 4x o tamanho lógico no jogo.
2. Sprites com mesma orientação de câmera e paleta por bioma, pontos de pivô documentados.
3. Sem utilizar PNG gerado por IA como sprite final até verificar transparência, orientação, atlas, desempenho e direitos.
4. Substituir o renderizador procedural progressivamente sem misturar estilos ou duplicar efeitos.
5. Não declarar concluída a substituição enquanto faltarem atlas e integração real.
