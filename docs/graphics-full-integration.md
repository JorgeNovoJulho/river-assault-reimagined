# RiverStorm — migração gráfica mantendo motor oficial

## Regra de arquitetura
- `index.html` e a lógica oficial de jogo são a fonte canônica de verdade.
- Não migrar mecânicas do original para o Combat Lab simplificado: evoluir o renderer `src/render/scene2d5.js` diretamente.
- A branch `main` continua inalterada até homologação.
- A camada de sprites cacheados é sobreposição experimental; não altera física, hitboxes, comportamento nem dano.

## Inventário verificado no motor
- Campanha de 20 setores, progressão, chefes e recompensa de habilidades.
- Arsenal: SINGLE, DOUBLE, SPREAD, LASER, MISSILE e BANK_MISSILE, além das funções do catálogo de aeronaves.
- Afinidades dos chefes: EMP, LIGHTNING, GRAVITY, ICE, FIRE, BLEED, POISON, PRISM e SHADOW, com matriz de forças e fraquezas.
- Inimigos: MECHA_SWORD, MECHA_GUN, HELI, SHIP, SUB, JET, ZIGZAG, TANK, TURRET, BIOME_ENEMY, BOSS e outros.
- Mecha de espada retorna pelo alto da tela; submarino atravessa horizontalmente; inimigos terrestres usam margens; chefes usam especiais com recarga.
- Sistema de parry refletor, bombas, wingmen, XP, rankings, powerups, ilhas, estruturas, combustível, resgates e eventos.
- Renderizador 2.5D com temas, clima, iluminação, água, terrenos, objetos de cenário e composição de inimigos.

## Fases de integração
1. [x] Partir do motor oficial em branch isolada.
2. [x] Adicionar primeira sobreposição de sprites com cache a classes comuns, boss e jogador.
3. [ ] Validar visual no navegador e corrigir escalas/oclusão e animação.
4. [ ] Substituir sobreposição por atlas específicos de cada aeronave e inimigo (sem cobrir animações originais indevidamente).
5. [ ] Criar sprites individuais para 20 inimigos de bioma, 20 arenas e chefes.
6. [ ] Refinar arte de projéteis, lasers, mísseis, especiais, parry e explosões preservando comportamento.
7. [ ] Revisar arte e profundidade de cenários, objetos, ilhas, represas, pontes, margens e biomas.
8. [ ] Testar as 20 missões, 9 afinidades, armas, itens e save/continue do início ao fim.
9. [ ] Auditoria de FPS, memória, regressões, mobile/desktop.
10. [ ] Integrar à main apenas após homologação.

## Riscos conhecidos
- Sem teste de navegador nesta alteração, uma sobreposição pode esconder o desenho original ou obscurecer dano/telemetria.
- A camada atual usa silhuetas genéricas para algumas classes e não substitui sprites exclusivos de bioma.
- A sintaxe e desempenho do commit ainda requerem CI/execução real no navegador.
