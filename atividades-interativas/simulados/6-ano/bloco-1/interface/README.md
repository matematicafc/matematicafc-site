# Interface do estudante — 6º ano, Bloco 1

Página de demonstração local, sem login ou publicação, com boletim em PDF
gerado no navegador, impressão e consulta na tela. As dependências de PDF
e a fonte são distribuídas localmente, sem CDN ou serviço externo. Usa diretamente `../mecanismo/index.mjs` e os cinco
JSON de `../banco-inedito/`. Não há lógica de sorteio alternativa nesta pasta.

## Abrir para inspeção

Na raiz do repositório:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Na porta 8000 do servidor, abra o caminho:

```text
/atividades-interativas/simulados/6-ano/bloco-1/interface/
```

Em uma máquina local, use esse caminho no navegador pelo servidor HTTP local.
Em ambiente remoto, use o endereço de acesso/encaminhamento da porta do ambiente;
se ele não estiver disponível, clone ou baixe o repositório e execute localmente.
Abrir `index.html` diretamente por `file://` não carrega os módulos e JSON.
O servidor é somente para desenvolvimento e inspeção; não publica no Blogger.

Capturas da execução de teste, com respostas fictícias:

- [Início em computador](inspecao/inicio-computador.png).
- [Início em celular](inspecao/inicio-celular.png).
- [Questão em computador](inspecao/questao-computador.png).
- [Questão em celular](inspecao/questao-celular.png).
- [Resultado em computador](inspecao/resultado-computador.png).
- [Resultado em celular](inspecao/resultado-celular.png).

## Fluxo implementado

Tela inicial → questão individual → navegação por botões ou números → confirmação
antes de finalizar → acertos, percentual, desempenho por assunto e gabarito
comentado → nova aplicação. A confirmação informa a quantidade sem resposta.
Cancelar ou pressionar Escape mantém a aplicação e suas escolhas.

As ordens de questões e alternativas vêm de uma única chamada a `novaAplicacao()`
e ficam fixas ao navegar. Os identificadores das opções, e não suas posições,
são enviados a `responder`. Mudar ou limpar uma escolha atualiza contador e mapa,
sem indicar acerto ou erro. `finalizar()` só é chamado após confirmação.
Nenhum gabarito ou resolução é colocado no DOM antes dessa etapa.

O percentual é calculado sobre as 30 questões, incluindo as sem resposta no
denominador, e exibido com até uma casa decimal. Cada assunto usa seu total de
seis questões. O gabarito mostra a letra embaralhada correta, a escolha do estudante
e a resolução original. As explicações podem ser abertas individualmente.

Respostas ficam em memória, sem localStorage, sessionStorage, cadastro ou envio
para servidores. Fechar ou recarregar a página encerra a aplicação atual. O histórico
opcional do mecanismo não foi ativado nesta interface. A separação protege o
fluxo normal; os arquivos completos do banco carregados no navegador podem ser
inspecionados, conforme a limitação já documentada no mecanismo.

## Arquivos e integração

- `index.html`: página de inspeção em português do Brasil.
- `estilos.css`: estilos restritos ao contêiner `.mfc-simulado`.
- `estudante.mjs`: montagem do DOM e integração com a API existente.
- `resultados.mjs`: acertos, erros, questões em branco e desempenho por assunto.
- `boletim.mjs`: fotografia imutável da aplicação finalizada, com nome opcional e data.
- `pdf.mjs`: geração e download local do PDF, com fonte Unicode e ilustrações.
- `impressao.mjs`: documento A4 independente e abertura da impressão por iniciativa do estudante.
- `vendor/` e `fontes/`: jsPDF 3.0.4, fonte DejaVu Sans e respectivas licenças.
- `imagens/favicon-matematicafc.ico`: cópia original do favicon oficial.
- `relatorio-boletim.md`: validação e capturas desta etapa.
- `testes/interface.test.mjs`: testes reais em Chromium e teste do cálculo.
- `package.json` e `package-lock.json`: ferramentas de teste e reprodução do bundle local.
- `.gitignore`: exclui `node_modules/`.
- `resultado-testes.json`, `relatorio-interface.md` e `inspecao/`: evidências desta etapa.

A função `montarSimulado(container, { baseBanco, buscar })` permite escolher o
contêiner e a URL de leitura do banco; não cria variáveis globais. A projeção pública
recebida do mecanismo é usada durante a aplicação. Os recursos HTML/SVG vêm
exclusivamente do banco estático aprovado; os demais textos usam `textContent`.
SVGs mantêm `viewBox`, proporção, título e descrição originais; CSS adapta a largura
à área disponível e usa altura automática. Tabelas mantêm seus cabeçalhos.
As alternativas são controles nativos com labels, e a confirmação usa diálogo
modal com foco contido, cancelamento por Escape e foco inicial em continuar.

