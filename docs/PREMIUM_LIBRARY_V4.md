# RiverStorm — Biblioteca Premium v4: inventário e publicação

Auditoria do código: `src/game/campaign.js` (20 fases e respectivos bosses), `src/render/scene2d5.js`, `src/phaser/main.ts` e `assets/sprites/README.md`.

## Pacote produzido nesta revisão
- `RiverStorm_Biblioteca_Premium_v4_COMPLETA.zip` — 138 arquivos gráficos/referências e 2 documentos (manifesto com SHA-256 e instruções).
- Imagens aprovadas originais preservadas em `assets/sprites/premium/review/` e recortes preservados em `candidates/`.
- Candidatos separados: 20 bosses, 10 inimigos, três candidatos de ambiente por uma das 20 fases (60 arquivos), 12 ícones/efeitos e os originais existentes.
- Os novos desenhos procedurais de bosses/inimigos/biomas são **candidatos ainda não aprovados**, não sprites finais prontos para substituição. Não modificar hitboxes ou mecânicas para encaixar a arte.
- Três PNGs rasterizados de cenário constam de `assets/sprites/premium/runtime/environment/` dentro do ZIP, mas precisam de correção de bordas/costuras antes da homologação.

## Publicação — estado verificável
Os três PNGs de cenário **não foram publicados no GitHub por esta atualização**: os conectores disponíveis editaram texto, mas não transferiram os arquivos binários locais. O Phaser tem código de carregamento opcional e fallback para cenários SVG. Não marcar como publicado até confirmar os arquivos por caminho/SHAs no GitHub e no Pages.

## Procedimento
1. Revisar a prancha, candidatos e manifesto, aprovar e ajustar arte.
2. Enviar os PNGs aprovados aos caminhos exatos da biblioteca no repositório.
3. Garantir cópia em `dist/` no build e execução do workflow GitHub Pages.
4. Verificar URLs, textura real, costuras, FPS, paridade de colisões e áudio.
5. Manter scripts da campanha e músicas sem alterações. Preservar versões antigas para rollback.
