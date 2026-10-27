# RiverStorm — assets premium runtime (preparação segura)

A arte premium aprovada continua preservada nos pacotes de revisão. Os arquivos binários abaixo **ainda não foram carregados no repositório**.

| Recurso | Caminho obrigatório | Pixels | SHA-256 esperado |
|---|---|---|---|
| Nave | `assets/sprites/premium/runtime/player/fighter_candidate.png` | 300x278 | `0c730c34440a2e99e24a8af9dc3d7aae74dd35a609e90875aa3dc22c81ef0615` |
| Explosão 12 quadros | `assets/sprites/premium/runtime/fx/explosion_atlas_4x3.png` | 512x384, 4x3 quadros de 128x128 | `5f02ca30b4e2158f1d45630f80185db6e156c079c5f3dec0fded0c324885dbd2` |

O arquivo `phaser-lab.html` tenta carregar estes PNGs de modo opcional. Somente quando **ambos** estiverem presentes, ele seleciona a skin premium da nave. Se um deles faltar, a arena continua com SVG sem alterar mecânicas.

**O que NÃO mudou:** HUD, pontuação, spawn, dano, vida, controles, padrões de tiro, música ou scripts da campanha. A skin premium não equivale a uma migração completa.

Para publicação definitiva:
1. Transferir os binários verificados para os caminhos exatos acima.
2. Publicar via workflow do GitHub Pages.
3. Validar no navegador: evitar 404, verificar textura real, posição visual, FPS e integridade da campanha.
4. Só então adicionar separadamente os cenários premium; suas margens e água ainda precisam ser convertidas em tiles contínuos.

Os SVGs pré-existentes são backup permanente e não devem ser sobrescritos.
