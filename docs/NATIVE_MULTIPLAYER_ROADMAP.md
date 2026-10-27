# RIVER STORM — Distribuição nativa e multiplayer LAN (27/10/2026)

## Objetivos
- HTML/web: testes rápidos, não o produto instalável final.
- Windows: instalador NSIS via Tauri 2, janela redimensionável, acesso a recursos de rede via backend Rust autorizado.
- Android: APK via Capacitor, layout com safe areas, botões grandes e controles de toque.
- CI simultânea: workflow `native-test-packages.yml` com dois jobs independentes.

## Estado real
- Configurações iniciais Tauri e Capacitor adicionadas; plataformas e instaladores ainda não foram homologados em dispositivos reais.
- Workflow para debug APK e NSIS adicionado, mas a execução e geração de artefatos ainda precisam ser verificadas.
- Android debug APK NÃO serve para atualização segura em produção. Exige assinatura de release e package id estável.
- Windows atualização automática requer assinatura do Tauri updater, chave pública no app, chave privada segura no CI e endpoint confiável. Não executar binários arbitrários retornados pela API do GitHub.
- Nesta etapa, a tela inicial faz somente a consulta informativa a uma release do GitHub. A instalação automática NÃO foi habilitada.

## Protocolo proposto de partidas (fase de implementação)
1. Host inicia servidor na LAN com ID aleatório, senha (comparar hash forte e com nonce), identificador de sessão.
2. Descoberta na LAN por mDNS/UDP no backend nativo. Android exige permissões e multicast lock conforme implementação; descoberta bluetooth é futura, distinta do transporte de dados.
3. WebSocket local autenticado para lobby: `hello`, `join`, `leave`, `ready`, `start_round`, `score_delta`, `round_result`, `eliminate`.
4. A sala aceita no máximo oito participantes e não transmite controles ou projéteis; os pilotos jogam campanhas locais.
5. Eliminação de um jogador por etapa de três missões, com pausa/espera de ranking após cada etapa. Após 7 etapas, campeão único.
6. O host valida progressão e score com sequência, limite de variação e trilha de eventos; resultados não devem confiar cegamente no cliente.
7. Em desconexões: janela de reconexão e decisão explícita sobre forfait.
8. Online requer serviço de sinalização e arquitetura contra NAT, diferente da descoberta LAN. Bluetooth requer emparelhamento/permissões; não prometer compatibilidade multiplataforma imediata.

## Critérios de homologação
- CI compila Windows e Android e publica artefatos válidos.
- Android: telas pequenas, recorte/notch, barras de navegação, paisagem/retrato e toque duplo testados em aparelhos físicos, incluindo dispositivos de baixo desempenho.
- Windows: instalador abre, menu de modo funciona e seleção de resolução efetivamente ajusta Canvas.
- Atualizações: release assinado, verificação de assinatura, comparação semântica de versão, rollback e confirmação do usuário quando exigida.
- LAN: host e oito convidados testados com perdas de sinal, dispositivos mistos e pontuação íntegra.
