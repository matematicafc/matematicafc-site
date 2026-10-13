# Implementação do mecanismo de seleção — 6º ano, Bloco 1

Os 100 itens inéditos foram alinhados como `aprovada` antes da implementação,
conforme a revisão concluída e a autorização expressa do usuário. Foi alterado
somente o objeto `revisao_pedagogica` de cada item. Nenhum enunciado, alternativa,
recurso visual, resolução, gabarito, dado numérico ou dificuldade foi modificado.

## Comportamento implementado

O mecanismo valida exclusivamente o banco `MFC6-B1-INEDITO-V1`, com cinco assuntos
de 20 questões e 12 visuais cada. Enumera conjuntos de seis com cotas SN 2/3/1,
ON 2/2/2, MD 1/3/2, FR 2/3/1 e ND 1/3/2, na ordem fácil/média/difícil, filtrando
pelo menos três visuais por assunto. Resultam 30 questões com cotas globais
8/14/8 e pelo menos 15 visuais. Não relaxa regras em caso de banco inviável.
IDs e grupos de equivalência são únicos; bancos antigos e itens pendentes são rejeitados.

As questões e alternativas são embaralhadas com Fisher–Yates. As alternativas
recebem identificadores estáveis vinculados à questão e opção original. A letra
exibida é atribuída após o embaralhamento e a correção permanece associada ao ID.
A projeção pública e as ordens ficam congeladas, separadas da correção privada.
É possível responder, alterar e limpar escolhas antes de finalizar. A correção
só é liberada depois da finalização; chamadas repetidas são idempotentes e
respostas posteriores são bloqueadas. Nenhum boletim é calculado.

Novas aplicações no mesmo mecanismo têm conjuntos diferentes da imediatamente
anterior, sem alterar o objeto de uma aplicação existente. Questões podem ser
reutilizadas entre tentativas. O histórico opcional usa apenas contadores por ID,
prioriza questões nunca apresentadas e, no desempate, menor soma de utilizações
entre conjuntos válidos. A criação conta uma utilização por questão, inclusive
em aplicações abandonadas. Não armazena nome, respostas ou resultados individuais.
Histórico inválido ou armazenamento bloqueado não impede a seleção.

## Resultados executados

O comando `node --test atividades-interativas/simulados/6-ano/bloco-1/mecanismo/testes/mecanismo.test.mjs`
passou com **8 testes, zero falhas e zero testes ignorados**, em Node v24.19.0.
O teste principal executou **10.000 aplicações**, com 300.000 seleções e 300.000
embaralhamentos de alternativas. Foram testadas ainda 100 aplicações com
histórico e os casos adicionais de falhas, imutabilidade, carregamento e estado.

| Conferência | Resultado |
| --- | --- |
| Questões por aplicação | 30 em todas |
| Questões por assunto | 6 em todas |
| Dificuldades globais | 8 fáceis, 14 médias, 8 difíceis em todas |
| Cotas por assunto | Todas respeitadas |
| Visuais por assunto | Pelo menos 3 em todas |
| Visuais totais observados | Mínimo 15; máximo 27; média 19,5912 |
| IDs e grupos repetidos na aplicação | Zero |
| Conjuntos completos distintos no teste principal | 10.000 |
| Permutações das alternativas observadas | Todas as 24 |
| Gabaritos corretos após embaralhamento | 300.000 correspondências conferidas |
| Gabaritos, resoluções ou modelos na projeção pública | Nenhum |
| Correção antes de finalizar | Bloqueada por erro da API |
| Alteração da ordem ao responder ou finalizar | Nenhuma |

As letras corretas exibidas ocorreram A: 74.543, B: 75.196, C: 75.485 e D: 74.776.
Os testes verificam variação da ordem das questões e que mudanças de resposta não
alteram as ordens. Há teste de nova seleção diferente mesmo com RNG constante,
validando a proteção contra repetição completa consecutiva. A faixa matemática
permitida continua sendo 15 a 30 visuais; 27 é o máximo observado nessa execução.

O teste do histórico confirma prioridade de inéditas e de menor uso, persistência,
contabilização de 3.000 apresentações em 100 tentativas e recuperação diante de
JSON inválido ou falha de gravação. Entradas inválidas, alternativas de outra
questão, RNG fora de [0,1), falta de aprovação e cotas inviáveis são rejeitados.
O teste do manifesto confere igualdade das cotas com as constantes da implementação.

O validador Python também passou nas **100 questões**, com 60 visuais e aprovação
alinhada. Os resultados estruturados estão em `resultado-testes.json` e
`../banco-inedito/resultado-validacao.json`.

## Arquivos criados

Na pasta `mecanismo/`:

- `regras.mjs`, `aleatorio.mjs`, `banco.mjs`, `historico.mjs`, `selecao.mjs`, `aplicacao.mjs`, `index.mjs`.
- `testes/mecanismo.test.mjs`.
- `README.md`, `relatorio-implementacao.md`, `resultado-testes.json`.

## Arquivos modificados

Na pasta `banco-inedito/`:

- `sistema-numeracao.json`, `operacoes.json`, `multiplos-divisores.json`, `fracoes.json`, `decimais.json`: somente metadados de revisão.
- `manifesto.json`: cotas aprovadas e estado de liberação.
- `validar_banco.py`: conferência das cotas do manifesto e aprovação dos itens.
- `resultado-validacao.json`: resultado e hashes atualizados.
- `README.md`, `relatorio-validacao.md`: estado atual e referências ao mecanismo.
- `revisao-pedagogica.md`: somente frase de estado no cabeçalho, sem alteração das questões.

Também foi atualizado o `README.md` da pasta `bloco-1/`, identificando o banco
inédito como fonte ativa e o banco anterior como referência.

A comparação dos snapshots confirmou preservação integral do conteúdo dos 100
itens fora de `revisao_pedagogica`. A comparação por SHA-256 confirmou que bancos
antigos, recursos e relatórios específicos dos assuntos permanecem idênticos.
Outros anos, outros repositórios e Blogger não foram alterados.

## Integração futura e limites

A [documentação de uso](README.md) apresenta a API e exemplos. Importar
`criarMecanismo`, passar os cinco objetos JSON aprovados e chamar `novaAplicacao`
uma vez por tentativa. Navegar e registrar escolhas no mesmo objeto. Apresentar
somente `obterQuestoes()` antes da finalização; depois, usar `finalizar()` ou
`obterCorrecao()` para acessar gabaritos e resoluções.

A aplicação fica em memória; persistência e restauração de ordens após recarga da
página não foram implementadas. O histórico armazena apenas frequência de seleção.
A separação de dados protege a API e o fluxo normal, mas o banco completo carregado
no navegador pode ser inspecionado. Não há proteção criptográfica dos gabaritos.
Os testes são da API em Node; a interface responsiva, acessibilidade da navegação,
integração no Blogger, boletim e PDF permanecem fora desta etapa. Nada foi publicado.
