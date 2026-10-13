# MatemáticaFC — pacote estático dos simulados

Branch exclusiva de publicação: `publicacao-simulados`.
Origem aprovada: `desenvolvimento-simulado-6ano`, commit
`aa2219dc537d532085140a63c3d4804e5014669c`.

Esta branch independente contém somente o pacote da aplicação e seus arquivos
de controle/documentação. As branches `main` e `desenvolvimento-simulado-6ano`
permanecem preservadas. Não é necessário fazer merge para publicar este pacote.

## Endereço preparado

Caminho do simulado na raiz da hospedagem:

```text
/6-ano/bloco-1/interface/
```

Quando o GitHub Pages deste repositório for configurado, o endereço temporário
esperado é:

```text
https://matematicafc.github.io/matematicafc-site/6-ano/bloco-1/interface/
```

Este endereço ainda não foi ativado ou validado no GitHub Pages nesta etapa.
A configuração futura deverá usar a branch `publicacao-simulados` e a pasta
raiz (`/`), na opção de implantação por branch. `.nojekyll` mantém os arquivos
estáticos sem processamento pelo Jekyll. Não há workflow de implantação,
`CNAME`, domínio personalizado ou alteração de DNS neste pacote.

## Conteúdo necessário

São 24 arquivos da aplicação e suas licenças, totalizando 1.867.465 bytes.
Todos foram copiados sem alterar seu conteúdo. Caminhos, tamanhos e hashes
SHA-256 estão em [manifesto-publicacao.json](manifesto-publicacao.json).

```text
6-ano/bloco-1/
├── interface/
│   ├── index.html
│   ├── estilos.css
│   ├── estudante.mjs
│   ├── resultados.mjs
│   ├── boletim.mjs
│   ├── pdf.mjs
│   ├── impressao.mjs
│   ├── imagens/favicon-matematicafc.ico
│   ├── fontes/DejaVuSans.ttf
│   ├── fontes/LICENCA-DejaVu.txt
│   ├── vendor/jspdf.mjs
│   └── vendor/LICENCA-jsPDF.txt
├── mecanismo/
│   ├── index.mjs
│   ├── banco.mjs
│   ├── regras.mjs
│   ├── aleatorio.mjs
│   ├── selecao.mjs
│   ├── aplicacao.mjs
│   └── historico.mjs
└── banco-inedito/
    ├── sistema-numeracao.json
    ├── operacoes.json
    ├── multiplos-divisores.json
    ├── fracoes.json
    └── decimais.json
```

As 100 questões e os sete módulos do mecanismo são idênticos à origem aprovada.
As ilustrações utilizadas estão incorporadas nos JSON. A fonte e o jsPDF são
locais; o PDF é gerado no navegador. Não há cadastro, serviço de PDF externo ou
transmissão de nome e resultados. Não há mudança da paginação aprovada.

Além desses 24 arquivos, a branch contém apenas `.nojekyll`, `.gitignore`, este
README, o manifesto e o relatório de testes. Não inclui dependências instaladas,
bancos antigos, testes de desenvolvimento, capturas, PDFs de exemplo ou backups.

## Testes do pacote

**20 testes aprovados; nenhuma falha ou teste ignorado.**

Foi executada a suíte funcional do commit de origem duas vezes, adaptando
somente os caminhos para ler e servir os arquivos desta branch. As asserções
foram mantidas. As ferramentas e os testes adaptados ficaram fora do pacote.

| Estrutura testada localmente | Aprovados | Falhas | Ignorados |
| --- | ---: | ---: | ---: |
| `/6-ano/bloco-1/interface/` | 10 | 0 | 0 |
| `/matematicafc-site/6-ano/bloco-1/interface/` | 10 | 0 | 0 |

Foram conferidos 29 caminhos relativos de módulos, bancos, fonte, estilos e
favicon, sem dependência de um caminho absoluto na raiz do domínio.
O segundo cenário reproduz o prefixo de um site de projeto no GitHub Pages.

Os testes cobrem nome opcional, navegação, manutenção das respostas, cotas,
alternativas, teclado, cancelamento/finalização com questões em branco,
resultados, gabarito, nova aplicação e recuperação após falhas de carregamento.
Verificam recursos dos 100 itens e apresentação em 320, 768 e 1280 pixels.

O PDF foi realmente baixado em ambos os cenários. Seu texto foi extraído com
Poppler e comparado com as 30 questões da aplicação: numeração, ordem,
alternativas escolhidas/corretas e resoluções. Também foram conferidas as
imagens incorporadas, o PDF sem nome e a versão A4 de impressão. A API de
impressão foi observada no teste automatizado; não se usou uma impressora física.

O teste de rede conferiu leituras locais sem envio de dados pessoais; nome e
resultados não são gravados em localStorage/sessionStorage. Em aplicação
inteiramente local, os JSON podem ser inspecionados pelo próprio usuário;
a interface só apresenta o gabarito após finalizar.

Detalhes, tempos e identificação da suíte original:
[relatorio-testes.json](relatorio-testes.json).

## Inspeção local

Na raiz desta branch, execute:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Acesse o caminho `/6-ano/bloco-1/interface/` pelo servidor HTTP local. Não abra
`index.html` diretamente por `file://`, pois os módulos e JSON precisam de HTTP.
Não é necessário Node.js ou instalação de pacotes para servir a aplicação.

Para repetir a suíte automatizada, use as ferramentas e o arquivo de testes
identificados no relatório, disponíveis na branch de desenvolvimento, ajustando
os caminhos para esta estrutura de publicação. A branch estática não precisa
carregar ferramentas de desenvolvimento para o estudante.

## Próxima etapa, ainda não executada

Configurar o GitHub Pages e verificar o endereço HTTPS temporário real, incluindo
os tipos MIME de `.mjs`, JSON e fonte, favicon, download e impressão. Repetir
as verificações em navegadores móveis reais antes de divulgar o endereço.

Somente depois virão a configuração autorizada do subdomínio
`simulados.matematicafc.com` e a página de acesso no Blogger. Nada disso foi
configurado nesta etapa. Não houve merge na `main`.
