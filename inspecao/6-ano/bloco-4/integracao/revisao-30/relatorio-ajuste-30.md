# Bloco 4 — correção da candidata para aplicações exclusivas de 30 questões

Data: 20/10/2026. Implementação somente local, aguardando aprovação. Este relatório substitui a descrição funcional anterior de duas modalidades; os relatórios anteriores permanecem como histórico.

## Ajuste realizado

A candidata em `../index.html` agora apresenta somente 30 questões por tentativa. Foram retirados o seletor de modalidades, a descrição de 40 questões, o botão de retorno à escolha de modalidade e o ramo de seleção de 40. O total da interface passou a ser constante. O seletor rejeita explicitamente pedidos de 40 questões. As cotas de 30, a aleatoriedade, o embaralhamento e o rodízio dos seis pares foram preservados.

O futuro Simulado Geral de 40 questões, abrangendo os Blocos 1 a 4, não foi implementado. Não se alterou seu planejamento nem se criou outro aplicativo.

## Conteúdo preservado

- 100 questões, 400 alternativas, 100 gabaritos e 100 resoluções, idênticos aos da candidata anterior e aos bancos originais.
- Banco: 32 fáceis, 48 médias e 20 difíceis.
- 108 recursos: 70 SVGs, 32 tabelas HTML e seis quadros HTML; presentes em 95 questões.
- Rotinas de aplicação/correção, boletim, geração do PDF e documento de impressão comparadas com a versão anterior e preservadas integralmente.
- Logotipo, aparência, navegação, alteração/limpeza de respostas, contador, confirmação do encerramento, resultado por assunto, consulta, gabarito e reinício preservados.
- Bancos originais e interface original continuam desativados/bloqueados. Nenhum arquivo dos Blocos 1, 2 e 3 foi modificado.

A verificação de hashes conferiu 830 arquivos fora da candidata no diretório de desenvolvimento e os 887 arquivos da lista histórica de preservação, incluindo o repositório publicado. Nenhuma diferença nos arquivos protegidos.

## Regra vigente

Dois assuntos fornecem oito questões: 2 fáceis, 4 médias, 2 difíceis. Os outros dois fornecem sete: 2 fáceis, 3 médias, 2 difíceis. Total por tentativa: **30 questões, 8 fáceis, 14 médias e 8 difíceis**.

Cada ciclo de seis aplicações usa os seis pares possíveis uma vez; cada assunto fornece oito questões em três aplicações do ciclo. O ciclo seguinte é embaralhado, evitando repetir imediatamente o último par. Sem histórico persistente; repetições entre tentativas são permitidas. Mínimos visuais: três por assunto e 15 na tentativa.

## Testes executados na versão corrigida

| Verificação | Resultado |
| --- | --- |
| 10.000 seleções de 30, seguidas da construção e correção da aplicação | Aprovadas, zero violações |
| Cotas 8/8/7/7 e dificuldades 8/14/8 | Corretas em todas as seleções |
| Seis pares uma vez por ciclo e ausência de questões duplicadas | Aprovados |
| Mínimos visuais | Atendidos em todas as seleções |
| Embaralhamento de questões/alternativas e remapeamento dos gabaritos/justificativas | Aprovados nas 10.000 aplicações |
| Pedido de seleção de 40 | Rejeitado, conforme esperado |
| Ausência do seletor e de ações/textos de modalidade na interface | Confirmada |
| Navegador: 320 e 1.280 px, quatro cenários por largura | Oito cenários aprovados |
| Alterar/limpar resposta, navegar, cancelar/confirmar finalização, consultar, gabarito e reiniciar | Aprovados |
| Correção antes do encerramento | Bloqueada; gabarito/resoluções ausentes da apresentação prévia |
| Download do PDF pelo botão nas duas larguras | Concluído; numeração 1 a 30 e resoluções conferidas |
| Impressão A4 pelo motor Chromium | Confirmadas as 30 questões e resoluções nas duas larguras |
| 108 recursos renderizados nas duas larguras | Sem estouro horizontal nem rótulos SVG fora do viewBox nas medições automáticas |
| Erros JavaScript / requisições externas observadas | Zero / zero |

Cenários de pontuação, em ambas as larguras:

- Todas corretas: 30 acertos, zero erros, zero em branco.
- Todas incorretas: zero acertos, 30 erros, zero em branco.
- Parcial: 10 acertos, 10 erros, 10 em branco.
- Sem respostas: zero acertos, zero erros, 30 em branco.

Os dois PDFs baixados têm 37 e 38 páginas, conforme os itens sorteados; as saídas de impressão têm 30 e 31 páginas. Todos contêm as 30 questões completas. A paginação não é fixa porque enunciados e recursos têm comprimentos diferentes.

## Arquivos modificados

Somente dentro de `validacao-integracao/`:

- `index.html`: candidata corrigida.
- `componentes/selecao.js`: seleção exclusiva de 30, com o rodízio preservado.
- `montar.py`: gerador atualizado, sem criação da modalidade de 40.
- `manifesto-fontes.json`: hash/tamanho atualizados, com modalidade única registrada.
- `LEIA-ME.md`: instruções vigentes e distinção dos relatórios históricos.

Arquivos novos em `revisao-30/`: testes de seleção, navegador e integridade; este relatório; resultados JSON; capturas e PDFs de evidência. A subpasta `antes/` preserva cópias da candidata, manifesto, gerador, seletor e instruções anteriores. Testes e relatórios históricos não foram sobrescritos.

## Integridade da candidata atual

Arquivo: `/workspace/matematicafc-desenvolvimento-bloco4/6-ano/bloco-4/validacao-integracao/index.html`

Tamanho: **2.011.207 bytes**.

SHA-256:

`00a752cdccab5c3d821ebda1806d3c29ccb85b401a3b2383314c9d68926dc3a6`

## Limitações e avaliação pendente

A inspeção independente e a conferência física de impressão continuam pendentes. Os testes usaram Chromium em HTTP interno, sem recursos externos. A janela nativa de impressão foi interceptada no teste automatizado, e a saída A4 foi gerada pelo motor de impressão; não foi usada impressora física. A abertura direta por `file://` no Windows não foi testada neste ambiente.

O HTML continua autossuficiente. Como todo arquivo estático que incorpora o banco, ele contém os gabaritos no código-fonte; a interface e a API de correção os disponibilizam somente após a finalização.

**Não houve commit, push, merge ou publicação.** Nenhuma cópia do GitHub foi atualizada: o link RAW anteriormente fornecido ainda aponta à versão histórica de duas modalidades. A correção atual aguarda avaliação e eventual autorização específica de transferência.
