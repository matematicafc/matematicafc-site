# Relatório de validação — banco inédito do 6º ano

## Resultado

Foram produzidas **100 questões autorais**, 20 por assunto. As **100 passaram pela conferência matemática e estrutural**: quatro alternativas A–D, uma única correta, três distratores justificados, resolução comentada, habilidade e dificuldade estimada. **60 questões têm apoio visual relevante** (12 por assunto): 2 tabelas HTML e 58 diagramas SVG; dez tabelas de SN e as 12 tabelas de cada um dos assuntos ON, MD, FR e ND foram substituídas nas respectivas revisões, sem aumentar a contagem de questões visuais. Cada questão foi contada uma única vez.

| Assunto | Questões | Validadas | Visuais |
| --- | --- | --- | --- |
| SN | 20 | 20 | 12 |
| ON | 20 | 20 | 12 |
| MD | 20 | 20 | 12 |
| FR | 20 | 20 | 12 |
| ND | 20 | 20 | 12 |

## Distribuição por dificuldade

Cada célula indica total de itens / itens visuais. A dificuldade é uma estimativa pedagógica inicial, não uma medida de desempenho observada.

| Assunto | Fácil | Média | Difícil |
| --- | --- | --- | --- |
| SN | 6 / 4 | 10 / 6 | 4 / 2 |
| ON | 6 / 4 | 8 / 4 | 6 / 4 |
| MD | 5 / 3 | 9 / 5 | 6 / 4 |
| FR | 5 / 3 | 11 / 7 | 4 / 2 |
| ND | 4 / 3 | 10 / 5 | 6 / 4 |

## Originalidade e desenho pedagógico

O banco anterior foi consultado como referência de conteúdos e de problemas de
adaptação. Não foram importados seus enunciados ou geradas variantes por troca de
nomes e números. Os novos itens trabalham decisões e condições: intervalos de
arredondamento, contagem inclusiva com exclusões, registros de texto versus valor,
custos com taxa fixa, áreas com recortes, ciclos deslocados, restos recombinados,
inteiros de referência diferentes, informação insuficiente e tolerâncias.

Rascunhos próximos de cálculo direto foram reformulados durante a elaboração:
SN-18 passou a comparar ordenação de nomes de arquivos e ordenação numérica;
MD-02 passou a exigir recombinação de restos; FR-04 passou a escolher a aproximação
permitida mais próxima; ND-03 passou a verificar demanda e reserva após converter
unidades. Isso muda o raciocínio, e não apenas os dados de uma lista anterior.
A revisão editorial não detectou cópia literal nem reutilização de um enunciado.
A autoria e as diferenças de estrutura estão registradas para a revisão pedagógica.

As tabelas organizam dados necessários não repetidos integralmente no enunciado;
não são molduras ou cartões decorativos. Há diagramas de borda, áreas em escala,
dobras, parte remanescente, estacas e reta decimal. Todos possuem descrição
acessível e dados associados. Os SVG foram conferidos quanto a dimensões,
partições, contagens e posições. Os diagramas foram renderizados com CairoSVG e inspecionados visualmente,
incluindo os dez SVG revisados de SN e os 12 SVG de cada um dos assuntos ON, MD, FR e ND. Os arquivos estão na pasta `recursos/`.

## Conferências executadas

- 100 identificadores novos e únicos, distintos dos IDs do banco de referência.
- 20 registros em cada um dos cinco assuntos, sem títulos ou enunciados duplicados neste banco.
- Quatro alternativas distintas e uma única correta nos 100 itens; 25 gabaritos A, 25 B, 25 C e 25 D.
- Cálculos exatos com inteiros e frações racionais, incluindo decimais convertidos exatamente.
- Modelos de verificação independentes dos gabaritos declarados, derivados das condições dos problemas.
- Limites inclusivos/exclusivos, reservas, restrições de agrupamento, sobreposições, mudança do inteiro de referência e critérios de aproximação.
- Valores das tabelas coerentes com os dados dos modelos; cabeçalhos e escopos HTML; geometria dos SVG, incluindo as dez representações revisadas de SN e os 12 diagramas de cada um dos assuntos ON, MD, FR e ND.
- Resoluções, classificações e hipóteses de erros comuns presentes em todos os registros.
- Leitura editorial dos enunciados e das opções para conferir unidade, significado e resposta selecionada.

