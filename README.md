# River Assault Reimagined

Projeto independente de jogo arcade aéreo, inspirado na mecânica de clássicos do gênero. **Não afiliado a River Raid.**

## Estado atual
O protótipo HTML jogável foi importado em `index.html` e o original foi preservado em `legacy/`. **APK e EXE finais ainda não foram gerados.**

## Estrutura planejada
- `index.html`: protótipo jogável para navegador.
- `legacy/`: versão original preservada.
- `docs/`: design de jogo, 20 fases e roadmap.
- `package.json`: scripts Vite, Capacitor e Tauri.
- `.github/workflows/`: verificação automática da compilação web.

## Como executar agora
1. Abra `index.html` no navegador para testar o protótipo.
2. Para desenvolvimento, instale Node.js LTS e execute `npm install` e `npm run dev` no diretório do projeto.
3. Confira os testes em [Actions](https://github.com/JorgeNovoJulho/river-assault-reimagined/actions).

## Meta técnica
Núcleo único de gameplay para Windows (Tauri) e Android (Capacitor), gráficos 2.5D adaptativos, três aeronaves, vinte fases não lineares, perfis gráficos de baixo custo e lançamentos assinados em GitHub Releases / Play Store.

**Atenção:** nem compilação nativa, nem assinatura de apps, nem atualização automática estão prontas. Essas funcionalidades exigem etapas de implementação e validação próprias.

## Segurança
Não publique segredos, keystores, chaves de assinatura nem dados privados. Imagens de jogadores e músicas locais deverão permanecer privadas por padrão.