# Implementação e validação do Boletim de Desempenho

Data da validação: 13/10/2026. Branch: `desenvolvimento-simulado-6ano`.

## Resultado

Concluída a integração dos módulos que haviam sido iniciados. O estudante pode
começar com ou sem nome, responder e alterar escolhas, confirmar a finalização,
consultar o desempenho e escolher baixar PDF, imprimir ou consultar na tela.
O favicon oficial e a navegação anterior foram preservados.

Resultados apresentam acertos, erros, questões não respondidas, percentual sobre
30 questões e desempenho nos cinco assuntos, com seis questões por assunto.
As não respondidas contam como sem acerto, separadas dos erros. O gabarito tem
as 30 questões na ordem da aplicação, alternativas com as letras embaralhadas,
indicação da escolha e da resposta correta e resolução comentada original.
O resultado e as opções de exportação só são construídos após a confirmação.

O PDF contém resumo na primeira parte e gabarito completo na segunda, com data,
nome quando informado, enunciados, quatro alternativas, escolhas, respostas,
resoluções e recursos visuais. Usa A4, margens de 16 mm, paginação e indicação de
continuação. SVGs são rasterizados em alta resolução sem modificar o banco;
tabelas são desenhadas no PDF. A versão de impressão conserva os SVGs vetoriais
e separa o resumo do gabarito por quebra de página.

Nome e resultados ficam em memória. O teste de rede registrou somente GETs locais
de arquivos estáticos, sem dados pessoais em URLs ou corpos. Não há armazenamento
em localStorage/sessionStorage, serviços de PDF externos, cadastro ou login.
A biblioteca e a fonte são locais, com carregamento sob demanda. Se uma imagem
falhar, o PDF traz sua descrição e a interface avisa. Se uma dependência falhar,
é possível repetir o download sem perder os resultados.

## Arquivos

Criados nesta implementação (incluindo os módulos antes iniciados):

- `boletim.mjs`: snapshot imutável, nome normalizado, data e correção pós-finalização.
- `pdf.mjs`: fonte Unicode, texto, tabelas, SVGs e download local.
- `impressao.mjs`: documento independente para impressão A4.
- `vendor/entrada-jspdf.mjs`, `vendor/jspdf.mjs`, `vendor/LICENCA-jsPDF.txt`: jsPDF 3.0.4 e entrada de reprodução do bundle.
- `fontes/DejaVuSans.ttf`, `fontes/LICENCA-DejaVu.txt`: fonte e licença.
- `relatorio-boletim.md`, `resultado-testes-boletim.json` e `inspecao/boletim/`: documentação e evidências.

Atualizados:

- `estudante.mjs`: campo opcional, resultados e ações de consulta/exportação.
- `estilos.css`: campo e indicadores responsivos, sem alterar a apresentação do favicon.
- `resultados.mjs`: contagem distinta de erros e questões não respondidas.
- `testes/interface.test.mjs`: integração completa, PDF real, impressão e recuperação de falhas.
- `package.json`, `package-lock.json`: dependências fixadas para testes e reprodução do bundle.
- `README.md`: execução, testes, privacidade, dependências e integração.

Os arquivos do favicon e suas capturas pertencem ao ajuste anterior e foram
preservados. A comparação SHA-256 de 92 arquivos dos bancos e mecanismo contra
a cópia anterior confirmou zero alterações. Nenhum outro ano ou assunto foi editado.

## Testes executados

Ambiente: Node.js 24, Chromium 154, Playwright 1.61.1 e Poppler.

```sh
MFC_CAPTURAS=/tmp/mfc-boletim-regressao \
MFC_BOLETIM_CAPTURAS=/workspace/matematicafc-site/atividades-interativas/simulados/6-ano/bloco-1/interface/inspecao/boletim \
npm test --prefix atividades-interativas/simulados/6-ano/bloco-1/interface
```

**10 testes executados e aprovados; zero falhas e zero ignorados**, em 32,6 segundos:

