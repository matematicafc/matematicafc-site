# Integração local do 6º ano — Bloco 4

Data: 20/10/2026. Estado: candidata local independente, sem publicação. A autorização atual permite somente implementação e testes locais.

## Entrega

Candidata: `/workspace/matematicafc-desenvolvimento-bloco4/6-ano/bloco-4/validacao-integracao/index.html`.

HTML autossuficiente, com 2.011.803 bytes e SHA-256:

`d6ffc82e06bc178d1bc056158352a82274c4829d8191fdccc9e95e7d991a9f54`

Para execução é necessário somente esse HTML. O manifesto, as instruções, os componentes de construção e os testes são materiais auxiliares.

## Preservação do conteúdo e do ambiente

- Os quatro bancos foram lidos, incorporados e comparados estruturalmente com os JSON aprovados, sem alteração nos originais.
- 100 questões, 400 alternativas, 100 gabaritos, 100 resoluções e justificativas dos 300 distratores preservados.
- Distribuição no banco: 32 fáceis, 48 médias e 20 difíceis; 25 itens por assunto PF, LG, OD e PR.
- Inventário efetivo: 95 questões visuais e 108 recursos — **70 SVGs, 32 tabelas HTML e seis quadros de fichas HTML**. Não se converteu tabela em SVG para alterar essa contagem.
- Os hashes de 887 arquivos preexistentes foram conferidos; nenhum foi alterado. A lista está em `validacao-integracao/preservacao-antes.json`; o resultado, em `integridade.json`.
- O repositório publicado permanece no commit `fe8fa257979b9b7eec15584c3ce7273cf5f0e509`, com árvore de trabalho limpa. Os Blocos 1, 2 e 3 e demais simulados estão preservados.
- A interface original do Bloco 4 permanece bloqueada e os bancos originais continuam com `sorteio.ativo: false`. A candidata contém uma autorização local separada; não foi integrada à plataforma.

## Funcionamento implementado

| Modalidade | Cotas por assunto | Cotas de dificuldade |
| --- | --- | --- |
| 30 questões | Dois assuntos com 8, dois com 7 | 8 fáceis, 14 médias, 8 difíceis |
| 40 questões | 10 por assunto | 12 fáceis, 20 médias, 8 difíceis |

Nos assuntos com oito itens, a distribuição é 2/4/2; com sete, 2/3/2; com dez, 3/5/2. O seletor exige ao menos três questões visuais por assunto e 15 na tentativa.

No modo 30, cada ciclo embaralha os seis pares possíveis, usando cada par exatamente uma vez. Cada assunto fornece oito questões três vezes por ciclo. Também se evita repetir o último par imediatamente na fronteira entre ciclos. Aplicações de 40 não avançam esse rodízio. Não há histórico persistente de questões: repetições entre tentativas são permitidas.

As questões são embaralhadas globalmente. A navegação numérica acompanha a ordem global, sem agrupamento por assunto. As alternativas recebem novas letras, mantendo IDs internos estáveis; gabarito e justificativas acompanham a alternativa original. A projeção apresentada durante a aplicação não contém gabarito, resolução, justificativas ou modelos de verificação. A correção pela API é bloqueada até a finalização. Como em qualquer HTML estático que contém o banco, isso não constitui sigilo contra inspeção do código-fonte.

A tela inicial permite escolher a modalidade. Nome opcional, alteração/limpeza de respostas, navegação, contador, confirmação/cancelamento do encerramento, resultado por assunto, PDF, impressão, consulta, gabarito e reinício funcionam para a tentativa selecionada. Reiniciar limpa respostas, resultado e nome, conserva a modalidade e sorteia novamente. O botão **Escolher modalidade** retorna à tela inicial. Recarregar reinicia a sessão.

## Comparação com o Bloco 3

