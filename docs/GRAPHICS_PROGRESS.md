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


## Auditoria adicional — 27/10/2026: interface e efeitos
- **Código aplicado:** molduras quadradas de alerta e baixa vida do boss substituídas por arcos finos no `index.html`; coroa geométrica de `bossPresentation` substituída por arcos/indicadores finos em `src/render/scene2d5.js`.
- **Código aplicado:** `drawPlayerStatusEffect()` espelha visualmente os nove efeitos do chefe no jogador: EMP, LIGHTNING, ICE, FIRE, BLEED, POISON, PRISM, SHADOW e GRAVITY.
- **Código aplicado:** `RiverSFX.status(kind)` com sinal sonoro específico ao início de cada status; sem novas instâncias de áudio em cada quadro.
- **Regressões:** verificações adicionadas a `tests/riverstorm-regression.test.cjs`; scripts verificados quanto a sintaxe.
- **Pendente de homologação:** rodar o workflow, testar cada habilidade com o jogo aberto, comparar screenshot após publicação, testar Windows/Android e medir FPS em bosses.
- **Observação importante:** a substituição dos gráficos procedurais por sprites individuais continua **parcial**; apenas alguns sprites já estão efetivamente ligados ao jogo. Não marcar como concluído até finalizar assets, integrar e testar cada bioma/boss/inimigo.

## Atualização — 27/10/2026 (continuação)
- Sprites distintos acrescentados para os chefes das missões 2 e 3: `assets/sprites/bosses/abyss-manta.svg` e `assets/sprites/bosses/crimson-rotor.svg`.
- Renderizador seleciona `iron-wasp.svg`, `abyss-manta.svg`, `crimson-rotor.svg` conforme missão 1, 2 ou 3; mantém fallback legado se a imagem não carregar.
- Pipeline Vite copia os sprites para `dist/`; adicionado teste de regressão de referências e existência.
- **Pendentes:** 17 sprites de chefes, demais inimigos, 20 cenários e FX definitivos, medição FPS, execução real dos testes e verificação da publicação; multiplayer integral segue pendente.

## Atualização incremental — chefes 1 a 6
- Confirmada a integração de seis sprites específicos por missão: `iron-wasp`, `abyss-manta`, `crimson-rotor`, `granite-dam`, `crimson-spider`, `frost-sentinel`.
- Cada SVG está em `assets/sprites/bosses`, usado pelo renderer quando carregado e copiado ao `dist` pelo Vite.
- Testes de regressão expandidos e ajustados de limite 3 para limite 6.
- **Ainda faltam chefes 7 a 20, animações específicas, arte final dos inimigos/cenários, testes de imagem e FPS.**

## Avanço seguinte — missões 7–12
- Seis novos sprites SVG individuais gravados em `assets/sprites/bosses/`, ligados ao renderizador e ao bundle web.
- Total: **12 chefes com arquivos de sprite integrados**; faltam chefes 13–20, animações específicas e substituição da maioria dos cenários/inimigos.
- Os novos sprites são uma primeira versão vetorial, não arte final homologada.

## Atualização — chefes 13–20
- Sprites SVG individuais criados, salvos e integrados para missões 13 a 20.
- **20 de 20 missões com sprite dedicado no código e Vite**; arte ainda provisória e sem homologação visual, animações e benchmarks.
- Restam cenários, inimigos, demais efeitos, teste jogável e publicação confirmada.

## Atualização: primeiros sprites de cenário realmente aplicados
- `assets/sprites/terrain/island-tropical.svg` e `island-rock.svg`: renderização das ilhas via imagens carregadas, com fallback procedural.
- `assets/sprites/terrain/bridge-industrial.svg` e `dam-concrete.svg`: estruturas renderizadas a partir de sprites, recortadas para manter a passagem central e o HP.
- `src/render/scene2d5.js`, `index.html` e `vite.config.js` atualizados; novo teste de regressão em `tests/riverstorm-regression.test.cjs`.
- **Ainda pendente:** outros biomas, cenários dos 20 mapas, variações danificadas/destruídas, outros inimigos, animações, FPS e homologação web/Windows/Android.

## Nova atualização — avarias de estruturas
- Adicionados sprites `bridge-damaged.svg`, `dam-damaged.svg`, `island-scorched.svg`, na pasta `assets/sprites/terrain/`.
- Pontes, represas e ilhas usam sprites de avaria quando a durabilidade restante chega a 45% ou menos, com imagem original em bom estado.
- Novos arquivos incluídos no Vite e cobertos por teste estático.
- Próximas etapas: estados de destruição animados, sprites de vegetação e prédios por bioma, inimigos e testes reais de FPS/publicação.

