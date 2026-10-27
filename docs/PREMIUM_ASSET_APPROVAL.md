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

## Revisão técnica v3 (27/10/2026)
- Separados **12 quadros de explosão**, normalizados em células transparentes de **128 × 128 px** e atlas **4 colunas × 3 linhas**.
- Exportado PNG individual da nave premium e preservados todos os PNGs candidatos e os recortes da prancha aprovada.
- Manifesto de SHA-256 e tamanhos acompanha o pacote `RiverStorm_Premium_Preparacao_v3.zip` disponibilizado na conversa.
- **Status dos binários:** pacote local, ainda não transferido para este repositório. As entradas PNG não podem ser ativadas no runtime enquanto não forem efetivamente publicadas e verificadas.
- Margens, ponte e água ainda contêm cenários compostos / bordas; não homologados como texturas repetíveis ou transparências utilizáveis diretamente.
- **Proteção:** nenhum script de campanha, áudio, playlist, música, controles, colisões ou dano foi modificado nesta revisão.
- Próxima aprovação obrigatória: arquivos transparentes e sem artefatos, atlas e pré-visualização da arena Phaser, antes de substituição.