1. Navegação, ordem fixa, mudança e limpeza das respostas, sem correção antecipada.
2. Confirmação, cancelamento, Escape e finalização sem respostas.
3. Aplicação com 30 respostas, desempenho por assunto, cotas e nova aplicação.
4. Recursos dos 100 itens (58 SVGs e duas tabelas), responsividade em 320/768/1280 px e alvos de toque.
5. Falha de carregamento do banco e recuperação sem cadastro ou armazenamento.
6. Navegação por teclado, seleção e foco contido na confirmação.
7. Cálculo dos resultados e rejeição de correção incompatível.
8. Capturas da interface em computador e celular.
9. Nome opcional, preenchimento parcial, resultados, consulta, PDF, impressão e reinício.
10. Falha de carregamento da fonte do PDF e nova tentativa bem-sucedida.

No teste de exportação, foram registradas duas respostas corretas, uma incorreta
e 27 não respondidas: 6,7%. O PDF efetivamente baixado foi lido com `pdftotext`:
os enunciados, as quatro alternativas, as escolhas, as letras corretas e as
resoluções das 30 questões foram comparados à aplicação, na mesma ordem.
Cabeçalhos de continuação e rodapés foram removidos apenas do texto extraído
para essa comparação. `pdfimages` confirmou a incorporação das 22 ilustrações SVG
selecionadas nessa aplicação. O exemplo final tem 31 páginas; a extensão varia
conforme as questões e ilustrações sorteadas.

Também foi baixado um PDF sem nome e confirmada a ausência do campo pessoal.
A impressão foi verificada pela chamada da API, pelo documento independente e
pela renderização A4 em PDF, com conferência das 30 resoluções e respostas.
O diálogo nativo foi substituído por um observador no teste automatizado;
não se testou uma impressora física. As páginas iniciais de PDF e impressão e
uma página ilustrada foram inspecionadas visualmente.

## Evidências para avaliação

- [Tela inicial — computador](inspecao/boletim/inicio-computador.png).
- [Resultado — computador](inspecao/boletim/resultado-computador.png).
- [Resultado — celular de 320 px](inspecao/boletim/resultado-celular-320.png).
- [Primeira página do PDF](inspecao/boletim/pagina-1-pdf.png).
- [Página ilustrada do gabarito no PDF](inspecao/boletim/pagina-gabarito-pdf.png).
- [PDF completo com nome fictício](inspecao/boletim/boletim-exemplo.pdf).
- [PDF sem nome](inspecao/boletim/boletim-sem-nome.pdf).
- [Versão de impressão em PDF](inspecao/boletim/impressao-exemplo.pdf).
- [Primeira página da impressão](inspecao/boletim/pagina-impressao.png).
- [Resultado dos testes](resultado-testes-boletim.json).

Para abrir a interface, executar o servidor e usar o caminho descritos no README.
Não houve commit, push, merge ou publicação no Blogger. A integração com o tema
do Blogger e a inspeção em navegadores móveis reais permanecem etapas futuras;
a validação atual foi local em Chromium, com emulação das larguras indicadas.

## Aprovação e preparação do envio

O usuário aprovou o boletim, a identidade visual e a paginação atual do PDF e
autorizou salvar o trabalho na branch `desenvolvimento-simulado-6ano`.
Antes do envio, os dez testes funcionais foram executados novamente: dez
aprovados, sem falhas ou testes ignorados, em 34,9 segundos. As novas saídas
ficaram em `/tmp/mfc-publicacao-regressao` e `/tmp/mfc-publicacao-boletim`, fora
do repositório; o PDF aprovado e suas capturas permaneceram intactos.

Foram novamente conferidos os 92 arquivos dos bancos e mecanismo por SHA-256,
sem alterações. Os exemplos contêm apenas nome explicitamente fictício ou não
contêm nome. Dependências instaladas, backups e saídas temporárias não integram
o envio; o bundle e a fonte locais, suas licenças e as evidências de aprovação
são preservados. Não há merge na `main` nem publicação no Blogger.

A suíte original do mecanismo também foi repetida, sem modificá-lo: oito testes
aprovados, zero falhas e zero ignorados, em 17,7 segundos. As 10.000 aplicações
(300.000 questões selecionadas) apresentaram zero violações: sempre seis questões
por assunto e dificuldades 8/14/8. Os recursos visuais variaram de 15 a 27 por
aplicação, preservando o mínimo de três por assunto; as 24 permutações das quatro
alternativas foram exercitadas com correspondência correta dos gabaritos.
