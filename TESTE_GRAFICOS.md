# Testar RiverStorm completo com gráficos novos

Esta versão usa **o motor original integral** (20 setores, armas, chefes, especiais, itens, saves e controles oficiais).
A novidade está somente no renderizador experimental, como uma camada opcional.

## Acesso direto (hospedagem externa não homologada)
Tente abrir:
https://raw.githack.com/JorgeNovoJulho/river-assault-reimagined/full-game-graphics-integration/index.html?graphics=enhanced

> O serviço externo não foi validado. Se não carregar, use o procedimento local abaixo.

## Teste local reproduzível
1. Baixe o ZIP da branch:
   https://github.com/JorgeNovoJulho/river-assault-reimagined/archive/refs/heads/full-game-graphics-integration.zip
2. Extraia tudo em uma pasta.
3. Abra um terminal **dentro da pasta extraída** e execute `python -m http.server 8000` (ou `py -m http.server 8000` no Windows).
4. Abra http://localhost:8000/index.html?graphics=enhanced
5. Use o botão no canto superior direito para alternar os gráficos sem reiniciar e compare:
   - `?graphics=enhanced`: camada nova ligada
   - `?graphics=classic`: apenas gráficos originais

## Testes pendentes
- Confirmar execução em Chromium e Edge, áudio e controles.
- Conferir todas as 20 arenas, chefes e efeitos contra o jogo original.
- Ajustar proporcionalidade, oclusão e identidade de sprites.
- Testar FPS e uso de memória em dispositivos reais.

Não mesclar na `main` antes de homologar.
