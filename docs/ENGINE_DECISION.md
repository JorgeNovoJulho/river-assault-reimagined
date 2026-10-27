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

## Implementação incremental — arena Phaser jogável
- `src/phaser/main.ts` agora inclui movimentação com setas/WASD/toque, disparo contínuo por espaço/toque, ondas de três tipos de inimigo, tiros hostis, colisões por distância, invulnerabilidade curta, vidas, pontuação e dano a chefe.
- Cap de 90 tiros e 10 inimigos simultâneos no laboratório; delta de movimento limitado para evitar grandes saltos após travamento do navegador.
- Medidor de FPS no HUD; reinício com R; troca de três texturas de chefe com teclas 1/2/3.
- A cena é **experimental e isolada**: não tem 20 fases da campanha, habilidades completas, salvamento, multiplayer nem paridade funcional com a Original.
- CI contém verificação de tipos `check:phaser`, mas é necessário confirmar execução bem-sucedida do workflow e abertura real da página.

## Correção de indisponibilidade da arena Phaser (27/10/2026)
- Simplificada a criação da nave em TypeScript evitando encadeamento potencialmente incompatível de `setStrokeStyle` com `Triangle`.
- `phaser-lab.html` agora exibe erros reais de JavaScript/promises em vez de uma tela silenciosa.
- GitHub Actions deve verificar que `dist/phaser-lab.html` possui um arquivo JS compilado e que o HTML da arena está acessível no Pages após o deploy.
- **Sem homologação externa:** esta correção foi gravada, porém não foi possível confirmar daqui o carregamento do GitHub Pages nem executar os logs do job; conferir `Actions` e não comunicar como já publicado antes de sucesso.
