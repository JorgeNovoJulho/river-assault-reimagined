# RIVERSTORM — auditoria de sprites e pendências (31/10/2026)

## Evidência no repositório da branch Premium
- PNGs individuais comuns confirmados: `assets/sprites/premium/runtime/enemies/ship.png` (SHIP), `turret.png` (TURRET).
- Tipos recorrentes ainda sem PNG individual confirmado: HELI, JET, ZIGZAG, TANK, SUB, MECHA_GUN, MECHA_SWORD.
- A campanha usa SVG legado para nove tipos recorrentes; os SVGs não equivalem a sprites Arcade Premium.
- Inimigos exclusivos gerados por canvas em `src/render/scene2d5.js`, função `biomeSprite(id)`: TUCANO, CRANE, SCORPION, ALLIGATOR, CORSAIR, WALRUS, MANTIS, MOTOJET, SALAMANDER, EAGLE, DREDGER, HOVERCAR, PIRANHA, ICE_RAY, BEETLE, PRISM_WASP, WELDER, NARWHAL, EEL, HYBRID_HUNTER. **20/20 exigem sprite raster homologado**.
- Bosses: existem 20 SVGs em `assets/sprites/bosses/`; não foi encontrado conjunto completo de 20 sprites raster individuais homologados nesta branch. Existe uso específico de PNG para boss 02 condicionado à presença do arquivo, mas o PNG não consta na árvore auditada.
- Efeitos: somente `explosion_atlas_4x3.png` comprovado em `assets/sprites/premium/runtime/fx/`; projéteis e efeitos complementares usam desenhos/código e SVGs.
- Veículos e cenários: estruturas, ilhas, vegetação, margens, água e elementos industriais ainda combinam SVGs e renderização procedural.
- Sete naves do jogador: 28 PNGs oficiais na pasta `assets/sprites/premium/aircraft/`, integrações de código ainda demandam homologação visual e funcional.

## Pranchas encontradas na Biblioteca ChatGPT (fora do repositório)
- `Biblioteca Arcade de Sprites Riverstorm.png`: 20 inimigos exclusivos e unidades recorrentes.
- `RIVERSTORM: Pacote Premium de Sprites Arcade.png`: inimigos, bosses, cenário e efeitos.
- `Atlas premium de sprites Riverstorm.png`: grupos de unidades e bosses.
- `Atlas de Sprites Premium Riverstorm.png`: variações.
As pranchas são composições multielemento. Antes de integrar, é necessário isolar a arte real, remover molduras/legendas/fundo, verificar transparência, preservar proporção, definir pivô/escala e conferir se cada frame representa o mesmo inimigo. Não marcar cortes automáticos sem inspeção como aprovados.

## Plano completo de pendências, em ordem
1. **P0**: corrigir falhas mobile (efeito CRT, visibilidade, botões fora da arena, joystick, HUD, brilho, FPS) e testar em navegador físico.
2. **P0**: corrigir as 21 falhas da suíte original; testes de repulsão/parry, ondas de bomba, bosses e armas devem preservar mecânica.
3. **P0**: compilar CI Premium com êxito, conferir PNGs no dist e publicar uma URL de prévia verificável antes de integrar main.
4. **P1**: extrair/homologar PNGs das 7 classes recorrentes sem arte e inserir em `assets/sprites/premium/runtime/enemies/`.
5. **P1**: extrair/homologar 20 inimigos exclusivos em `assets/sprites/premium/runtime/biome/` com animações, projéteis, colisões visuais e efeitos; substituir o Canvas procedural somente quando o arquivo real estiver presente.
6. **P1**: homologar e integrar 20 bosses PNG com fases/danos/partes destrutíveis/superataques; substituir os 20 SVGs de boss.
7. **P1**: assets raster dos drones, projéteis, explosões, parry, espada, EMP e poderes elementais; reduzir poluição visual sem mexer em dano.
8. **P1**: integrar 20 fundos de biomas, água/margens contínuas, ilhas/pontes/represas, horários e climas.
9. **P1**: concluir associação fixa piloto–nave no hangar/campanha, carregamento das quatro variantes, perfis, GIF/foto e progressão.
10. **P1**: corrigir render e transição RED ALERT/boss, música da arena, falas e barras/recargas.
11. **P2**: otimizar memória, culling, nitidez 1080p/4K, opções de qualidade e controles desktop/gamepad/mobile.
12. **P2**: concluir multiplayer até 8 jogadores (salas, senha, descoberta, sincronização, ranking e testes de rede).
13. **P2**: verificar XP, NG+, 20 missões completas, recompensas, desbloqueios, save, viagens e integridade antiexploit.
14. **P2**: testar APK Android/Windows se houver pipeline de build, fazer homologação em aparelhos modestos e publicar links diretos verificáveis.

## Critérios de conclusão
Nenhuma pendência pode ser concluída só por comentário, placeholder, imagem composta ou teste que falhou. Exigir arquivo PNG real, integridade no build, render visual em runtime, comportamento correto da mecânica e teste de regressão.
