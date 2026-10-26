# RiverStorm Nova Geração — Contrato de desenvolvimento

## Separação obrigatória
- Original congelado na branch `main`; não atualizar por causa da Nova Geração.
- Nova Geração desenvolvida exclusivamente na branch `full-game-graphics-integration`.
- `graphics-phaser-sprites` é laboratório de ferramentas e arte, não uma segunda implementação do jogo.

## Fonte única de jogabilidade
O motor oficial de RiverStorm existente na `main` é a referência canônica de gameplay. Não portar nem recriar regras dentro de um laboratório separado. Manter intactos: 20 setores, 20 arenas e seus inimigos/chefes, padrões de movimento, armas, parry, escudo, bombas, habilidades, afinidades e fraquezas, música, dados persistentes, controles, itens, IA, cenários e missões.

## Estratégia gráfica
1. Mapear renderizador, todas as classes de entidades e seus estados de animação.
2. Criar contrato para adaptador de sprites e atlas de animação; selecionar backend Canvas ou Phaser, sem alterar o estado simulado.
3. Substituir desenhos genéricos por silhuetas específicas e sprites de qualidade, começando por aeronaves, mechas, tanques, submarinos, botes, guindastes e chefes.
4. Renovar todos os 20 biomas, cenários e objetos mantendo dimensões/colisões reais.
5. Adicionar partículas, água, iluminação, impactos e habilidades sem alterar dano ou timing.
6. Otimizar FPS, memória, reutilização de atlas e renderização por culling.
7. Validar visualmente em navegador real e comparar com modo clássico.
8. Rodar testes de regressão das 20 missões, música, controles, interação pré-boss e persistência.
9. Alterar mecânicas apenas após a estabilização gráfica ou para corrigir regressões críticas.
10. Aprovar produto final antes de promover qualquer código para `main`.

## Critérios de conclusão
- Paridade funcional validada com o original, não apenas similaridade aparente.
- Sprites distintivos para cada categoria (sem redimensionar a mesma forma).
- Tela de habilidades pré-boss não bloqueia progressão.
- 14 faixas presentes e reproduzíveis nos caminhos locais/deploy permitidos.
- Desempenho e estabilidade testados em navegador, desktop e mobile-alvo.
- Nunca declarar integração Phaser concluída sem execução real do backend Phaser.

## Estado
Contrato documentado. Plano de migração pendente de homologação. `main` não alterada.
