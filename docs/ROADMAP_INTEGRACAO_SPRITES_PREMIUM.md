# RiverStorm — ordem de integração visual (Setor 1 → Boss 02 → demais 20 missões)

**Estado:** planejamento técnico e caminhos registrados. Nenhum arquivo de prancha foi enviado por este documento; nenhum recorte foi homologado. O manifesto [premium-extraction-manifest.json](../assets/sprites/premium/referencias-aprovadas/premium-extraction-manifest.json) contém os nomes de destino.

## 0 — Regras e bloqueios
- Manter a campanha existente, mecânicas, IDs e boss names canônicos do código. As pranchas têm **títulos divergentes entre versões** (ex.: Boss 01 e Boss 02): **não substituir identidade do boss pelo nome de outra prancha**.
- Preservar originais das oito pranchas como PNG imutáveis em `assets/sprites/premium/referencias-aprovadas/boards/`. Antes do recorte, registrar dimensões, checksum e retângulo de origem.
- Recortar imagens individualmente e inspecionar: molduras, tipografia, transparência genuína (xadrez pode estar embutido), sombras, sprite truncado, cores e partes sobrepostas. Não inventar frames pela duplicação da mesma figura.
- Candidatos na pasta `candidates`; somente mover para `approved` após aprovação visual e checagem de identidade; `runtime` apenas depois de teste na arena. Não integrar PNG composto diretamente na cena.
- Medidas visuais devem depender da largura jogável e dos limites da tela, sem alterar hitboxes. Sugestão inicial para teste (não homologada): nave 9–14% largura, comum 7–15%, pesado 15–27%, boss 45–85%; ponte/represa pode ocupar o rio e preservar corredor de passagem.

## 1 — Setor 01: Rio Verde / Ponte Fortificada
1. Copiar prancha 01 para `boards/`, identificar retângulos do boss principal e de suas 8 animações + 5 estados de dano.
2. Isolar corpo da ponte, torres laterais, canhões principais, metralhadoras, lançadores, sensores, defesas e sprites de projéteis e dano. Salvar cada parte e cada frame com alfa real.
3. Extrair inimigo TUCANO, helicóptero, drone, mecha, torre e submarino nas pranchas de unidades. Conferir qual variante corresponde ao gameplay do setor.
4. Separar água (8 quadros), reflexos (6), correnteza (8), margens esquerda/direita, redemoinhos, estelas, respingos e explosões pequenas/médias/grandes do atlas de rio. Validar costuras de tiles sem impedir a geometria dinâmica do leito.
5. Testar isoladamente Boss 01, limites de tela, barras de vida, armas, RED ALERT, projéteis com espaços de esquiva, explosão de partes e HUD móvel.
6. Integrar ao renderizador somente os sprites aprovados, conservando a colisão original; executar testes de regressão e screenshot de desktop/mobile.

## 2 — Boss 02: Encouraçado Abissal
1. Preservar as duas pranchas 02; comparar diferentes enquadramentos e não misturar frames incompatíveis.
2. Isolar casco, núcleo, torre esquerda/direita, canhões, propulsores e quatro armamentos. Registrar pivôs relativos ao casco.
3. Exportar frames idle, deslocamento, avanço, recuo, ataques (concentrado, aberto, laterais, míssil/torpedo) e estados íntegro/75/50/25/crítico/destruição.
4. Associar armas visuais às mecânicas existentes (não criar projéteis extras sem revisão de balanceamento); testar separadamente movimento, dano por peça, boss death, efeitos de água e som.
5. Validar proporção e legibilidade no viewport mobile antes de integrar à campanha.

## 3 — Inimigos exclusivos 01–20 e recorrentes
- Processar um inimigo por vez seguindo a ordem de missão do manifesto: TUCANO, CRANE, SCORPION, ALLIGATOR, CORSAIR, WALRUS, MANTIS, MOTOJET, SALAMANDER, EAGLE, DREDGER, HOVERCAR, PIRANHA, ICE_RAY, BEETLE, PRISM_WASP, WELDER, NARWHAL, EEL, HYBRID_HUNTER.
- Para cada um: identidade e imagem principal → movimentos existentes → ataque → estado de dano → destruição → hitbox visual/escala → teste.
- Recorrentes: avião reconhecimento, helicóptero, drone, mechas espada/metralhadora, tanque, lancha, submarino, torre, navio, bombardeiro, elite, ilha armada, represa/ponte, cápsula e mina.

## 4 — Outros bosses e ambientes
- Bosses 03–20 em ordem canônica de campanha; conservar mecânicas e ataques originais.
- Integrar os 20 biomas e itens/FX conforme disponibilidade real de tiles. Não usar poster em vez de cenário contínuo.
- Revisar partículas, atlas, resolução, 1080p, FPS, memória e interfaces.

## 5 — Critérios de entrega
- Cada PNG existe no GitHub com nome e checksum, transparencia verificada e quadro correto.
- Manifesto associa asset ↔ arquivo ↔ pivô ↔ escala ↔ origem e variante.
- Testes automatizados e compilação da branch verdes, sem falhas preexistentes mascaradas.
- Inspeção visual desktop e mobile, sem 404, elementos fora de tela, troca de identidade, tela piscando ou regressão de jogabilidade.
- Links de testes PC/mobile somente após confirmação de publicação da revisão correta.
