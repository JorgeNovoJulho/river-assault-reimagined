# RiverStorm Premium — referência visual canônica da tela de combate

**Referência aprovada:** imagem fornecida pelo usuário `batalha_fluvial_em_pixel_art.png` (941 × 1672 px; retrato). Não substituí-la por fundos prontos: trata-se de uma **referência de composição e acabamento**, não de uma textura jogável.

## Regra central
O motor, os controles, as hitboxes, a física, a dificuldade, as armas, as habilidades, a música, os spawns e a progressão do núcleo original NÃO devem ser recriados. A conversão é visual e deve manter paridade com a ramificação `main` original.

## Composição de combate
1. Rio com deslocamento vertical, curvas/variação de largura, correnteza detalhada e água sombreada, ocupando a faixa central.
2. Margens com vegetação, rochas e relevo orgânicos, continuidade entre tiles, sem bordas retangulares visíveis.
3. Torres defensivas e tanques ancorados **em terra**, com silhueta reconhecível, canhões apontando ao jogador e estado de dano próprio; sprites por entidade.
4. Pontes e represas com vão navegável/corredor lógico original, segmentos esquerda/direita, material e dano coerentes; não repetir a mesma arte incessantemente.
5. Ilhas com recorte alpha irregular e máscara compatível com o rio; nada de retângulos ou sprites de torre usados como terreno.
6. Helicópteros, barcos, submarinos, mechas e aviões com PNGs individuais e animações distintas, sem reutilização de boss ou placeholder.
7. Nave do jogador com leitura nítida no terço inferior; drones apenas quando coletados; parry/escudo mantêm lógica original.
8. Disparos de cada uma das 19 armas com sprites identificáveis, tamanho controlado e padrão cinemático original — sem uniformizar todos os projéteis.
9. Explosões, bombas, tiros inimigos, respingos e iluminação em camadas, com limites de partículas para não encobrir a ação.
10. HUD: vidas, bombas, pontos, escudo/parry e estado da arma legíveis e discretos; não ocupar o rio com placas decorativas.
11. Clima e dia/noite próprios de cada missão; o exemplo não exige chuva ou mar revolto o tempo inteiro.
12. Paleta: água azul profunda/turquesa, vegetação verde detalhada, metal grafite e realces laranja/azul. Proibir saturação excessiva e quadrados técnicos.

## Critérios verificáveis antes de marcar "concluído"
- PNG real instalado no repositório; alpha recortado; ausência de textos/etiquetas, moldura de atlas ou fundos sólidos acidentais.
- Cada entidade aponta para **seu** sprite; nada de fallback visual incorreto.
- Aparência auditada em desktop e mobile, com captura de navegador, no jogo original copiado.
- Objetos se movem/atiram/colidem exatamente como na base; execução e FPS comprovados.
- Música original e efeitos audíveis após interação inicial (respeitando políticas de autoplay).
- Registros e screenshots das 20 áreas, 20 bosses, 19 armas, cenário, margens e condições climáticas.
- Não alterar `main`; trabalho somente em `riverstorm-premium-nucleo`.

## Não concluído / bloqueios
A referência visual não constitui um atlas de sprites recortados: NÃO recortar automaticamente suas unidades para produção. A biblioteca enviada `riverstorm.rar` precisa ser extraída e auditada; até isso acontecer, não marcar as texturas como integradas. O PNG fornecido nesta conversa está disponível localmente, mas não foi enviado ao repositório.