O validador não executa expressões como código Python: interpreta uma gramática
matemática limitada, sem `eval` ou `exec`. Seus modelos tornam os cálculos
auditáveis, mas não substituem a leitura dos textos. O cálculo é conferido a
partir dos dados de cada questão, sem tomar sua letra de gabarito como verdade.

## Seleção aprovada e implementada

O [manifesto](manifesto.json) define 30 itens, seis por assunto, cotas globais
8 fáceis / 14 médias / 8 difíceis e pelo menos três visuais por assunto.
O mecanismo enumera conjuntos elegíveis respeitando as cotas de dificuldade de
cada assunto; não obriga selecionar exatamente três itens sem visual.
Todos os 100 itens podem participar de conjuntos elegíveis. A aprovação dos
metadados é conferida antes de selecionar. O histórico opcional prioriza inéditas
e menor uso somente entre conjuntos válidos. Ver a documentação em
[../mecanismo/README.md](../mecanismo/README.md).

## Revisão pedagógica

**Nenhum impedimento matemático foi identificado após as correções dos rascunhos.**
A revisão pedagógica das **100 questões foi concluída pelo usuário** após as
revisões dos cinco assuntos. Os metadados estão alinhados como `aprovada`, por
autorização expressa para implementar o mecanismo. Enunciados, alternativas,
recursos visuais, resoluções e gabaritos foram preservados nesse alinhamento.

Pontos considerados durante a revisão:

- SN-03: explicar a abreviação k como mil sem pressupor familiaridade digital.
- SN-09/17 e ND-05/20: fronteiras, garantias e arredondamento devem ser compatíveis com os pré-requisitos da turma.
- ON-05/16: interpretação de bordas e recortes usa multiplicação em um contexto espacial.
- MD-07/19: ciclos com inícios diferentes e prova de impossibilidade têm maior demanda de raciocínio.
- FR-04/19: aproximação em marcas discretas e identificação de informação insuficiente.
- ND-09: uma oferta mais barata por litro pode não atender ao pedido exato em frascos inteiros.

O [caderno de revisão](revisao-pedagogica.md) apresenta os 100 enunciados, recursos,
alternativas, resoluções e distratores para essa avaliação. Não há questão
omitida ou excluída; não há roteiro de atividade copiado das listas anteriores.

## Preservação e limites da etapa

Na criação original deste banco, os arquivos preexistentes, incluindo bancos
anteriores e relatórios, foram preservados e comparados por SHA-256. Na revisão
posterior de SN, foram atualizados apenas esse assunto, seus recursos e os
arquivos de apoio descritos no relatório específico. Os bancos anteriores
continuam preservados. Os arquivos ficam na pasta `banco-inedito/`.

O mecanismo de seleção foi implementado em `../mecanismo/`, com histórico local opcional.
Nenhuma interface, coleta de dados pessoais ou publicação foi criada.
O Blogger e outros repositórios não foram alterados. A validação matemática e
estrutural não é um teste de interface responsiva ou de integração no Blogger.
A inspeção de SVG não substitui uma revisão completa de acessibilidade no futuro
componente. Nome opcional, boletim local, PDF e compartilhamento continuam como
requisitos documentados para uma etapa posterior.

## Como repetir a validação

Na raiz do repositório:

```sh
python3 atividades-interativas/simulados/6-ano/bloco-1/banco-inedito/validar_banco.py
```

