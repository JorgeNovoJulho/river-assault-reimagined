# RiverStorm — Mapa de atualização gráfica e performance

Atualizado: 2026-10-27. Regra: só considerar "homologado" após build, ensaio no navegador e medição de FPS.

| Frente | Estado | Entregue | Próximo passo |
|---|---|---|---|
| Habilidade FOGO do boss | Código otimizado | 24 gradientes por quadro reduzidos para 8 chamas com cores sólidas; halo e blur reduzidos | Medir frame time em ECO, Balanced, Enhanced |
| Arena de bosses | Otimização parcial | Limites adaptados à qualidade para tiros, partículas e textos | Perfil por boss; reduzir overdraw e alocações, estresse com 20 bosses |
| Projéteis | Sprites em uso | plasma-blue.svg e plasma-red.svg; cópia via Vite | Sprite atlas PNG/WebP, variantes por arma e escala DPI |
| Boss missão 1 | Sprite em uso | iron-wasp.svg (primeiro boss somente) | Aprovar design e animar partes |
| Bosses 2–20 | Pendente | Renderizador legado preservado | Criar, recortar, salvar, inserir e testar um a um |
| Inimigos comuns | Pendente | Legado funcional | Catálogo visual com sprites por inimigo |
| Cenários e 20 biomas | Parcial | Recorte em margens e ajuste meteorológico | Sprites de estruturas, vegetação e água por bioma |
| Ilhas, pontes, represas | Pendente visual | Colisões separadas dos gráficos | Criar estados intacto/dano/destruído e atlas |
| Clima e horário | Parcial | Associação fixa por missão | Testes visuais das 20 combinações |
| VFX especiais | Parcial | FIRE custo reduzido | Otimizar EMP, ICE, LIGHTNING, GRAVITY, BLEED, POISON, PRISM, SHADOW |
| Personagens e auxiliares | Parcial | Silhuetas vetoriais legadas | Sprites e pivôs para órbitas/formações |
| Windows, Android e web | Não homologado | Pipeline Vite existente | Builds e benchmarks de FPS, RAM, GPU |

## Critérios por item
1. Arquivo individual em `assets/sprites/` e nomenclatura estável.
2. Referência real no código de renderização e inclusão em `dist/`.
3. Compatibilidade com colisão independente da arte.
4. Testes de sintaxe e regressão; depois teste jogável e medição de FPS.
5. Não declarar conclusão de todo o projeto antes da homologação.
