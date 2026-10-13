# Interface do estudante — relatório da implementação

A interface foi construída com HTML, CSS restrito ao contêiner e JavaScript modular.
Utiliza diretamente `carregarBanco` e `criarMecanismo` de `../mecanismo/index.mjs`,
sem recriar a lógica de seleção. Usa exclusivamente os 100 itens inéditos aprovados.

## Fluxo e apresentação

- Início com identificação MatemáticaFC, título, 30 questões, cinco assuntos, orientações e botão de início.
- Uma questão por vez, enunciado, recurso visual e quatro alternativas em controles nativos.
- Anterior, Próxima e navegação numerada de 1 a 30. Contador, progressão e estado respondida/não respondida, sem correção durante a aplicação.
- Respostas alteráveis e removíveis; ordenação mantida no mesmo objeto de aplicação.
- Confirmação modal obrigatória, com contagem das questões sem resposta. Escape ou continuar cancela sem perder escolhas.
- Após confirmar: acertos, percentual e desempenho nos cinco assuntos. Gabarito comentado acessível por botão e resoluções em itens expansíveis.
- Nova aplicação gerada pelo mecanismo existente, com conjunto diferente do imediatamente anterior e respostas reiniciadas.

Todos os textos pedagógicos são os recebidos do mecanismo. As alternativas são
corrigidas por seus identificadores estáveis, e a letra mostrada no gabarito é a
letra atribuída após o embaralhamento. Resultados são calculados somente depois
de `finalizar()`. O percentual inclui questões sem resposta no denominador e usa
até uma casa decimal. Não foi implementado boletim ou PDF.

SVGs são inseridos com `viewBox`, título e descrição originais e dimensionados com
largura responsiva e altura automática. Tabelas preservam seus cabeçalhos. Não há
fontes, imagens ou bibliotecas externas na execução do estudante. Valores em reais
são texto normal; os itens atuais não exigem MathJax.

## Testes executados

O comando de testes foi executado com capturas ativadas: **8 testes executados,
8 aprovados, zero falhas, zero ignorados**. Ambiente: Node v24.19.0, Chromium
154.0.8037.57, Playwright 1.61.1. Playwright é dependência apenas de desenvolvimento.

Os testes em navegador cobriram navegação, mudança e limpeza de respostas,
estabilidade da ordem, falta de correção antes de finalizar, confirmação e
cancelamento, resultado com questões em branco, 30 respostas, nova aplicação,
erro de carregamento, teclado e foco. O cálculo foi testado também com correção
incompleta ou incompatível. Na aplicação completa de teste foram marcadas 15
corretas e 15 incorretas: a interface apresentou exatamente 15 acertos, 50% e os
totais esperados por assunto. As 30 resoluções foram comparadas ao banco e as
letras corretas ao embaralhamento da aplicação.

O teste de integração verificou seis itens por assunto, 8 fáceis/14 médias/8
difíceis, pelo menos 15 visuais e ausência de IDs repetidos. O mecanismo não foi
alterado; sua bateria anterior de 10.000 seleções permanece preservada.

Layout e navegação foram testados em 320, 768 e 1280 pixels, com capturas adicionais
em celular de 390 pixels. Não houve overflow horizontal; os botões numerados
mantiveram alvos de pelo menos 44 × 44 pixels. Os 58 SVGs e as duas tabelas do
banco foram renderizados em laboratório de teste a 320 pixels, sem modificar o
banco. Foram verificadas proporções e limites de largura dos SVGs. Capturas das
telas inicial, questão e resultado foram inspecionadas em computador e celular.

A [execução estruturada](resultado-testes.json) e as [capturas](README.md) registram
as evidências. O teste de capturas é opcional na execução comum e é marcado como
ignorado quando `MFC_CAPTURAS` não está definido.

## Arquivos criados ou modificados

Criados na pasta `interface/`:

- `index.html`, `estilos.css`, `estudante.mjs`, `resultados.mjs`.
- `testes/interface.test.mjs`.
- `package.json`, `package-lock.json`, `.gitignore`.
- `README.md`, `relatorio-interface.md`, `resultado-testes.json`.
- `inspecao/inicio-computador.png`, `inicio-celular.png`, `questao-computador.png`, `questao-celular.png`, `resultado-computador.png`, `resultado-celular.png`.

Modificado: `../README.md`, somente para indicar a interface e o estado atual.
A comparação por SHA-256 confirmou que nenhum banco, questão, recurso SVG, módulo
ou teste do mecanismo, relatório pedagógico ou arquivo de outro ano foi alterado.
As dependências instaladas em `node_modules/` ficam ignoradas pelo Git.

## Abertura, privacidade e limites

O [guia de abertura e testes](README.md) contém os comandos. Servir a raiz do
repositório por HTTP e abrir a pasta da interface na porta escolhida. O arquivo
isolado via `file://` não funciona por depender de módulos e JSON.

As respostas ficam somente em memória. Não há cadastro, login, telemetria,
localStorage ou sessionStorage nesta interface. Fechar ou recarregar a página
encerra a aplicação; essa informação está na tela inicial. O histórico opcional
existente no mecanismo não foi ativado. A projeção pública não traz gabaritos ou
resoluções; os arquivos do banco carregados no navegador podem ser inspecionados,
conforme a limitação já documentada do processamento local.

Integração e estilos do tema do Blogger ainda exigem validação em rascunho autorizado
com URLs HTTPS de hospedagem dos recursos. Nada foi publicado. Outros navegadores,
restauração após recarga, boletim e PDF permanecem fora desta etapa.
