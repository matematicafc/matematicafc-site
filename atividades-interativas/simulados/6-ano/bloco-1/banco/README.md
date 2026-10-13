# Banco de questões — 6º ano, Bloco 1

Banco documental para o futuro simulado **Números e Operações**. Não contém
interface, sorteio, histórico de tentativas ou integração de publicação.

## Arquivos

| Arquivo | Assunto | Preparadas | Pendentes | Total |
| --- | --- | --- | --- | --- |
| [sistema-numeracao.json](sistema-numeracao.json) | Sistema de numeração | 20 | 0 | 20 |
| [operacoes.json](operacoes.json) | Operações com números naturais | 20 | 0 | 20 |
| [multiplos-divisores.json](multiplos-divisores.json) | Múltiplos e divisores | 20 | 0 | 20 |
| [fracoes.json](fracoes.json) | Frações | 20 | 0 | 20 |
| [decimais.json](decimais.json) | Números decimais | 20 | 0 | 20 |
| **Total** | | **100** | **0** | **100** |

O [relatório pedagógico](../../../../../docs/relatorios/6-ano-bloco-1-numeros-operacoes.md)
registra a análise e as adaptações pedagógicas aprovadas. Os IDs originais não foram alterados,
nenhum item foi excluído e nenhuma subtarefa foi dividida em uma questão nova.

## Estrutura dos dados

Cada arquivo contém `versao_formato`, identificação do bloco, assunto, código
do assunto, hash da fonte consultada, estilos de referência e a lista `questoes`.
Cada questão contém:

- `id`, `numero_original` e `titulo`: identidade estável e correspondência com a postagem.
- `assunto`, `conteudo`, `habilidade` e `dificuldade`: classificação para revisão e seleção futura.
- `fonte`: URL, número, texto original completo da questão e gabarito publicado. É um registro histórico, não o enunciado adaptado.
- `enunciado.contexto` e `enunciado.comando`: texto a usar na adaptação, acompanhado dos recursos visuais.
- `recursos_visuais`: fragmentos estáticos HTML/CSS preservados, texto do recurso e linhas das tabelas em listas estruturadas. Imagens geométricas feitas com CSS não foram reduzidas apenas ao seu texto.
- `dependencia_visual`: indicação da função do desenho, quadro ou tabela.
- `alternativas`: letras A–D, texto, valores semânticos e erro comum associado a cada distrator. O campo `erro_comum` é nulo apenas na alternativa correta.
- `componentes_resposta`: significado e ordem dos elementos em `alternativas[].valores`. Listas internas representam conjuntos, sequências, pares ou agrupamentos, conforme o nome do componente.
- `gabarito`: letra da alternativa correta **do banco**. As alternativas podem estar em ordem diferente da fonte; não usar o gabarito original para corrigi-las.
- `resposta_matematica` e `resolucao_comentada`: resposta e explicação, incluindo todas as subtarefas mantidas.
- `status`, `elegivel_sorteio`, `observacoes` e `correcoes`; nos quatro itens adaptados após aprovação, `habilidade_original` e `adaptacao_pedagogica` preservam o histórico da decisão.

Os valores monetários e decimais usados na validação são strings com ponto
decimal (`"41.25"`); o texto exibível usa português do Brasil (`R$ 41,25`).
Frações são strings como `"3/4"`, comparadas como números racionais exatos.
Os valores semânticos são dados de verificação, não textos para apresentar ao
estudante. O erro de um distrator é uma hipótese pedagógica, não um diagnóstico
automático do estudante que o selecionar.

## Adaptações pedagógicas aprovadas e concluídas

As quatro adaptações foram expressamente aprovadas pelo usuário. Todos os 100
registros têm `status=preparada`, `elegivel_sorteio=true`, quatro alternativas e
um gabarito A–D válido. **Não há registros pendentes.**

| ID | Adaptação realizada | Gabarito e resultado |
| --- | --- | --- |
| SN-03 | Reconhecer as representações numérica e por extenso do quadro de ordens. | C: 24.638, vinte e quatro mil seiscentos e trinta e oito. |
| SN-06 | Identificar o total e outra decomposição equivalente. | D: 47.326 e 47.000 + 300 + 20 + 6. |
| ON-10 | Identificar o quociente e conferir pela multiplicação, sem atribuir uma causa ao erro original. | A: 48, pois 48 × 18 = 864. |
| FR-19 | Reconhecer um par de frações equivalentes sob os limites originais dos denominadores. | C: 18/24 e 21/28. |

