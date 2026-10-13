# Mecanismo de seleção — 6º ano, Bloco 1

JavaScript em módulos ES, sem dependências externas, interface, boletim ou PDF.
Usa exclusivamente `../banco-inedito/`: identidade `MFC6-B1-INEDITO-V1`, 100
questões aprovadas, cinco assuntos com 20 itens e 12 visuais cada. A validação
matemática do conteúdo permanece em `../banco-inedito/validar_banco.py`.

## Regras fixas

| Assunto | Fácil | Média | Difícil | Total | Mínimo visual |
| --- | ---: | ---: | ---: | ---: | ---: |
| SN | 2 | 3 | 1 | 6 | 3 |
| ON | 2 | 2 | 2 | 6 | 3 |
| MD | 1 | 3 | 2 | 6 | 3 |
| FR | 2 | 3 | 1 | 6 | 3 |
| ND | 1 | 3 | 2 | 6 | 3 |
| Total | 8 | 14 | 8 | 30 | 15 |

Na preparação, são enumerados os conjuntos de seis que cumprem as cotas e têm
pelo menos três visuais. Sem histórico, cada conjunto elegível tem a mesma
probabilidade. Com histórico, favorecem-se primeiro os conjuntos com mais IDs
nunca apresentados e depois os de menor soma de utilizações; empates são sorteados.
Nenhuma restrição é relaxada. Banco não aprovado, incompleto, inconsistente ou
inviável provoca erro antes de produzir aplicação.

A ordem das questões e das alternativas usa Fisher–Yates e fica congelada na
aplicação. Cada opção tem ID `${questaoId}:opcao:${letraOriginal}` e letra exibida
A–D, atribuída depois do embaralhamento. Respostas são armazenadas por ID de opção.
Uma nova aplicação no mesmo mecanismo garante outro conjunto completo em relação
à imediatamente anterior, mesmo se a fonte aleatória repetir escolhas. Isso não
impede a repetição de questões entre aplicações ou a volta de conjuntos mais antigos.

## Utilização na futura interface

Exemplo de integração, sem construir uma interface:

```js
import { carregarBanco, criarMecanismo, criarHistoricoLocal } from './mecanismo/index.mjs';

// URL da pasta do banco inédito em hospedagem estática autorizada.
const blocos = await carregarBanco('/atividades-interativas/simulados/6-ano/bloco-1/banco-inedito/');
const mecanismo = criarMecanismo(blocos); // sem histórico por padrão
const aplicacao = mecanismo.novaAplicacao();
const questoes = aplicacao.obterQuestoes();

const primeira = questoes[0];
aplicacao.responder(primeira.id, primeira.alternativas[0].id);
aplicacao.responder(primeira.id, primeira.alternativas[1].id); // pode alterar
aplicacao.responder(primeira.id, null); // pode limpar
aplicacao.obterRespostas(); // IDs das escolhas, sem gabaritos
// aplicacao.obterCorrecao() lança erro antes da finalização.
const correcao = aplicacao.finalizar(); // gabaritos e resoluções liberados
aplicacao.obterCorrecao(); // mesma correção final, imutável
const proxima = mecanismo.novaAplicacao(); // a anterior permanece intacta
```

`criarMecanismo(blocos)` também aceita os cinco objetos JSON já incorporados a um
pacote local de recursos. Não é necessário carregar os bancos antigos. Criar o
mecanismo uma vez e a aplicação uma vez por tentativa; navegar usando o mesmo
objeto. Renderizar `alternativas[].letra` e guardar `alternativas[].id`.
Após a finalização, respostas ficam bloqueadas e chamadas repetidas a `finalizar`
retornam o mesmo resultado. Questões não respondidas aparecem com `respostaId: null`.
O mecanismo libera correção, mas não calcula boletim ou indicadores de desempenho.

### Histórico opcional

```js
// O acesso ao localStorage deve ocorrer apenas quando o histórico for ativado.
const historico = criarHistoricoLocal(window.localStorage);
const mecanismoComHistorico = criarMecanismo(blocos, { historico });
```

O adaptador usa a chave `MFC6-B1-INEDITO-V1:historico-selecao:v1` e guarda somente
contadores por ID. A apresentação é contabilizada uma vez na criação da aplicação,
mesmo quando a tentativa for abandonada. Não guarda nomes, respostas ou resultados.
Histórico ausente, inválido ou armazenamento bloqueado não impede a aplicação;
o adaptador preserva o histórico possível em memória e informa falhas em
`obterErro()`. Se obter `window.localStorage` provocar erro, usar o mecanismo sem
histórico. Um adaptador alternativo pode implementar `ler()` e `registrar(ids)`.
O histórico não promete ausência de reutilização entre tentativas: as cotas têm
prioridade quando os itens inéditos disponíveis não bastam.

## Apresentação e correção

`obterQuestoes` expõe somente identidade, classificação, enunciado, recursos
visuais e alternativas com ID, letra exibida e texto. Não inclui gabarito,
resolução, erro comum, valor semântico ou modelo de verificação. Os dados de
correção ficam em fechamento privado e só são acessíveis pela API depois de
`finalizar`. Não há requisições de rede para enviar respostas ou dados pessoais.

A separação protege o fluxo normal da futura interface. O banco completo é
carregado localmente; inspecionar arquivos no navegador pode revelar respostas.
Não se afirma proteção criptográfica. A aplicação vive em memória; restauração
após recarregar a página e integração no Blogger pertencem à etapa da interface.

## Módulos

- `regras.mjs`: identidade, arquivos permitidos, cotas e imutabilidade.
- `aleatorio.mjs`: fonte aleatória e Fisher–Yates; fonte injetável em testes.
- `banco.mjs`: leitura, validação e preparação dos conjuntos elegíveis.
- `selecao.mjs`: escolha com cotas, histórico e nova aplicação diferente.
- `historico.mjs`: adaptador local opcional, sem dados pessoais.
- `aplicacao.mjs`: projeção pública, respostas e liberação da correção.
- `index.mjs`: API pública de integração.
- `testes/mecanismo.test.mjs`: testes reais usando os cinco JSON revisados.

## Executar testes

Da raiz do repositório, com Node.js 18 ou superior e Python 3:

```sh
node --test atividades-interativas/simulados/6-ano/bloco-1/mecanismo/testes/mecanismo.test.mjs
python3 atividades-interativas/simulados/6-ano/bloco-1/banco-inedito/validar_banco.py
```

O teste principal executa 10.000 aplicações e verifica todas as cotas, recursos
visuais, IDs únicos, opções, correspondência dos gabaritos, estabilidade e
bloqueio pré-finalização. Outros testes cobrem histórico, armazenamento corrompido,
falhas, entradas inválidas, imutabilidade e novas aplicações. Ver os
[resultados da execução](resultado-testes.json) e o
[relatório técnico](relatorio-implementacao.md).

Nenhum recurso foi publicado. A futura interface deverá tratar erros da API e
apresentar somente a projeção pública antes da finalização.
