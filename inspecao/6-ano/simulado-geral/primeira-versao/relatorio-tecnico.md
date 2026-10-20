# MatemáticaFC — primeira versão funcional do Simulado Geral do 6º ano

Data: 20/10/2026. Estado: candidata local independente, aguardando avaliação. A implementação não integra nem modifica os quatro simulados publicados.

## Entrega

Pasta: `/workspace/matematicafc-simulado-geral-6ano/`.

Aplicativo: `/workspace/matematicafc-simulado-geral-6ano/interface/index.html`.

HTML autossuficiente de **3.066.399 bytes**, com SHA-256:

`7e3aa0fd974a2f748848ad4304ff2e2427b74119fce0f8ff147d3a07bed4b952`

Para execução, somente o HTML é necessário. CSS, JavaScript, logo, fonte, jsPDF 4.2.1 e recursos pedagógicos estão incorporados. O manifesto é `manifesto-candidata.json`.

## Fontes e integridade pedagógica

Foram utilizadas exclusivamente as fontes publicadas no commit `615a58055bc109708d42c2eddd7e9bee85dd6143`, repositório `matematicafc/matematicafc-site`.

- Blocos 1 e 2: nove bancos JSON originais, cinco e quatro respectivamente.
- Blocos 3 e 4: bancos incorporados aos HTMLs publicados.
- As onze fontes foram identificadas por tamanho e hash em `fontes/manifesto-fontes.json`.

| Origem | Médias elegíveis | Difíceis elegíveis | Total elegível | Assuntos |
| --- | --- | --- | --- | --- |
| Bloco 1 | 48 | 26 | 74 | 5 |
| Bloco 2 | 48 | 20 | 68 | 4 |
| Bloco 3 | 48 | 20 | 68 | 4 |
| Bloco 4 | 48 | 20 | 68 | 4 |
| Total | 192 | 86 | 278 | 17 |

O banco do Geral contém **278 questões, 1.112 alternativas e 278 resoluções**. Os objetos dos itens foram comparados integralmente com as fontes; nenhuma questão foi criada ou reescrita. Enunciados, títulos, habilidades, alternativas, gabaritos, resoluções, justificativas, recursos e metadados históricos foram preservados.

As 122 questões fáceis foram excluídas somente da cópia elegível do Geral. Elas permanecem nos blocos originais.

Cada questão selecionada recebe apenas o metadado técnico de origem da cópia, `blocoOrigem`. O identificador original e o assunto são mantidos. Isso permite calcular resultados por bloco sem mudar o conteúdo ou os códigos dos itens.

A procedência aprovada foi reconhecida pela versão publicada e pela autorização do responsável; não foram corrigidas ou reescritas as flags históricas de revisão/sorteio dos bancos originais.

## Sorteio e diversidade

Cada aplicação tem **exatamente 40 questões**:

| Origem | Médias | Difíceis | Total |
| --- | --- | --- | --- |
| Bloco 1 | 6 | 4 | 10 |
| Bloco 2 | 6 | 4 | 10 |
| Bloco 3 | 6 | 4 | 10 |
| Bloco 4 | 6 | 4 | 10 |
| Total | 24 | 16 | 40 |

É possível garantir pelo menos um item de cada assunto: todos os assuntos têm questões médias disponíveis e cada bloco tem no máximo cinco assuntos, dentro da cota de seis médias. Portanto, não houve incompatibilidade e nenhuma cota precisou ser alterada.

O seletor sorteia seis médias e quatro difíceis sem reposição por bloco e aceita somente amostras que contenham todos os assuntos daquele bloco. A rejeição condicionada evita impor uma distribuição adicional de dificuldade por assunto. Existe um limite de tentativas com erro explícito, para impedir laço ilimitado em caso de entrada/RNG inválidos; ele não foi atingido nos testes.

As 40 questões são embaralhadas globalmente. As quatro alternativas também são embaralhadas, mantendo identidade interna estável, correspondência com a resposta correta e justificativas dos distratores. Novas aplicações fazem novo sorteio; repetições entre tentativas são permitidas. Não existe histórico persistente ou rodízio de pares neste novo projeto.

## Interface e resultados

Identidade visual, logotipo e fonte reaproveitados da versão aprovada do Bloco 4, com cabeçalho **SIMULADO GERAL • 6º ANO**, título **Simulado Geral de Matemática** e informação **40 questões | Níveis médio e difícil**.