Cada item registra a descrição da adaptação e a aprovação em
`adaptacao_pedagogica`; a solicitação anterior fica em `revisao_anterior` como
histórico, sem bloquear o item. `habilidade_original` conserva a habilidade
anterior, enquanto `habilidade` descreve o objetivo efetivamente avaliado.
Dados, contextos e recursos visuais foram preservados.

Nos itens argumentativos, selecionar uma explicação não equivale à produção
escrita livre. As quatro mudanças de objetivo de produção/avaliação acima foram
aprovadas explicitamente, e a limitação continua documentada.

## Correção aprovada de MD-15

O banco utiliza **A=4574**, **B=3690** e **C=5428**. As somas são 20, 18 e 19;
apenas **B** atende ao critério de divisibilidade por 9. A tabela do recurso
visual foi atualizada junto com a resolução e o gabarito.

`fonte.texto_original` conserva A=4572, conforme a consulta original, e o campo
`correcoes` documenta a troca aprovada. A postagem no Blogger não foi alterada.

## Validação

Na raiz do repositório, executar com Python 3, sem dependências externas:

```sh
python3 atividades-interativas/simulados/6-ano/bloco-1/banco/validar_banco.py
```

O validador utiliza operações independentes dos gabaritos declarados: calcula
resultados com inteiros, `Decimal` e `Fraction`, verifica conjuntos e sequências,
critérios de divisibilidade, primalidade, MMC, arredondamento contextual e
frações equivalentes. Confere IDs, quantidade de itens, campos, quatro opções,
unicidade da resposta, correspondência do gabarito, erros comuns dos três
distratores, registro das adaptações aprovadas e a tabela de MD-15. Também confere a escrita por extenso de SN-03, a soma das decomposições de SN-06, a operação inversa de ON-10 e os limites estritos dos denominadores de FR-19 antes de simplificar as frações.

Resultado desta preparação: **100 registros conferidos; 100 com quatro alternativas e uma única resposta matematicamente correta; zero pendências**. Todos possuem resolução comentada e classificação por assunto, habilidade e dificuldade. A verificação do significado dos textos e
da adequação pedagógica complementa a validação dos valores estruturados; uma
alteração futura do texto sem atualizar seus valores precisa ser revista.

## Preservação visual e limites

Os fragmentos são dados estáticos guardados para a futura implementação. Os
estilos originais contêm seletores globais e **não devem ser injetados diretamente
no Blogger**. Será preciso isolar estilos por contêiner, adaptar os recursos à
interface e verificar responsividade e acessibilidade quando essa etapa for
autorizada. Nenhum fragmento foi renderizado como interface nesta preparação.

Manter as relações geométricas, os dados de tabelas e as pistas originais;
descrever recursos de maneira acessível sem fornecer a resposta extra. Letras
que identificam personagens, cartões ou códigos pertencem ao recurso original e
são distintas das letras de seleção A–D. Nas figuras FR-02/03, nas etiquetas
ND-04 e nos recibos ON-08, a ordem original foi preservada para evitar ambiguidade.

Apenas itens `preparada` e `elegivel_sorteio=true` poderão compor uma seleção
futura, depois da revisão pedagógica. Ainda não foram implementadas persistência
do histórico, seleção de inéditas ou regras de reutilização. Não publicar no
Blogger sem autorização explícita.

## Requisitos documentados para a futura seleção e o boletim

Seguir as [regras dos simulados](../../../../../docs/simulados.md). Cada tentativa
de 30 questões deverá ter pelo menos 15 itens com recursos visuais relevantes,
além das seis questões de cada assunto. A validação matemática existente não
classifica a relevância pedagógica dos recursos nem comprova essa cota no sorteio.

O nome será opcional e usado exclusivamente no boletim; resultados individuais
serão processados localmente no navegador. Não haverá cadastro obrigatório,
e-mail, telefone, envio ou armazenamento desses dados em servidores. PDF local,
compartilhamento voluntário e apresentação para celular e impressão são
requisitos da futura interface, ainda não implementados.
