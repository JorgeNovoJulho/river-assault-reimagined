# Auditoria de requisitos — 25/10/2026

## Corrigido nesta revisão
- Faixa de diálogo separada da área do jogo (não cobre o chefe nem o HUD).
- Patente compacta na mesma linha do escudo.
- Falas de derrota dos bosses normais e contador de diálogo estendido.
- Botão superior renomeado CONFIGURAÇÕES, e acesso pelo menu de pausa permanece.
- Coletas de armas HÍBRIDO, 360°, RASTREADOR e MULTI passam a ativar os tiros corretos.
- 20 fases e 20 identificadores de chefes, com desenhos em cinco famílias e variantes.
- Teste de início do jogo no navegador, compilação HTML e pipeline Android existentes.

## Implementado anteriormente, mas carece de testes prolongados
- Joystick mobile, mouse/teclado/gamepad, três aeronaves básicas e duas desbloqueáveis.
- Combustível estratégico, caixas de escudo, bombas até cinco, 50 tiros especiais.
- Resgates de soldados, pontes/represas com HP, ilhas irregulares.
- 90 segundos mínimos de missão, graduações/patentes por campanha e multiplicador de pontuação.
- Variações climáticas de sol, chuva, neve, neblina, dia/tarde/noite.
- Cinco famílias de bosses com diferentes padrões de projéteis.
- Playlist MP3 local importável, ordem embaralhada e reprodução sequencial.
- Fluxo de três vidas, um continue e recuperação de bombas.

## Pendências importantes ainda NÃO concluídas
- Reformulação visual 3D/2.5D profissional de verdade: malhas e materiais 3D, sprites finais, fauna, iluminação e animação dedicadas.
- Vinte mapas com trajetos, arquitetura, narrativa, obstáculos e bosses integralmente exclusivos (a maior parte hoje ainda compartilha o gerador procedural e estruturas).
- Vinte chefes com mecânicas realmente diferentes: fases, IA, defesa, transformações, ataques especiais e interações destrutíveis, não apenas dispersão e cadência.
- Ataque de míssil perseguidor real com busca de alvo e steering: o padrão TRACKER existente ainda usa projetil básico sem orientação.
- Todos os sistemas de colisão e travamento da nave homologados com testes duradouros, especialmente Android.
- Músicas de terceiros embarcadas: a biblioteca de gravações fornecidas não pode ser considerada incluída no APK público; é necessária autorização de redistribuição e acesso aos arquivos no build.
- Versão Windows .exe nativa instalável e atualização automática assinada entre plataformas.
- APK release assinado de forma persistente e distribuição com atualizações sem reinstalação.
- Foto/nome do piloto, importação de músicas externas por YouTube/Spotify conforme regras de cada serviço.
- Testes de performance e memória em Realme C55 e aparelhos inferiores, controle USB/Bluetooth real, múltiplas resoluções.
- Verificar progressão de jornada 2 em diante, troca das patentes e persistência após todas as 20 fases.

## Prioridade técnica
1. Corrigir travamentos e criar testes e2e de partidas, dano, drops e boss.
2. Separar HTML monolítico em player, world, combat, HUD e UI.
3. Substituir assets vetoriais por renderizador 3D leve e sprites autorais.
4. Desenvolver campanhas e chefes singulares com homologação por missão.
5. Gerar releases estáveis e assinadas APK/EXE e pipeline de atualização.

## Diagnóstico CI — 26/10/2026
- Investigados logs do job de teste: 53 testes, 37 aprovados e 16 reprovados na versão 0.8.3 com regressões adicionadas.
- Testes do fluxo de continue e entrada de boss atualizados para as regras atuais (10 continues e escolha de habilidade pré-boss).
- Cobertura acrescentada para promoção NG+, perfil de piloto, playlist exclusiva do boss e perseguição de mísseis.
- Persistem 16 falhas na suíte: muitas são verificações textuais de implementações anteriores. Precisam ser classificadas entre regressões reais e assertivas obsoletas, sem ocultar falhas.
- GitHub Pages já publicou versão anterior, mas pipeline completo não foi homologado.
- Pendente: testes de longa duração/colisão, extração modular do HTML, arte 2.5D/3D final, 20 chefes exclusivos, e builds APK/EXE assinadas/homologadas.

## Atualização de pendências — 26/10/2026 (revisão de checkpoints)
### Confirmado por pipelines anteriores
- GitHub Pages, validação web, smoke browser e geração de APK de TESTE tiveram execução com sucesso no commit 87d2225d. Isso não equivale a homologação de dispositivos nem assinatura de release.
- A antiga anotação de 16 testes reprovados refere-se a 0.8.3: foi resolvida em revisões posteriores. Não deve ser interpretada como estado atual.
- Efeitos de habilidades na transição, rastros de projéteis, controle de dano e progressão XP receberam correções com testes de regressão.
### Implementado nesta revisão, aguardando CI
- Impedir que salvar missão avulsa sobrescreva checkpoint de campanha legítima.
- Testar no navegador checkpoint sequencial válido e preservação após tentativa de salvamento de missão avulsa.
### Pendências de verdade
1. Testes e2e das 20 missões consecutivas e NG+ em múltiplas jornadas, inclusive reinicialização real do navegador, save/load e ausência de exploits.
2. Stress test de colisões/projéteis/efeitos em sessões longas (incluindo pausas e retomadas) e testes de FPS e memória.
3. Modularizar o HTML principal em componentes próprios de combate, mundo, HUD e menus com segurança e testes.
4. Desenvolver 20 mapas plenamente diferenciados e 20 chefes com IA, fases e mecânicas realmente exclusivas.
5. Produzir assets finais 2.5D/3D, animações, partículas, efeitos e otimizar perfil econômico.
6. Homologar controles físicos e desempenho em Android real, inclusive Realme C55 e modelos inferiores.
7. Criar release instalável Windows assinado e Android APK/AAB assinado com fluxo de atualização.
8. Identidade de usuário global exclusiva e foto sincronizada dependem de backend/autenticação; o perfil atual é local.
9. Trilhas de terceiros só podem ser embarcadas com arquivos e autorizações apropriadas.
