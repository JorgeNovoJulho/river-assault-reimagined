# RIVER STORM — Referência canônica dos 20 bosses

Nome oficial do jogo: **RIVER STORM** (com espaço).

Fonte: `src/game/campaign.js`, `MISSION_BOSS_SKILLS`, `BOSS_SKILLS` e `BOSS_HULL_ARCHETYPES` em `index.html` na branch `main`.

| Missão | Boss | Arquétipo visual | Especial | Fraqueza |
|---|---|---|---|---|
| 1 | PONTE FORTIFICADA | Fortaleza Modular | EMP | LIGHTNING |
| 2 | ENCOURAÇADO ABISSAL | Couraçado Railgun | LIGHTNING | GRAVITY |
| 3 | APACHE ESCORPIÃO | Porta-Drones | GRAVITY | EMP |
| 4 | SUBMARINO FANTASMA | Aranha de Cerco | ICE | FIRE |
| 5 | CAÇA TEMPESTADE | Bombardeiro Abissal | FIRE | ICE |
| 6 | QUEBRA-GELO TITÃ | Disco Prismático | BLEED | POISON |
| 7 | RAINHA DOS DRONES | Serpente Mecânica | POISON | BLEED |
| 8 | ARANHA MECÂNICA | Núcleo Orbital | PRISM | SHADOW |
| 9 | FORTALEZA VULCÂNICA | Titã de Lâminas | SHADOW | PRISM |
| 10 | HELICÓPTERO CERBERUS | Leviatã Industrial | LIGHTNING | GRAVITY |
| 11 | CRUZADOR DOURADO | Santuário Tecnológico | GRAVITY | EMP |
| 12 | ANDROIDE NOTURNO | Imperador Híbrido | SHADOW | PRISM |
| 13 | PORTA-HELICÓPTEROS | Porta-Drones | POISON | BLEED |
| 14 | BORBOLETA AÇO | Aranha de Cerco | ICE | FIRE |
| 15 | SUBMARINO INVISÍVEL | Disco Prismático | EMP | LIGHTNING |
| 16 | ABELHA IMPERIAL | Serpente Mecânica | PRISM | SHADOW |
| 17 | DESTRÓIER OMEGA | Leviatã Industrial | FIRE | ICE |
| 18 | COLOSSO SUBMERSO | Núcleo Orbital | BLEED | POISON |
| 19 | SENTINELA ELÉTRICA | Titã de Lâminas | LIGHTNING | GRAVITY |
| 20 | TRIARCA CELESTIAL | Imperador Híbrido | SHADOW | PRISM |

## Observações
- As fraquezas seguem a relação `BOSS_SKILLS[*].strong` invertida.
- Arquétipos visuais não substituem nomes canônicos dos bosses.
- Verificar divergências entre afinidade declarada e índices do executor de especiais antes de homologar combate.
- Não considerar todas as batalhas homologadas sem testes jogáveis.
