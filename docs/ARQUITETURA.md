# Arquitetura do motor — etapa inicial

## Implementado
- `src/game/aircraft.js`: catálogo das 3 aeronaves e padrões de tiro, compartilhável pelas versões web/Android/Windows.
- `src/game/clock.js`: relógio de simulação com **passo fixo de 1/60 s** e limite de quatro atualizações acumuladas a cada quadro.
- `src/input/gamepad.js`: leitura e configuração de controles físicos.
- `tests/engine.test.cjs`: testes básicos do relógio e da presença dos 15 disparos.
- `.github/workflows/web-check.yml`: executa `npm test` antes do build web.

## Por que usamos passo fixo
No protótipo inicial, movimento, combustível e temporizadores estavam todos ligados à quantidade de frames exibidos. O novo relógio desacopla a atualização lógica do render; em uma tela de 30 Hz, por exemplo, pode executar dois ticks de lógica e um desenho. Reduzimos a velocidade de jogo variável e evitamos excesso de processamento após travamento.

**Limitação:** o núcleo ainda depende de lógica legado de 60 ticks/segundo. Uma modernização definitiva exigirá unidades por segundo, interpolação, física/collision pipeline e separação das entidades. As taxas reais devem ser medidas no Realme C55 e em modelos mais fracos.

## Próximas extrações
1. `src/game/player.js`: estado e manobras do jogador.
2. `src/game/fuel.js`: gasto, abastecimento, morte por falta de combustível.
3. `src/game/weapons.js`: disparos, dano, cooldowns e bombas.
4. `src/game/enemies.js`: comportamentos e colisões.
5. `src/game/levels.js`: dados dos 20 níveis e seed de geração.
6. `src/render/`: renderização 2D, 2.5D, escalabilidade e perfis mobile.

## Validar na máquina
```sh
npm install
npm test
npm run build
```
Abra a aba Actions no GitHub para verificar a conclusão do workflow. Testes de sintaxe foram verificados na integração, mas execução real Android/Windows segue pendente.
