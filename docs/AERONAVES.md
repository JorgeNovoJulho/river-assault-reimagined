# Aeronaves e armamentos — primeira integração

**Implementado no protótipo web:** seleção no menu inicial, persistência local da escolha, atributos próprios por aeronave, 15 padrões de disparo, cores diferenciadas e recolhimento de power-ups adaptado a cada modelo.

| Avião | Movimento lateral | Velocidade-base do cenário | Consumo-base / quadro | Cinco padrões |
|---|---:|---:|---:|---|
| Falcão | 6,5 | 3,2 | 0,050 | Simples, Duplo, Leque, Laser, Mísseis Guiados |
| Vespa | 7,3 | 3,9 | 0,065 | Rajada, Alternado, Agulhas, Pulso, Microfoguetes |
| Cometa | 8,2 | 4,6 | 0,082 | Canhão Rápido, Diagonais, Tridente, Raio Concentrado, Precisão |

Acelerando (comando para cima) ou freando (para baixo), a taxa de consumo continua variando conforme o deslocamento relativo.

## Regras da seleção
- Escolha no menu antes de iniciar.
- A escolha é aplicada em **Iniciar Jogo** e **Jogar Novamente**.
- Cada aeronave começa com a primeira arma de seu conjunto.
- Itens comuns seguem a progressão de 5 classes e concedem a arma equivalente do avião selecionado durante 600 quadros.
- Após o tempo do bônus, a arma retorna à primeira do conjunto.
- Todos começam com 3 bombas, mantendo a implementação atual de bomba.

## Limitações conhecidas / próximos passos
- Os aviões ainda usam o mesmo desenho estrutural Canvas com cores diferenciadas, não sprites exclusivos completos.
- O ajuste de dano, cadência e dificuldade precisa de testes; os 15 padrões são variações funcionais de disparo, não 15 árvores de upgrade completas.
- Falta seleção totalmente navegável pelo gamepad, UX mobile específica e tela de estatísticas.
- O motor ainda roda em uma página HTML grande; `src/game/aircraft.js` é o primeiro módulo de lógica independente.
- Os valores por quadro atuais herdam o comportamento do protótipo original: a conversão para tempo real baseado em delta time ainda será necessária.
- Não foram compilados nem homologados APK/EXE.
