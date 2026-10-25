# Game Design — River Assault Reimagined

## Conceito
Jogo arcade original de combate aéreo em rio, inspirado em mecânicas clássicas. Um único núcleo multiplataforma para Windows e Android, visual 2.5D, efeitos modernos e modo econômico para celulares equivalentes ou inferiores ao Realme C55.

## Três aviões
- **Falcão** (normal): tiro simples, duplo, espalhado, laser, mísseis guiados.
- **Vespa** (médio): rajada, tiros alternados, agulhas, pulso energético, microfoguetes.
- **Cometa** (rápido): canhão rápido, diagonais, tridente, raio concentrado, mísseis de precisão.
Aceleração ou desaceleração vertical influencia consumo de combustível; cada avião precisa de balanceamento próprio.

## Bombas e sobrevivência
3 bombas no início, teto de 5 por coleta. A bomba elimina inimigos comuns presentes na tela; chefes recebem dano alto, sem morte instantânea, para preservar as batalhas. Sem combustível, avião cai e explode; itens coletados são temporariamente recuperáveis no local, desaparecem após curto intervalo e podem voltar em futuras gerações. Definir limite de vidas, checkpoints e item escrow em implementação posterior.

## Controles
Android: joystick analógico deslizante à esquerda, tiro/bomba/pausa à direita, áreas de toque dimensionadas para telas menores e orientação configurável.
Windows: WASD/setas, teclado e mouse configuráveis.

## Ameaças
Aviões, helicópteros, navios, submarinos, torretas costeiras, minas, pontes, canhões antiaéreos, drones, redemoinhos e ilhas com corredores seguros.

## Campanha — 20 níveis (planejamento; NÃO implementados)
| # | Bioma / horário | Dificuldade | Chefe proposto |
|---|---|---|---|
| 1 | Rio tropical / manhã | Fácil | Ponte fortificada |
| 2 | Costa industrial / noite | Difícil | Encouraçado |
| 3 | Deserto / tarde | Médio | Helicóptero pesado |
| 4 | Pântano / manhã | Fácil | Submarino |
| 5 | Arquipélago / pôr do sol | Médio | Caça stealth |
| 6 | Fiorde gelado / noite | Difícil | Navio quebra-gelo bélico |
| 7 | Selva / tarde | Fácil | Drone enxame |
| 8 | Cidade costeira / noite | Médio | Aranha mecânica voadora |
| 9 | Cânion vulcânico / crepúsculo | Difícil | Fortaleza voadora |
| 10 | Vale alpino / manhã | Médio | Apache mecanizado |
| 11 | Rio dourado / tarde | Fácil | Navio artilhado |
| 12 | Megacidade / noite | Difícil | Robô humanoide aéreo |
| 13 | Delta / manhã | Médio | Porta-helicópteros |
| 14 | Tempestade ártica / tarde | Difícil | Borboleta bélica |
| 15 | Oásis / manhã | Fácil | Submarino furtivo |
| 16 | Floresta bioluminescente / noite | Médio | Abelha robótica gigante |
| 17 | Estaleiro / crepúsculo | Difícil | Destroyer tecnológico |
| 18 | Ilhas glaciais / manhã | Médio | Fortaleza submarina |
| 19 | Ruínas elétricas / noite | Difícil | Androide aéreo |
| 20 | Confluência de biomas / pôr do sol | Médio | Esquadrão de três comandantes |

Dificuldade não linear é intencional; números 1/2/3 servem como perfis de design e precisam de testes.

## Gráficos e desempenho
Camadas de terreno 2.5D e entidades 2D; 30 FPS estáveis como alvo no perfil Econômico, 60 FPS opcional em dispositivos melhores; particle budget, atlas, culling, sombras opcionais, resolução escalável e testes reais no Realme C55 e abaixo. Noite deve manter visibilidade com balizas, faróis e iluminação dos inimigos.

## Áudio e identidade do piloto
Composições originais alegre/vibrante em estética sintetizada 16/32 bits; trilha adaptativa e efeitos. Foto e nome do piloto armazenados localmente por padrão. Música local selecionada pelo usuário; integração com serviços de streaming apenas por APIs/SDKs e políticas oficiais. Não extrair áudio de vídeo do YouTube por meios não autorizados.

## Distribuição
Código compartilhado. Android com Capacitor e Windows com Tauri; ambos exigem projetos nativos, compilação, teste e assinatura. GitHub Releases pode hospedar instaladores; atualização desktop via updater assinado e Android por Play Store ou APK autorizado pelo usuário.