| Componente | Reaproveitamento/adaptação |
| --- | --- |
| Identidade visual | Logotipo e fonte incorporados idênticos aos do Bloco 3; mesmas cores, cartões, botões e organização de resultados |
| Tela inicial | Mantido padrão; acrescida escolha 30/40 e identificação de candidata local |
| Navegação e respostas | Mesmo fluxo; totais dinâmicos e mapa numérico na ordem embaralhada |
| Resultado | Quatro quadros e desempenho por assunto; valores calculados sobre 30 ou 40 |
| Guardar/consultar | Mantida ordem Baixar PDF, Imprimir, Consultar na tela e texto de privacidade aprovado |
| Ações finais | Gabarito e nova aplicação preservados; retorno à escolha de modalidade acrescentado |
| Exportação | Mesmo jsPDF 4.2.1 incorporado; tabelas e fichas do Bloco 4 suportadas nativamente; SVGs rasterizados em resolução 3x |
| Sessão | Sem cookies, localStorage ou sessionStorage; rodízio somente em memória |

Nenhum script de instalação, executável, dependência externa nova, download automático ou pacote ZIP foi criado.

## Testes e resultados

### Seleção e embaralhamento

`testar-selecao.cjs` executou o código extraído do HTML final, com RNG determinístico para reprodução:

- **10.000 seleções de 30 e 10.000 seleções de 40**, todas seguidas da construção e correção da aplicação.
- Zero violações de quantidade, cotas, mínimos visuais ou unicidade de IDs.
- Todos os ciclos completos do modo 30 contiveram os seis pares, sem duplicação no ciclo. Nas 10.000 tentativas, cada par apareceu 1.666 ou 1.667 vezes.
- Em cada aplicação, foram conferidos texto, ID e letra de todas as alternativas, gabarito após embaralhamento, resolução e cada justificativa de distrator remapeada.
- Todas as aplicações corrigidas com as respostas certas atingiram 100%; correção antecipada e alteração após encerramento foram rejeitadas.
- Confirmado que aplicações de 40 intercaladas não consomem o rodízio de 30.

Evidência: `selecao.json`.

### Navegador e interface

Chromium, larguras de **320 e 1.280 px**, duas modalidades e quatro cenários por combinação: **16 cenários completos**.

| Cenário | Resultado em 30 | Resultado em 40 |
| --- | --- | --- |
| Todas corretas | 30 acertos, 0 erros, 0 em branco | 40 acertos, 0 erros, 0 em branco |
| Todas incorretas | 0 acertos, 30 erros, 0 em branco | 0 acertos, 40 erros, 0 em branco |
| Parcial | 10 acertos, 10 erros, 10 em branco | 14 acertos, 13 erros, 13 em branco |
| Nenhuma respondida | 0 acertos, 0 erros, 30 em branco | 0 acertos, 0 erros, 40 em branco |

Confirmados alteração de resposta, limpeza, retorno à resposta anterior, botão Anterior desabilitado na primeira questão, navegação pelos números, contagem, cancelar/confirmar encerramento, ausência de correção no DOM antes da finalização, consulta, gabarito, reinício e limpeza do nome. Recarregamento limpa a sessão; nenhum dado foi gravado em armazenamento persistente.

**Zero erros JavaScript e zero requisições externas observadas**. Evidências: `navegador.json` e `sessao.json`.

### Recursos visuais e segurança do renderizador

Todos os **108 recursos** foram construídos pelo renderizador efetivamente usado na interface nas duas larguras. Zero estouros horizontais dos recursos e zero rótulos SVG fora do viewBox, segundo medições do navegador. Capturas completas: `recursos-todos-320.png` e `recursos-todos-1280.png`. Foram examinadas amostras renderizadas da tela inicial, dos recursos e do PDF.

A adaptação aceita os grupos e polilinhas dos SVGs aprovados e os formatos de tabelas/cartões dos novos assuntos. Utiliza parser inerte, lista restrita de elementos e atributos e construção explícita por DOM, sem `innerHTML` ou `iframe.srcdoc` no código de integração. Recursos com eventos, elementos ativos ou referências externas são rejeitados; testes de injeção com onload, foreignObject e image externa passaram.

