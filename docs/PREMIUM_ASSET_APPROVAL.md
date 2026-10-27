# RiverStorm — catálogo de arte premium (aprovação visual)

Estado: **direção artística dos sete conjuntos aprovada**. Recortes individuais em revisão técnica; **não aplicados ao jogo**.

Fonte aprovada: prancha com nave, margens esquerda e direita, ilhas, ponte, explosão (12 quadros) e água (três variações).

## Estrutura canônica
`assets/sprites/premium/review/` — original e sete recortes, imutáveis.
`assets/sprites/premium/candidates/` — extrações e refinamentos individuais, até homologação.
`assets/sprites/` — sprites ativos no jogo, preservados até aprovação dos substitutos.

## Validação obrigatória
1. Salvar os binários da arte na estrutura canônica do **repositório**, antes de apontar o código para eles.
2. Retirar fundos, legendas e elementos cruzados; padronizar transparência, escala e ponto de origem.
3. Corrigir costuras de água/margens e avaliar atlas/spritesheets, memória e legibilidade.
4. Apresentar os arquivos isolados para aprovação.
5. Integrar primeiramente na Arena Phaser com rollback; jamais substituir mecânicas, músicas ou áudio da campanha.
6. Validar build, URL publicada, carga de assets, áudio original e comandos antes de integrar na campanha.

**Nota de sincronização:** as imagens raster individuais estão atualmente no pacote de revisão gerado na conversa; o catálogo neste repositório não significa que esses PNGs já foram enviados. Só declarar cada asset disponível no jogo depois de confirmar seu caminho e SHA no GitHub.
