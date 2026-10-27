# RiverStorm — motor gráfico canônico e plano de correção

## Decisão aprovada em 26/10/2026
- **Nova Geração:** **Phaser + TypeScript**, motor gráfico principal 2D.
- **Three.js + TypeScript/WebGL:** recursos 3D opcionais, integrados somente quando necessários.
- **SpriteForge:** referência ao fluxo de produção/integração visual, não motor alternativo.
- **Original:** preservar campanha e regras de jogo. Canvas 2D/2.5D legado é permitido durante migração, não destino final.

## Auditoria do código (27/10/2026)
- A página principal `index.html` e `src/render/scene2d5.js` usam Canvas 2D e JavaScript. O `package.json` não continha Phaser nem Three.js até este ajuste.
- Iterações gráficas anteriores acrescentaram SVGs e renderização Canvas. Apesar de terem efeitos sobre o legado, **não implementavam o motor Phaser aprovado**.
- Esta divergência ocorreu porque a implementação foi direcionada à renderização existente, em vez de avançar com a migração planejada. Não foi autorizada uma substituição da decisão sobre o motor.

## Correção iniciada
- `phaser-lab.html` é a entrada isolada para o laboratório gráfico Phaser.
- `src/phaser/main.ts` usa sprites reais armazenados em `assets/sprites`, com medidor de FPS.
- `tsconfig.phaser.json` aplica verificações estritas de tipos.
- Vite compila **duas entradas**, jogo antigo e laboratório. O CI deve testar TypeScript, renderização dos arquivos e build.
- O laboratório não é apresentado como campanha Phaser completa: ainda não possui todo o sistema de controles, colisões, inimigos, especiais e 20 missões.

## Migração obrigatória por etapas
1. Validar laboratório Phaser no navegador, dependências e assets, sem modificar a campanha Original.
2. Migrar um mapa/arena vertical com input, scrolling e sprites, isolando regras de jogo num núcleo independente.
3. Migrar projéteis, colisões, danos, especiais e todos os chefes sem divergência de comportamento.
4. Migrar os 20 biomas e seus recursos, mantendo fases e climáticas.
5. Homologar funcionalidade e performance web, Windows e Android.
6. Promover a Nova Geração ao motor Phaser apenas com testes comparativos completos e rollback seguro.

**Não declarar Phaser ativo na campanha principal até a troca real do motor de jogo.**
