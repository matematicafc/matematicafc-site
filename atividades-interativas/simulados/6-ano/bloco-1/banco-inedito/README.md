# Banco autoral inédito — 6º ano, Bloco 1

Banco inédito revisado pedagogicamente, elaborado separadamente do banco de
adaptações. **100 questões, 60 visualmente apoiadas e 100 validadas matematicamente.**
Os 100 itens tiveram a revisão concluída pelo usuário e estão registrados como `aprovada`.

- [Sistema de numeração](sistema-numeracao.json): 20 questões, 12 visuais.
- [Operações com números naturais](operacoes.json): 20 questões, 12 visuais.
- [Múltiplos e divisores](multiplos-divisores.json): 20 questões, 12 visuais.
- [Frações](fracoes.json): 20 questões, 12 visuais.
- [Números decimais](decimais.json): 20 questões, 12 visuais.
- [Relatório de validação](relatorio-validacao.md).
- [Caderno completo para revisão pedagógica](revisao-pedagogica.md).
- [Manifesto e restrições do sorteio futuro](manifesto.json).
- [Resultado da validação](resultado-validacao.json).

## Dados e identidade

IDs `MFC6-B1-I-SN-01` a `MFC6-B1-I-ND-20` não colidem com os do banco anterior.
Cada registro guarda enunciado, dados, quatro alternativas, gabarito, resolução,
habilidade, dificuldade, notas de elaboração, revisão e metadados de seleção.
`modelo_verificacao` documenta o cálculo verificável a partir dos dados;
`alternativas[].valor` é a representação semântica da resposta, não o texto exibido.
Frações e decimais são strings numéricas exatas; zeros de um identificador textual
são tratados como texto, não como valor numérico.

Tabelas HTML e SVG são recursos estáticos de questão, sem interface de simulado.
São armazenados nos JSON; os 58 SVG também foram salvos na pasta `recursos/`.
Uma questão conta como visual somente uma vez. Os campos `dados`, `cabecalhos`,
`linhas` e `geometria` permitem conferir os recursos contra os modelos.

## Metadados para seleção

Usar `id`, `assunto`, `sorteio.visual_relevante`, `dificuldade.nivel` e
`sorteio.grupo_equivalencia`. O manifesto define 30 itens, seis por assunto e
mínimo global de 15 visuais. A indicação `ativo` marca presença no banco candidato;
**não substitui aprovação pedagógica**. O mecanismo exige também
`revisao_pedagogica.status === "aprovada"`.

Priorizar IDs ainda não utilizados e manter histórico local, separado do nome.
O código de seleção e o histórico opcional ficam em [../mecanismo/](../mecanismo/README.md), separados do banco.

## Verificação

```sh
python3 atividades-interativas/simulados/6-ano/bloco-1/banco-inedito/validar_banco.py
```

Executar da raiz do repositório com Python 3, sem dependências externas.
O validador não implementa interface. Os arquivos de referência em `../banco/`
foram preservados. Não publicar automaticamente no Blogger.

## Revisão de Sistema de Numeração

As questões SN-01 a SN-20 foram conferidas nesta etapa. Dez tabelas foram
substituídas por SVG matemáticos, e duas tabelas comparativas foram reformuladas.
SN permanece com 12 questões visuais; os outros quatro assuntos não foram
alterados. Ver o [relatório específico](relatorio-revisao-sn.md).

## Revisão de Operações com Números Naturais

ON-01 a ON-20 foram conferidas; sete correções solicitadas foram aplicadas.
As 12 tabelas de ON deram lugar a 12 diagramas SVG, preservando e aprimorando
a grade de ON-05. ON permanece com 12 questões visuais. A justificativa de um
distrator de ON-17 também foi precisada. Os outros assuntos e os bancos anteriores
foram preservados. Ver o [relatório específico](relatorio-revisao-on.md).

## Revisão de Múltiplos e Divisores

MD-01 a MD-20 foram conferidas; as sete correções solicitadas foram aplicadas.
As 12 tabelas de MD deram lugar a 12 SVG matemáticos, preservando e aprimorando
a representação das estacas de MD-06. MD permanece com 12 questões visuais.
O distrator A de MD-20 foi reformulado, mantendo uma única alternativa correta.
Os outros assuntos e os bancos anteriores foram preservados.
Ver o [relatório específico](relatorio-revisao-md.md).

## Revisão de Frações

FR-01 a FR-20 foram conferidas; as oito correções solicitadas foram aplicadas.
As 12 tabelas de FR foram substituídas e seus três SVG anteriores reformulados.
O assunto permanece com 12 questões visualmente apoiadas, agora com um SVG por
item de FR-01 a FR-12. Dados, habilidades, dificuldades, alternativas e gabaritos
foram preservados. Os outros assuntos e bancos anteriores permanecem idênticos.
Ver o [relatório específico](relatorio-revisao-fr.md).

## Revisão de Números Decimais

ND-01 a ND-20 foram conferidas. As 12 tabelas foram substituídas por SVG e a
reta de ND-10 foi preservada e aprimorada. O assunto mantém 12 visuais; dados,
habilidades, dificuldades, alternativas, resoluções e gabaritos foram preservados.
ND-09 explicita frascos inteiros de um único tamanho e volume exatamente 2 L.
Os limites de arredondamento de ND-05 foram verificados independentemente.
Os outros assuntos e bancos anteriores permanecem idênticos.
Ver o [relatório específico](relatorio-revisao-nd.md).

## Mecanismo de seleção

O [mecanismo reutilizável](../mecanismo/README.md) aplica as cotas aprovadas,
embaralha questões e alternativas e libera correção somente após finalização.
Não há interface, boletim ou exportação.
