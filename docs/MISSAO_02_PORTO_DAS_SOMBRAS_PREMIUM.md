# RiverStorm — Missão 02: Porto das Sombras — auditoria de arte Premium

## Confirmado em 2026-10-31
- Bioma industrial/porto noturno: `src/game/campaign.js` setor 2 e tema `COSTA INDUSTRIAL` em `src/render/scene2d5.js`.
- Inimigo exclusivo CRANE: `assets/sprites/premium/approved/enemies/exclusive/02_crane/idle_000.png`; visual ampliado independentemente da hitbox.
- Recorrentes: sprites aprovados para HELI, JET, ZIGZAG, DRONE, TANK, TURRET, SHIP, SUB, WARSHIP, MECHA_GUN e MECHA_SWORD via `src/render/premium-registry.js`.
- Boss 02: `assets/sprites/premium/approved/bosses/02_encouracado_abissal/atlas_v3/body_full.png`; não sobrepor módulos vetoriais obsoletos ao master.
- Os 82 assets V3 existentes não incluem texturas ambientais completas para o Porto das Sombras.

## Arquivos indispensáveis a produzir, usando as pranchas aprovadas como referência
Criar em PNG RGBA de resolução apropriada (preferência por textura 1024–2048px, não ampliar artificialmente imagens pequenas):
1. `assets/sprites/premium/candidates/biomes/mission_02_industrial/water.png` — água industrial noturna azul limpa, reflexos, espuma discreta, tiling vertical sem emendas.
2. `assets/sprites/premium/candidates/biomes/mission_02_industrial/bank_left.png` — costa com docas industriais, contêineres, galpões, guindastes e iluminação portuária, sem blocos desenhados por CSS/SVG.
3. `assets/sprites/premium/candidates/biomes/mission_02_industrial/bank_right.png` — costa complementar, mesmo estilo sem repetição mecânica.
4. `assets/sprites/premium/approved/environment/mission_02_industrial/` — destino para cópia revisada e homologada. Atualizar `premium-environment.js` para preferir `approved` quando existir.
5. PNGs individuais dos obstáculos/ilhas e estruturas industriais (pontes, docas, navios ancorados), respeitando rio e hitboxes; não reutilizar sprites de inimigos como cenário.
6. Efeitos de chuva, neblina e boss em PNGs RGBA individuais, com partículas limitadas e sem quadrados.
7. Quadros separados para torretas móveis do Boss 02 a partir das pranchas já aprovadas (não inventar canhões).

## Restrições
- **Não preencher as lacunas com procedurais ou SVG novos**; isso apenas perpetua o problema.
- Não afirmar que o cenário está integrado enquanto os três PNGs ambientais não estiverem no GitHub, publicados no `dist/` e testados em navegador.
- Preservar campanha, IA, colisões, sons, pilotos, habilidades e o padrão visual da Missão 1.
- Não publicar `main` sem homologação; usar artefato Premium isolado.
