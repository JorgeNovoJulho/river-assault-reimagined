# Roadmap inicial

1. Publicar o protótipo HTML e preservar original.
2. Modularizar lógica, controles, áudio e renderização em TypeScript.
3. Implementar joystick mobile e teclado/mouse desktop com testes.
4. Implementar 3 aeronaves, 15 armas, até 5 bombas e perda temporária de itens.
5. Criar 20 níveis distintos e chefes individuais; dificuldade não linear.
6. Criar cenários 2.5D escaláveis, com modo econômico no Realme C55 e inferiores.
7. Desenvolver soundtrack original, efeitos sonoros, foto e nome do piloto, músicas locais.
8. Empacotar Android e Windows, assinar e testar atualizações por plataforma.

**Nenhuma das etapas 2–8 está concluída.**


## Incremento de 26/10/2026 — versão 0.8.3
- Implementado steering gradual dos projéteis MISSILE e REFLECTED com busca do inimigo vivo mais próximo, alcance limitado e velocidade normalizada.
- Adicionada orientação visual de mísseis durante a curva.
- Ainda pendente: homologação em navegador e gamepads reais, testes longos de colisão, modularização integral e evolução 3D.
- A implementação no código não equivale à aprovação de QA; verificar resultados de CI e jogabilidade antes de release estável.