Os [resultados estruturados](resultado-validacao.json) registram contagens,
distribuição de dificuldade e hashes dos cinco arquivos verificados. Eles
correspondem a esta versão e devem ser atualizados após mudanças no banco.

## Revisão posterior de Sistema de Numeração

Esta etapa alterou somente questões de SN e sua documentação/validação de apoio.
Os quatro arquivos dos outros assuntos e os bancos anteriores permanecem
inalterados. SN-03/07/10/12/17 receberam as correções solicitadas; as questões
SN-01 a SN-12 receberam revisão individual do recurso visual. O banco continua
com 100 questões validadas e 60 visualmente apoiadas, das quais 12 em SN.
Detalhes e versões completas das cinco correções estão no
[relatório específico de SN](relatorio-revisao-sn.md).

## Revisão posterior de Operações com Números Naturais

Foram revalidadas ON-01 a ON-20, mantendo dados, habilidades, dificuldades e
gabaritos. As sete correções solicitadas foram aplicadas e a justificativa do
distrator C de ON-17 foi precisada. Os 12 recursos visuais de ON agora são SVG;
a grade de ON-05 foi preservada e aprimorada, sem a tabela redundante. Esta
etapa atualizou somente ON e arquivos de documentação e validação de apoio.
Os outros assuntos e bancos anteriores permaneceram preservados. O banco
continua com 100 questões validadas e 60 visuais, sendo 12 em ON.
Ver o [relatório específico de ON](relatorio-revisao-on.md).

## Revisão posterior de Múltiplos e Divisores

As 20 questões de MD foram relidas e revalidadas. MD-02/03/06/07/09/18/20
receberam as correções solicitadas, incluindo a reformulação do distrator A de
MD-20; gabaritos, habilidades, dificuldades e dados foram preservados.
Os 12 recursos visuais de MD agora são SVG; a representação das estacas de
MD-06 foi preservada e aprimorada. Os outros assuntos e bancos anteriores
permanecem idênticos. O banco continua com 100 questões validadas e 60 visuais,
sendo 12 em MD. Ver as modificações e as sete versões completas no
[relatório específico de MD](relatorio-revisao-md.md).

## Revisão posterior de Frações

As 20 questões de FR foram relidas e revalidadas. FR-01/02/04/06/07/10/12/17
receberam as correções solicitadas. Os dados, habilidades, dificuldades,
alternativas e gabaritos foram preservados. FR-01 a FR-12 agora têm um SVG por
questão, com partições, proporções e inteiros de referência conferidos. Não há
gabaritos ou resultados calculados nos desenhos. Os outros assuntos e bancos
anteriores permanecem idênticos. O banco continua com 100 questões validadas e
60 visuais, sendo 12 em FR. Ver as modificações e as oito versões completas no
[relatório específico de FR](relatorio-revisao-fr.md).

## Revisão posterior de Números Decimais

As 20 questões de ND foram relidas e revalidadas. Os 12 recursos visuais foram
revisados, incluindo a precisão e legibilidade da reta de ND-10. ND-09 explicita
frascos inteiros, de um único tamanho e volume total exatamente 2 L. ND-05 mantém
a resolução correta, com limite inferior 23,35 incluído e superior 23,45 excluído.
Dados, habilidades, dificuldades, alternativas, resoluções e gabaritos foram
preservados. Os outros assuntos e bancos anteriores permanecem idênticos.
O banco continua com 100 questões validadas e 60 visuais, sendo 12 em ND.
Ver as modificações, os 12 recursos e as versões completas de ND-05 e ND-09 no
[relatório específico de ND](relatorio-revisao-nd.md).

## Implementação posterior da seleção

O manifesto registra as cotas 8/14/8 e mínimo de três visuais por assunto.
O [mecanismo](../mecanismo/README.md) aplica essas restrições e separa apresentação
e correção. Os relatórios anteriores de cada assunto foram preservados como
registro das etapas de revisão.
