# MatemáticaFC — simulados

Branch de publicação: `publicacao-simulados`. Não é necessário merge na main.

- 6º ano, Bloco 1: `/6-ano/bloco-1/interface/`.
- 7º ano, Bloco 1: `/7-ano/bloco-1/interface/`.

O CNAME existente aponta para `simulados.matematicafc.com` e foi preservado.
O estado da implantação e os endereços públicos devem ser confirmados no GitHub Pages.
Não houve alteração de DNS nem publicação de postagem no Blogger nesta entrega.

A versão do 7º ano deriva da reconstrução aprovada para inspeção, commit
`8495ccf19fff00146e8b9a549d92e462e8f44860`. A autorização de publicação foi
recebida em 15/10/2026. Foram promovidos somente os metadados de aprovação e
ativação e ajustados os caminhos de `/reconstrucao/interface/` para `/interface/`.
O banco mantém os 100 enunciados, alternativas, gabaritos, resoluções e 60 recursos.

O 7º ano usa jsPDF 4.2.1 local. Nome opcional e resultados ficam no navegador,
sem cadastro, serviço remoto de PDF ou transmissão de dados pessoais.
A renderização dos recursos usa validação XML e construção DOM; a impressão
utiliza iframe com sandbox sem execução de scripts e CSP restritiva.
Os 24 arquivos do 6º ano e seu manifesto permanecem byte por byte preservados.

`manifesto-publicacao-7ano.json` identifica os 29 arquivos necessários do 7º ano,
suas licenças, dependências e hashes. `manifesto-publicacao.json` é o inventário
anterior do 6º ano, preservado. `relatorio-testes-7ano.json` registra os testes desta entrega. `.gitattributes` mantém LF nos arquivos de texto.
Não há ZIP, dependências de desenvolvimento, backups ou dados de tentativas.

Para teste local na raiz: `python3 -m http.server 8000 --bind 127.0.0.1`.
O servidor local não é uma publicação pública. `.nojekyll` mantém o conteúdo estático.
A implantação por branch no Pages deve usar `publicacao-simulados` e a pasta `/`.

O resultado da inspeção informada no Windows foi sem ameaças detectadas pelo
Defender; isso não confirma a causa do alerta histórico Ulthar nem garante
que todo mecanismo antivírus produzirá o mesmo resultado no futuro.
