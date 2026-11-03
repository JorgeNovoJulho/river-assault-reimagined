# RiverStorm — CHECKPOINT DE RETOMADA (02/11/2026)

> Este arquivo é a fonte operacional de retomada, não uma declaração de conclusão visual. Preservar este documento e a branch Premium.

## Identidade e regras
- Repositório: https://github.com/JorgeNovoJulho/river-assault-reimagined
- Branch de trabalho: `riverstorm-premium-nucleo`, branch `main` preservada até homologação.
- Engine e núcleo aprovados: Phaser + TypeScript. NÃO substituir engine, NÃO alterar mecânicas para consertar gráficos.
- Sempre corrigir diretamente no repositório com ferramentas disponíveis no chat (Work está indisponível), testar desktop/mobile, confirmar deploy e fornecer link de teste. Nunca declarar completo só porque build passou.
- Alvo: Arcade Premium PNG/raster para sprites, água, margens, ilhas, inimigos, pickups, explosões e bosses. Sem regressão procedural/SVG. CRT removido, qualidade/nitidez e proporção preservadas.
- Gameplay deve ocupar a mesma largura do HUD inferior SEM esticar; largura lógica/câmera adaptativa. Cautela com dispositivos Android modestos.

## Estado confirmado em 02/11/2026
- HEAD Premium antes deste checkpoint: `f38e13bc6dccb2f8c2ccc5eea1acf7e167b6d548`.
- Publicação GitHub Pages concluída, run: https://github.com/JorgeNovoJulho/river-assault-reimagined/actions/runs/41551972148
- Link para teste da versão V15: https://jorgenovojulho.github.io/river-assault-reimagined/premium-preview/?v=f38e13bc
- A última versão publicada atualizou largura do rio, mas **NÃO** os masters raster da Missão 1. Prévia não homologada visualmente.
- Build isolado Premium do commit f38e13bc: SUCESSO. Validação geral da branch Premium: FALHA no passo `Bloquear cenarios procedurais por ausência de masters na Missão 01`. Não mascarar ou retirar essa proteção.
- O deploy foi acionado por commit documental na `main` (`8d5a38f9`), sem alterar o núcleo oficial.

## Correções recentes de geometria
- Largura inicial do rio: ~69% da largura lógica (limitada à largura menos 40px).
- Largura dinâmica normal: 63%–73%; centro limitado para preservar margens em ambos os lados; curvas moderadas.
- Arena do boss usa alvo ~76%.
- No resize, a largura dos segmentos de rio já existentes passou a acompanhar a nova largura lógica, além do centro/posições. Esse era o segundo motivo pelo qual mudanças de largura não eram vistas; o primeiro era deploy público desatualizado.
- O canvas se ajusta à largura do HUD com resolução lógica dinâmica; evitar retornar à distorção CSS ou ao antigo 400x600 fixo em desktop.
- Referências: commits `248d269d`, `053b81e0`, `70008f07`, `f38e13bc`.

## PENDÊNCIAS BLOQUEADORAS, em ordem
1. INSTALAR real e corretamente na branch Premium os PNGs de água, bank_left e bank_right da Missão 1, não somente criar ZIP ou alterar manifest. O carregador `src/render/premium-environment.js` exige os três em `assets/sprites/premium/approved/environment/mission_01_rio_verde/`. Verificar dimensões, alpha e textura seamless. Não usar os diminutos placeholders do `main` (ex.: água 108x157) como masters Premium.
2. Integrar os PNGs individuais do ZIP original `RiverStorm_Premium_Sprites_Aprovados_Recortados_V3(3).zip` e pacote elaborado `RiverStorm_Missao01_Premium_Assets_V14.zip` em caminhos reais de runtime e registrar/verificar mapeamentos. Pacote V3 fornecido pelo usuário contém sprites de unidades, ilhas, barragem, FX, bosses 01/02; o README adverte que tiras de boss não são frames individuais e requerem revisão. O pacote V14 fora preparado com 72 PNGs, três novas texturas provisórias e instalador que não altera index.html. Estas texturas provisórias NÃO são masters oficiais homologados.
3. Corrigir recortes e bleeding: GAS/B/SOS (colunas laterais), ilhas com fundo retangular, ponte PASSAGEM segmentada incorretamente, tanques/helicópteros/drones e bosses. Revisar composição/alpha/frame bounds, não fazer upsizing falso e não usar quadros errados de atlas.
4. Substituir árvores, terreno, água e margens procedurais da Missão 1 por raster Premium, de modo coerente com curvas do leito. Em `src/render/scene2d5.js`, o fallback `if(!premiumReady)landscape(c,d,t)` e desenho adicional `terrainSignature`/etc produzem exatamente a regressão visual observada quando faltam os assets.
5. Verificar render de FPS, nitidez (sem CRT/scanlines), resolução, HUD alinhado, controles mobile menos sensíveis e desempenho.
6. Rodar build, testes JS, Playwright real desktop/mobile, screenshots antes/depois, auditoria de carregamento sem 404 e CI Premium completamente verde; só então publicar novo link e confirmar commit servido.
7. Depois, continuar Missão 2, seus bosses e os 20 ambientes, sem antecipar conclusão.

## Telas de abertura e seleção: histórico de regressões
- Abertura oficial Premium: logo inteiro, três botões funcionais, último piloto mostrado na moldura direita SEM duplicação do piloto impresso por baixo.
- Seleção: 7 pilotos e naves fixos, hover amarelo, dupla confirmação com flash verde, duplo clique inicia jogo, seleção ocupa 100% viewport sem vazamento da tela anterior.
- Fluxo browser tests para essas telas foi aprovado em versões anteriores, mas a composição visual deve ser homologada por screenshots; não inferir qualidade visual só de CI.

## Imagens anexadas como evidência durante a conversa
- Screenshot de 02/11 23:42: rio ainda visualmente estreito/deslocado, margens largas procedurais e repetitivas, ilha quadrada e itens com fragmentos/colunas. O usuário rejeitou isso e solicitou restauração real.
- Outros screenshots mostram bugs na abertura/seleção, fundo duplicado e gameplay esticado; não reintroduzir.

## Estratégia de próxima sessão
- Abrir este arquivo, ler HEAD, status dos workflows e árvore de assets.
- Inspecionar ZIP V14 disponibilizado na conversa ou pedir novo upload APENAS se bytes indisponíveis; não assumir ZIP instalado no repositório.
- Investigar GitHub Git Data APIs (blob base64 + tree + commit + update ref) para enviar binários reais; distinguir permissão de falha de transporte. Fazer commit em branch Premium e validar SHA de cada arquivo.
- O usuário quer ação direta por chat e link de teste real, não somente instruções ou prompts para Work.