## Atualização — primeiros sprites reais de inimigos comuns
- Quatro imagens SVG individuais criadas em `assets/sprites/enemies/`: `mecha-gun.svg`, `mecha-sword.svg`, `helicopter.svg` e `submarine.svg`.
- Renderizador agora prefere imagens reais para `MECHA_GUN`, `MECHA_SWORD`, `HELI` e `SUB`, usando o desenho anterior apenas como fallback de carregamento.
- Desligadas as camadas procedurais sobrepostas nesses tipos quando a imagem estiver carregada; colisões e lógica de comportamento não foram modificadas.
- Vite empacota os quatro novos arquivos; adicionados testes de regressão.
- **Pendente:** sprites individuais para outros tipos comuns, efeitos, cenários completos dos 20 mapas; executar suíte de testes em CI e benchmark jogável FPS.

## Inimigos comuns — segunda leva
- Adicionados e integrados `tank.svg`, `turret.svg`, `ship.svg`, `jet.svg` e `zigzag.svg` em `assets/sprites/enemies/`.
- **9 tipos de inimigos comuns** com sprites dedicados no renderer; seleção por tipo, fallback de desenho legado.
- Arquivos incluídos no Vite e testes de regressão atualizados.
- Pendentes: tipos biome especiais, outros obstáculos, animações, testes reais de FPS e imagens no navegador.

## Auditoria de efeito real no jogo — 27/10/2026
- **Reforço de build aplicado:** GitHub Actions verifica os 38 SVGs atualmente referenciados pela configuração Vite, confirmando presença e arquivo não vazio em `dist/`.
- **Reforço de publicação aplicado:** após o deploy, GitHub Actions acessa exemplos de sprites de bosses, inimigos, cenários e armas na URL pública, validando resposta HTTP e conteúdo SVG.
- **Integração de código:** sprites já selecionados por tipo no renderizador, com fallback procedural para imagens não carregadas.
- **Limites honestos:** não houve nesta rodada medição de FPS nem playtest automatizado no navegador; a execução bem-sucedida das novas etapas do workflow precisa ser confirmada em Actions. Passar por testes de assets não comprova a renderização estética, animação ou colisões.
- **Próximo passo:** incluir smoke test do canvas em navegador real no CI, imagens de referência e testes das missões 1–20, além dos elementos bioma/especiais ainda procedurais.

## Correção prioritária de arquitetura — Motor Phaser + TypeScript
- Conferência histórica da decisão de 26/10/2026: **Phaser + TypeScript** é o motor escolhido para Nova Geração; Canvas 2D legado é transitório. Three.js opcional.
- Auditoria detectou que os sprites anteriores foram integrados no motor legado Canvas, não no Phaser escolhido.
- Adicionada entrada `phaser-lab.html` e cena `src/phaser/main.ts` com Phaser, assets SVG já utilizados no jogo, FPS e movimentação experimental.
- Vite configurado para produzir entrada separada; `npm run check:phaser` incluído no CI.
- O jogo principal continua Canvas para manter as funcionalidades durante a migração.
- **Pendente:** garantir compilação/execução no Pages, depois portar mecânicas, sprites, cenas e chefes ao Phaser. Ver `docs/ENGINE_DECISION.md`.

## 27/10/2026 — Phaser Nova Geração: primeira arena jogável
- **Implementado no código:** `src/phaser/main.ts` agora contém entrada jogável com setas/WASD/toque, disparos, inimigos, HP, colisões, boss e pontuação.
- **Preservação:** `index.html` continua entregando jogo Canvas Original; Phaser está em `phaser-lab.html`, evitando regressão de funcionalidades legadas.
- **Validação:** testes estáticos de sistemas de jogabilidade do Phaser adicionados, além da exigência no CI de `dist/phaser-lab.html`.
- **Sem comprovação de homologação até aqui:** compilação CI concluída, navegador real, FPS sustentado, Android/Windows, 20 fases e paridade de mecânicas com Original.
- **Próximo marco:** teste dinâmico automatizado da arena; migração de padrões de disparo, boss, cenário, HUD, saves e controles da Original; habilitar Nova Geração como escolha do usuário somente após validar paridade.
