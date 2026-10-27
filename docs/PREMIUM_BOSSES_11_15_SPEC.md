# RiverStorm — Bosses 11–15 · especificações gráficas de produção

Fonte de verdade: `src/game/campaign.js` e mecânicas existentes. A arte deve seguir a direção **raster Arcade Premium**, top-down, sem formas vetoriais simplificadas.

| Nível | Missão | Boss oficial | Silhueta e componentes propostos (somente arte) |
|---|---|---|---|
| 11 | Rio Dourado | CRUZADOR DOURADO | Cruzador fluvial blindado; casco comprido, convés, torretas independentes, propulsores, pintura bronze/ouro |
| 12 | Metrópole Noturna | ANDROIDE NOTURNO | Mecha humanoide de combate; braços articulados, ombros armados, visor, propulsores e juntas reconhecíveis |
| 13 | Delta Selvagem | PORTA-HELICÓPTEROS | Navio-aeródromo pesado; convés marcado, hangares, radares, suportes e rotores de veículos auxiliares |
| 14 | Tempestade Polar | BORBOLETA AÇO | Mecha alado simétrico; quatro asas metálicas articuladas, corpo central, lâminas, luzes frias |
| 15 | Oásis Perdido | SUBMARINO INVISÍVEL | Submarino furtivo; casco hidrodinâmico, torres, sonar, hélices, variantes de camuflagem somente visuais |

## Requisitos obrigatórios antes de integração

1. Produzir **um arquivo-mestre raster de alta resolução por boss**, vista superior consistente com a câmera; não usar recortes de atlas com etiquetas/fundos embutidos.
2. Isolar corpo e peças móveis em PNG/WebP transparentes, com pivôs documentados; manter partes opcionais independentes.
3. Preparar variações visuais de ataque, dano e destruição **sem criar/modificar padrões de ataque, armas, dano ou colisões existentes**.
4. Homologar silhueta, transparência, paleta e renderização em 1080p; otimizar atlas para mobile e preservar visual em 4K.
5. Apresentar cada boss para aprovação antes de instalar; salvar fontes, candidatos e aprovados em `assets/sprites/premium/bosses/11`…`15`.
6. Migrar apenas a camada de exibição do laboratório Phaser com fallback e rollback; verificar FPS, áudio e campanha intacta.

## Status
- Inventário e especificações: **concluídos**.
- Prancha gerada nesta etapa: **referência genérica; não aprovada como sprites definitivos**.
- Bosses finais isolados: **pendentes de produção**.
- Instalados no jogo: **não**.