A incorporação posterior ao Blogger exige hospedar os módulos e JSON em URLs
HTTPS definidas, manter os estilos restritos ao contêiner e validar o tema em
rascunho autorizado. Não foi feita integração ou publicação nesta etapa.
Os textos atuais não exigem MathJax; valores em reais são exibidos como texto.

## Repetir os testes

Na raiz do repositório:

```sh
npm ci --prefix atividades-interativas/simulados/6-ano/bloco-1/interface
npm test --prefix atividades-interativas/simulados/6-ano/bloco-1/interface
```

Requisitos: Node.js 18+, Python 3 e Chromium. O teste usa `/usr/bin/chromium`
quando disponível, ou o executável definido em `MFC_CHROMIUM_PATH`. Como alternativa,
instale o navegador do Playwright dentro da pasta da interface:

```sh
npx playwright install chromium
```

Se usar Linux sem as bibliotecas necessárias, seguir os requisitos de sistema do
Playwright para instalação do navegador. Essa dependência é só de desenvolvimento;
o estudante não precisa instalar bibliotecas, pacotes ou extensões.

Os testes iniciam e encerram seu próprio servidor HTTP e navegador. Para incluir
as capturas opcionais (normalmente ignoradas):

```sh
MFC_CAPTURAS=/tmp/mfc-interface-capturas npm test --prefix atividades-interativas/simulados/6-ano/bloco-1/interface
```

O relatório original está em [relatorio-interface.md](relatorio-interface.md).
Para os testes e as capturas atuais, consulte [relatorio-boletim.md](relatorio-boletim.md).

## Boletim de Desempenho

O nome opcional é solicitado antes do início, somente para personalizar o boletim.
Não é salvo em cookies, localStorage ou sessionStorage, nem enviado pela rede.
Uma nova aplicação reinicia respostas e resultados e mantém o nome informado;
recarregar a página limpa todos esses dados.

Após confirmar a finalização, o estudante pode escolher **Baixar PDF**, **Imprimir**
ou **Consultar na tela**. O gabarito preserva as letras embaralhadas da aplicação.
Questões em branco ficam separadas dos erros, sem contar como acertos.

O PDF contém um resumo do boletim e, em seguida, o gabarito das 30 questões,
com enunciados, quatro alternativas, escolha, resposta correta e resolução.
A fonte local mantém acentos e símbolos matemáticos do banco atual. SVGs são
renderizados em PNG de alta resolução apenas na exportação, mantendo proporções;
as tabelas são reproduzidas como tabelas no PDF. Se uma imagem não puder ser
renderizada, sua descrição acessível é incluída e o estudante recebe um aviso.
Na impressão, os SVGs permanecem vetoriais. Nenhum conteúdo do banco é alterado.

A fonte (~742 KiB) e o bundle jsPDF (~406 KiB) só são buscados quando necessários:
PDF ao clicar em baixar; fonte de impressão ao clicar em imprimir. Esses pedidos
são leituras de arquivos estáticos, sem nome, respostas ou resultados. Depois de
carregados os recursos necessários, a geração não depende de serviço externo.
O arquivo é baixado como `boletim-matematicafc-6ano-bloco1.pdf`, sem nome pessoal
no nome do arquivo. O estudante decide onde guardar ou compartilhar o download.

O módulo `criarBoletim` só aceita correção liberada pela API após finalizar.
A separação controla o fluxo da interface: como em qualquer aplicação inteiramente
local, não impede inspeção dos JSON pelo próprio usuário nas ferramentas do navegador.

Para reproduzir o bundle, na pasta da interface (após `npm ci`):

```sh
npx esbuild vendor/entrada-jspdf.mjs --bundle --format=esm --platform=browser --minify --external:html2canvas --external:dompurify --external:canvg --outfile=vendor/jspdf.mjs
```

A aplicação usa apenas a API de texto, tabelas e imagens do jsPDF; não usa os
adaptadores opcionais de HTML/SVG que requerem serviços ou pacotes adicionais.
Os avisos de licenciamento das dependências estão preservados no bundle.

Para gerar os exemplos atuais em uma pasta escolhida:

```sh
MFC_CAPTURAS=/tmp/mfc-regressao MFC_BOLETIM_CAPTURAS=/tmp/mfc-boletim npm test
```

Os testes do boletim também usam `pdftotext` e `pdfimages` (Poppler) para conferir
o conteúdo efetivo dos arquivos baixados. A impressão é testada por sua chamada
no navegador e pela renderização A4; não exige uma impressora física.
