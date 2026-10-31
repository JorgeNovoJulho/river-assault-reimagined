# Porto das Sombras — Texturas raster do Setor 02

O motor `src/render/premium-environment.js` já procura primeiro os seguintes PNGs homologados:

- `water.png` — textura de água azul industrial 1024x1024
- `bank_left.png` — margem esquerda portuária 512x1024
- `bank_right.png` — margem direita portuária 512x1024

Os três PNGs estão reunidos no pacote de instalação **RiverStorm_Missao02_Texturas_Premium_Instalacao.zip** criado nesta conversa. A biblioteca PNG não é enviada automaticamente por este README. **Enquanto estes arquivos não estiverem presentes no GitHub e no build web, o cenário ainda utilizará o desenho anterior.**

O pacote inclui manifesto SHA-256 e prévia de inspeção. Ao importar o ZIP, preservar os caminhos relativos desde a raiz `assets/`, sem criar pastas duplicadas.

Verificação após importação:

```bash
test -s assets/sprites/premium/approved/environment/mission_02_industrial/water.png
test -s assets/sprites/premium/approved/environment/mission_02_industrial/bank_left.png
test -s assets/sprites/premium/approved/environment/mission_02_industrial/bank_right.png
npm test
npm run check:phaser
npm run build
test -s dist/assets/sprites/premium/approved/environment/mission_02_industrial/water.png
test -s dist/assets/sprites/premium/approved/environment/mission_02_industrial/bank_left.png
test -s dist/assets/sprites/premium/approved/environment/mission_02_industrial/bank_right.png
```

A arte foi recortada de composição ilustrativa; antes da homologação visual, conferir repetição do padrão da água, emendas verticais, respeito à máscara variável do rio e ausência de veículos/HUD nos recortes. Não alterar mecânicas e não publicar `main`.