Preservados/adaptados: nome opcional, navegação global, alteração e limpeza de respostas, mapa de questões respondidas, confirmação/cancelamento de finalização, contadores e reinício. Não há agrupamento da sequência por bloco ou dificuldade.

Após finalizar, são apresentados acertos, erros, não respondidas, percentual geral e desempenho por bloco. Questões, alternativas escolhidas, respostas corretas e resoluções aparecem na revisão. Os botões Baixar PDF, Imprimir e Consultar na tela permanecem separados das ações de gabarito e nova aplicação.

A API e a apresentação de correção ficam bloqueadas até a finalização. Como o HTML incorpora o banco, os gabaritos podem ser encontrados por inspeção do código-fonte; não se promete sigilo criptográfico em um aplicativo estático independente.

## IP-10 do Bloco 2

A resolução original, que menciona a alternativa D, permaneceu literalmente intacta. Após a finalização, uma nota separada informa:

> Na resolução original, a expressão “alternativa D” corresponde à alternativa X desta aplicação.

A letra X é calculada a partir da alternativa correta após o embaralhamento. A nota aparece na revisão, no PDF e na impressão. O teste de 10.000 aplicações conferiu essa correspondência nas **1.248 ocorrências** da IP-10. Uma exportação específica também confirmou a nota no PDF sem modificar a resolução.

## Recursos visuais e compatibilidade

| Tipo | Quantidade |
| --- | --- |
| SVG | 206 |
| Tabelas HTML | 33 |
| Quadros de fichas HTML | 4 |
| Total | 243 |

O renderizador foi adaptado aos elementos presentes nas fontes: grupos, descrições, padrões de hachura, marcadores de seta, polilinhas, tabelas e quadros. O CSS pedagógico original do Bloco 1 foi incorporado; o estilo inline permitido é restrito à declaração de fonte efetivamente encontrada na origem.

Cada instância recebe identificadores SVG próprios. Referências de padrões, setas, aria-labelledby e aria-describedby são atualizadas na cópia renderizada, sem editar o recurso original. Isso evita colisões entre tela, gabarito e impressão.

A comparação estrutural dos **243 recursos renderizados** confirmou preservação dos textos, atributos e geometria, descontando somente os prefixos técnicos dos identificadores. Duas cópias simultâneas de todos os recursos não produziram IDs duplicados, e 164 referências ARIA foram conferidas nesse cenário.

Elementos ativos, eventos, URLs externas, entidades/DTD, estilos arbitrários e referências internas inexistentes são rejeitados. Não houve nova dependência externa: logo, fonte, biblioteca e licenças incorporadas foram preservados da base aprovada.

## Testes realizados

### 10.000 sorteios e aplicações

O teste executa os componentes extraídos do próprio HTML final, com RNG determinístico para reprodução:

- Exatamente 40 questões por aplicação, dez de cada origem.
- Exatamente seis médias e quatro difíceis por bloco; 24/16 no total; zero fáceis.
- Todos os cinco assuntos do Bloco 1 e os quatro assuntos de cada outro bloco em cada tentativa.
- Nenhuma repetição de identificador dentro da aplicação.
- Todos os 278 itens foram exercitados ao longo dos testes.
- **400.000 questões selecionadas** tiveram textos de alternativas, letras, gabaritos, justificativas e resoluções conferidos.
- Correspondência da IP-10 após o embaralhamento validada.
- Correção antecipada e alteração depois de finalizar rejeitadas.
- Resultado de todas corretas: 40 acertos, 100% e dez acertos em cada bloco.

Resultado: **zero violações**. Evidência: `selecao.json`.

### Navegador: 320 e 1.280 px

Oito cenários principais, quatro por largura:

| Cenário | Acertos | Erros | Não respondidas |
| --- | --- | --- | --- |
| Todas corretas | 40 | 0 | 0 |
| Todas incorretas | 0 | 40 | 0 |
| Parcial | 14 | 13 | 13 |
| Nenhuma resposta | 0 | 0 | 40 |

Foram testados navegação, recuperação/alteração/limpeza de resposta, contador, cancelar/confirmar finalização, consulta, gabarito e reinício. As respostas corretas não aparecem na interface antes de finalizar.