Os recursos originais não foram redesenhados. As medições automáticas não demonstram por si só aprovação visual independente, ausência de toda sobreposição ou legibilidade para todos os leitores. Essa inspeção continua pendente.

### PDF e impressão

- **Quatro downloads reais** concluídos pelo botão Baixar PDF: modalidades 30/40 em 320/1.280 px. Arquivos `boletim-*.pdf`.
- Conferidas numeração completa, total da tentativa, identificação opcional, gabaritos e resoluções por extração do texto do PDF.
- Botão Imprimir chama o fluxo de impressão. O teste intercepta `window.print` em navegador sem interface de sistema e gera a saída A4 pelo motor de impressão do Chromium. Quatro arquivos `impressao-*.pdf` conferidos, com 30 ou 40 questões completas.
- Auditoria adicional do exportador percorreu os 100 itens em uma **fixture exclusiva de teste**, não acessível como modalidade do simulado. Incluiu **108/108 recursos**, sem substituições por descrições, e todos os textos das tabelas e fichas, inclusive suas legendas. Evidência: `pdf-recursos.json`, `auditoria-108-recursos.pdf` e `pdf-amostras.png`.
- A paginação varia com os itens sorteados e seu comprimento; os resultados exatos constam em `navegador.json`. O arquivo de auditoria dos 100 itens tem 120 páginas e não é o boletim de uma tentativa estudantil.

A impressora física e a janela nativa de impressão do Windows não foram testadas. O HTML não exige internet; o teste ocorreu por servidor HTTP interno com acesso externo bloqueado. A política deste navegador impede `file://`; a abertura direta por arquivo no notebook ainda precisa ser confirmada.

## Problemas encontrados e resolvidos na candidata

1. O seletor da estrutura-base usava alternância complementar e somente 30 questões: substituído pelo rodízio dos seis pares e suporte às duas modalidades aprovadas.
2. Existiam totais fixos de 30 em interface e mensagem de impressão: tornados dinâmicos.
3. O adaptador original não cobria grupos/polilinhas SVG nem todos os recursos HTML: ampliado de forma restrita para os elementos efetivamente presentes nos bancos.
4. O PDF-base não exportava os cartões HTML e omitia títulos das tabelas: acrescentada representação nativa dos cartões e preservação dos títulos. O PDF passa a interromper com erro explícito se não puder renderizar um SVG, em vez de substituí-lo silenciosamente.
5. As justificativas não acompanhavam as novas letras: agora são remapeadas pela identidade da alternativa e aparecem somente depois da finalização, inclusive no boletim.

Não foram alterados conteúdos matemáticos ou pedagógicos.

## Arquivos criados

Somente arquivos novos nas seguintes áreas:

- `validacao-integracao/index.html`: candidata autossuficiente.
- `validacao-integracao/manifesto-fontes.json`, `preservacao-antes.json`, `LEIA-ME.md`: integridade e instruções.
- `validacao-integracao/montar.py` e `componentes/selecao.js`, `componentes/recursos.js`: construção reproduzível.
- `validacao-integracao/testar-selecao.cjs`, `testar-integridade.py`, `testar-navegador.py`, `testar-pdf-recursos.py`, `testar-sessao.py`: testes novos.
- `docs/verificacao/integracao/`: este relatório, resultados JSON, capturas e PDFs. O inventário completo é `arquivos-criados.json`.

Nenhum arquivo preexistente foi modificado. Nenhum teste histórico ou referência histórica foi reescrito.

## Pendências e limite da entrega

- Avaliação independente da candidata e dos recursos visuais pelo responsável.
- Conferência no Edge/Chrome do Windows e impressão física, caso desejada.
- Este ambiente não executou o Microsoft Defender; os testes funcionais não comprovam ausência de detecção de segurança.
- O acesso pelo caminho interno é um recurso do ambiente, não um link público de download. Se não estiver disponível, qualquer transferência via GitHub dependerá de autorização específica posterior.

**Não houve commit, push, merge, deploy, publicação, modificação do Blogger ou ativação pública de bancos.** A candidata aguarda avaliação antes de qualquer próxima etapa.
