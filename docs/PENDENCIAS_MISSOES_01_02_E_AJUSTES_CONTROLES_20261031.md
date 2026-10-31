# RiverStorm — Auditoria Missões 01/02 e correções de jogabilidade

## Aplicado (branch Premium)
- CRT desligado no inicializador e regra de neutralização de pseudo-elementos; conferir captura visual da revisão Premium, **não** a main publicada.
- Joystick: deadzone 20% → 28%; expoente de resposta 1,45 → 1,85 e máximo analógico 72%, preservando teclado/gamepad.
- HUD mobile: botão expansível já existente; área de nível/XP agora também é ocultada/revelada junto às demais métricas.
- Rolagem: base `config.scroll * .85`, isto é 15% menor, preservando o fator relativo subir/descer; relógio de missão e comportamento da IA permanecem inalterados para não quebrar os combates.

## Missão 01 — Selva da Aurora
- [x] IDs de TUCANO e recorrentes mapeados para PNGs Premium V3.
- [x] Boss 01: master V3 evita adornos SVG antigos sobrepostos.
- [x] Remoção do CRT no código da branch Premium.
- [ ] Homologar os 20 tipos efetivamente gerados pelo spawner e inspecionar cada sprite em jogo, incluindo objetos/itens não inimigos.
- [ ] Testar colisão visual e escala de cada unidade no mobile; master V3 possui apenas uma imagem estática por inimigo.
- [ ] Substituir ilhas, pontes, represas e trechos de costa ainda procedurais por PNGs homologados.
- [ ] Homologar os módulos animados do Boss 01; o master contém canhões mas não garante rotação independente visível.
- [ ] Garantir prévia pública independente da branch Premium para inspeção PC e Mobile.

## Missão 02 — Porto das Sombras
- [x] CRANE Premium em tamanho visual separado da hitbox; Boss 02 com master PNG.
- [x] Preparados caminhos `approved/environment/mission_02_industrial/` e priorização no carregador.
- [ ] **BLOQUEADOR:** `water.png`, `bank_left.png`, `bank_right.png` não estão presentes no GitHub; foram exportados em ZIP separado e devem ser importados/testados antes de afirmar que o cenário foi atualizado.
- [ ] Remover efetivamente os prédios portuários desenhados por código quando a costa raster estiver ativa.
- [ ] Preparar PNGs separados dos obstáculos do porto, guindastes, docas, silos, pontes, embarcações estáticas, com escalas coerentes.
- [ ] Verificar alinhamento, tiling vertical e continuidade da margem em curvas/estreitamentos do rio.
- [ ] Animar canhões/torres do Boss 02 com quadros/pivôs independentes; não sobrepor adornos vetoriais.
- [ ] Inspecionar chuva, neblina, projéteis/explosões em PC e Mobile, eliminando halos quadrados.

## Transversal
- [ ] Confirmar no navegador sem CRT a qualidade da nitidez e a proporção de cada sprite.
- [ ] Validar joystick mobile em dispositivo real (zona morta e aceleração progressiva).
- [ ] Inspecionar e testar abertura/recolhimento do HUD, inclusive acesso às habilidades.
- [ ] Validar 15% menos velocidade de rolagem, mantendo duração e espaçamento dos eventos.
- [ ] `npm test`, `npm run check:phaser`, `npm run build` no commit final.
- [ ] Publicação de prévia independente; `main` não deve ser alterada sem homologação.

**Nota:** checklist baseado no Git atual e nos defeitos evidenciados nas capturas; não equivale a validação em navegador físico.