Um cenário adicional conferiu resultados distintos por origem: B1 com dez acertos, B2 com zero, B3 com cinco e B4 com três. O resultado geral foi 18 acertos, 12 erros, dez não respondidas e 45%.

Escape cancela a confirmação e devolve foco ao botão de origem. O nome opcional foi tratado como texto mesmo contendo marcação HTML. Oito recursos ativos ou com referências inválidas foram rejeitados. LocalStorage, sessionStorage e cookies permaneceram vazios; recarregar limpou nome e respostas.

Os 243 recursos foram renderizados nas duas larguras: nenhum estouro horizontal e nenhum rótulo SVG fora do viewBox nas medições automáticas. Foram examinadas amostras das capturas e dos PDFs. A inspeção visual independente completa permanece pendente; testes automáticos não demonstram ausência de toda sobreposição ou legibilidade para todos os usuários.

Zero erros JavaScript e zero requisições externas observadas nos cenários principais. Evidências: `navegador.json`, `sessao-seguranca.json` e capturas `inicio-*`, `recursos-todos-*`, `amostras-*`.

### PDF e impressão

- Dois downloads reais pelo botão Baixar PDF, nas duas larguras, com as 40 questões selecionadas, numeração completa, nome opcional e resoluções. Os boletins desta execução têm 52 e 56 páginas, conforme as questões sorteadas.
- Botão Imprimir acionou o fluxo esperado. A janela nativa foi interceptada no teste automatizado; a saída A4 foi produzida pelo motor de impressão do Chromium e conferida. As saídas têm 41 e 40 páginas, com as 40 questões completas.
- Quatro fixtures adicionais de auditoria percorreram todos os itens elegíveis de cada bloco, exclusivamente para testar exportação, sem criar modalidades de 74 ou 68 questões na interface.
- **243/243 recursos incluídos no PDF**, sem omissões ou substituições por descrições; todos os textos das tabelas e fichas preservados.
- Documento de impressão dessas fixtures também contém todos os itens e recursos esperados.
- jsPDF **4.2.1** confirmado em execução.
- Formato A4 conferido em todas as páginas dos oito PDFs de evidência.

Evidências: `recursos-exportacao.json`, `formato-a4.json`, `boletim-*`, `impressao-*`, `auditoria-recursos-bloco-*` e `amostras-pdf.png`.

## Arquivos criados e preservação do projeto

Todos os arquivos são novos e estão exclusivamente em `/workspace/matematicafc-simulado-geral-6ano/`:

- `interface/index.html`: aplicativo autossuficiente.
- `fontes/banco-elegivel.json`: cópia dos 278 itens sem alteração dos objetos originais.
- `fontes/manifesto-fontes.json` e `fontes/preservacao-originais.json`: procedência e hashes.
- `componentes/selecao.js` e `componentes/recursos.js`: seleção e renderização.
- `extrair-fontes.py` e `montar.py`: construção reproduzível, sem escrita nas fontes.
- `testes/`: testes de seleção, interface, recursos/exportação, integridade, sessão e validação dos recursos.
- `relatorios/`: este relatório, resultados JSON, capturas e PDFs de teste.
- `manifesto-candidata.json`, `LEIA-ME.md` e inventário `relatorios/arquivos-criados.json`.

**Os 91 arquivos rastreados do repositório publicado permanecem com os hashes originais**, e sua árvore de trabalho está limpa. Nenhum dos quatro blocos, suas questões fáceis, configurações, outras páginas ou registros históricos foi alterado.

## Limitações e próximos passos

A candidata foi testada em Chromium por servidor HTTP interno com acesso externo bloqueado. A política administrativa do navegador deste ambiente impede teste direto por file://. A abertura no Windows, a inspeção visual independente e a impressão física ainda dependem da avaliação do responsável.

O arquivo HTML é autossuficiente, mas o caminho interno não é um link público de download. Não foi feita transferência externa nesta etapa.

Não foram encontrados problemas que exigissem mudar as cotas ou o conteúdo pedagógico. Os desafios de formato, identificadores SVG e referência da IP-10 foram tratados na camada técnica da nova aplicação.

**Não houve commit, push, merge, publicação, modificação do Blogger ou alteração da branch publicacao-simulados/main.** Aguarda nova autorização antes de qualquer transferência ou integração.
