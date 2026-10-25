# Direção de arte — River Assault

## Regra de produto
O HTML original é somente uma referência de mecânicas, nunca uma especificação de arte. Manter identidade visual própria, legível em telas mobile e inspirada em jogos de ação contemporâneos.

## Versão implementada agora — base 2.5D procedural
- Novo renderer `src/render/scene2d5.js` integrado ao jogo.
- Rio com gradientes, variação de brilho, sombras costeiras e textura de movimento.
- Elevação sugerida por volumes, sombras e camadas de vegetação, montanhas e edifícios.
- Aeronaves Falcão, Vespa e Cometa redesenhadas com silhuetas diferenciadas.
- Inimigos redesenhados no renderer, luzes de sinalização nas fases noturnas.
- 20 direções cromáticas de fases: selvas, cidades, deserto, glacial, vulcânico e ambientes mistos.
- Modo Econômico (menos elementos) ou Equilibrado (mais detalhes).

## Estado real / ainda NÃO implementado
- Cenários 3D reais (malhas, materiais PBR, texturas de qualidade, câmera ortográfica/perspectiva).
- Assets artísticos finais, animação skeletal, partículas GPU, pós-processamento, reflexos e iluminação dinâmica real.
- Flora e fauna com sprites/meshes exclusivos e comportamento em cada nível.
- Vinte mapas de fases efetivamente distintos com transições e bosses finais exclusivos.
- Performance homologada em Realme C55 e aparelhos inferiores.

## Próxima meta de arte
Migrar o terreno para renderização 3D leve, mantendo sprites 2D para entidades; câmera top-down inclinada suave; malhas modulares, instancing, texturas comprimidas, atlas, culling, LOD; iluminação limitada e modo lite mantendo cenário legível. Definir diretrizes de assets licenciados/originais, estilo de material, orçamento máximo de triângulos/texturas, FPS medidos por aparelho e testes de qualidade para Android WebView e Windows Tauri.

## Validação
Abrir a demo GitHub Pages, iniciar partida, alternar aeronaves e conferir cada modo de qualidade. Verificar se as silhuetas, cores noturnas, UI, FPS e controles são adequados antes da próxima arte.
