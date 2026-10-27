# RiverStorm — Bosses 16–20: especificações canônicas de arte Arcade Premium

Fonte: `src/game/campaign.js`, 27/10/2026. Estes são os cinco bosses finais da campanha, **não** os nomes criados pelas pranchas ilustrativas.

| Fase | Missão | Boss oficial | Direção visual proposta (não altera gameplay) |
|---|---|---|---|
| 16 | Floresta de Cristal | ABELHA IMPERIAL | Inseto-mecha imperial com asas translúcidas articuladas, ferrão metálico, propulsores e carapaça com reflexos bioluminescentes |
| 17 | Estaleiro Vermelho | DESTRÓIER OMEGA | Navio militar pesado com casco, torres de canhão, mísseis, radares, jatos e cicatrizes de batalha |
| 18 | Ilhas de Gelo | COLOSSO SUBMERSO | Colosso anfíbio blindado emergindo das águas congeladas, membros articulados, hélices e superfícies revestidas de gelo |
| 19 | Ruínas Elétricas | SENTINELA ELÉTRICA | Mecha guardião tecnológico com bobinas, núcleo luminoso, antenas, braços e conduítes de descarga |
| 20 | Confluência Final | TRIARCA CELESTIAL | Nave-chefe tríplice com três núcleos/segmentos mecanicamente distintos, asas, propulsores e armamentos reconhecíveis |

## Entregáveis para cada boss
- Arquivo-mestre raster de alta resolução e PNG/WebP transparentes individuais.
- Corpo, armas e partes articuladas em camadas, com pivôs, escala e vista de cima padronizados.
- Estados visuais neutro/ataque/danificado/destruição; não inventar novos ataques, HP, cooldowns ou física.
- Manifesto de animações e atlas, orçamento de textura e checagem de FPS em PCs/Android.
- Prévia para aprovação antes de colocar ativos em `assets/sprites/premium/bosses/16...` a `20...`.

## Situação
- Inventário dos 20 bosses por campanha: confirmado.
- Arte genérica da prancha: referência de estilo apenas, com rótulos incompatíveis com o código.
- PNGs definitivos dos bosses 16–20: **ainda não criados**.
- Integração ao Phaser e validação no jogo: **pendentes**.

Preservar todos os SVGs existentes, todos os controles, colisões, combate, progresso e músicas.
