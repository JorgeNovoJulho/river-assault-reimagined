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
- LAN: anfitrião e até sete convidados testados com perdas de sinal, dispositivos mistos e pontuação íntegra.

## Prévia Web atual

- Online: a abertura conecta ao PeerJS Cloud. O cliente é compilado no pacote local e dispensa CDN.
- LAN: no computador anfitrião, rode `npm ci` e `npm run build`. Em PowerShell, configure
  `$env:RIVER_LAN_BIND='0.0.0.0'` e rode `npm run lan`. Os convidados abrem
  `http://IP-DO-ANFITRIAO:8080/?lan=1` na mesma rede e usam o código e a senha gerados no lobby.
  Para HTTPS, forneça `RIVER_LAN_CERT` e `RIVER_LAN_KEY` com um certificado confiável pelos aparelhos.
  Após instalar as dependências e compilar, a sinalização e as conexões LAN não precisam de internet.
- O limite é de oito pilotos no total, incluindo o anfitrião. O anfitrião inicia cada rodada.
  Cada rodada usa três missões, com as missões 19 e 20 na última rodada possível.
  O pior resultado sai da disputa. Quem não conclui perde prioridade. Um único piloto restante vence.
- O host valida autenticação, ordem das missões e limites dos valores. O navegador ainda calcula
  o próprio resultado, portanto o placar serve para partidas entre pessoas de confiança.
- A desconexão do canal tem janela de retorno de 25 segundos no mesmo navegador, enquanto a
  instância do anfitrião estiver ativa. A rodada tem limite de 15 minutos.
- Descoberta automática, hospedagem dentro dos instaladores Windows e Android, redes entre
  aparelhos físicos e persistência do torneio após fechar o anfitrião ainda exigem homologação
  ou implementação conforme o caso.
