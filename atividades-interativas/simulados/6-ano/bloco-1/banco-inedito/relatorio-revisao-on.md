# Revisão pedagógica — Operações com Números Naturais

## Resultado e escopo

As 20 questões ON-01 a ON-20 foram relidas e revalidadas. **20 validadas, 12 visualmente apoiadas e nenhum impedimento matemático identificado.** Todas mantêm quatro alternativas A–D, uma única correta, resolução comentada, habilidade e dificuldade. Nenhuma questão foi excluída ou dividida. A apreciação pedagógica final do material atualizado continua disponível para o usuário; a validação não certifica aprovação humana.

Dados, identificadores, habilidades, níveis de dificuldade, valores e textos das alternativas e gabaritos foram preservados. ON-01 a ON-12, ON-14, ON-17 e ON-19 tiveram alterações: 15 registros. ON-13, ON-15, ON-16, ON-18 e ON-20 permanecem idênticas. ON-17 recebeu somente uma precisão na justificativa de um distrator.

## Correções textuais

- ON-01: pacote explicitamente válido para os quatro dias, sem diária adicional; resolução compara períodos iguais.
- ON-03: título alterado para “Produção com parada para manutenção”. Enunciado explicita produção constante enquanto a prensa funciona.
- ON-07: pergunta admite expressamente empate entre os tempos totais.
- ON-09: título “Pacotes inteiros pelo menor custo”. Enunciado explicita compra de pelo menos 35 adesivos, com sobras permitidas e um único tamanho de pacote, conforme o modelo original.
- ON-11: limpezas somente entre experimentos; nenhum intervalo antes do primeiro ou depois do último. Resolução mostra quatro experimentos com três limpezas e cinco com quatro. Justificativas dos distratores B e D ajustadas: acrescentar uma limpeza indevida não explicaria a alternativa B de três experimentos.
- ON-14: título “Excluindo cópias e preservando originais”; enunciado, alternativas e resolução mantidos.
- ON-19: ofertas identificadas explicitamente como A e B. Resolução acrescenta referência comum de 50 caixas com 20 folhas e comparação das retiradas de 20 e 50 folhas. Cálculo dos produtos fica como conferência.
- ON-17: justificativa do distrator C identifica precisamente a confusão entre os 16 sensores testados no segundo dia e a quantidade restante. Enunciado, alternativas e resolução mantidos.

Os enunciados das demais questões visuais passaram a referenciar os diagramas em lugar das tabelas; ON-04 explicita que os totais incluem a interseção, ON-10 explicita a substituição da ponte e ON-12 explicita ausência de sobreposição. As condições são compatíveis com os dados e os modelos preexistentes.

## Revisão individual dos recursos visuais

| Questão | Recurso anterior | Recurso atualizado e função pedagógica |
| --- | --- | --- |
| ON-01 | Tabela de tarifas | Quatro diárias e faixa de pacote para o mesmo período; permite comparar coberturas iguais. |
| ON-02 | Tabela de pontuação | Grupos de sete ganhos e três penalidades, com sinais e rótulos. |
| ON-03 | Tabela de produção | Barra proporcional que separa manutenção e produção; ritmo indicado fora da barra. |
| ON-04 | Tabela de clubes | Diagrama de interseção; totais fora dos círculos e cinco participantes comuns no centro. |
| ON-05 | Tabela de dimensões + grade | Tabela redundante retirada; grade 6 × 8 preservada e aprimorada, com borda e dimensões explícitas. |
| ON-06 | Tabela de mudanças | Fluxo da retirada e do acréscimo, com estados inicial e intermediário desconhecidos. |
| ON-07 | Tabela de canais | Esquemas das fases de preparação e transmissão de cada canal, sem antecipar o empate. |
| ON-08 | Tabela de ofertas | Caminhos de desconto e entrega sobre o mesmo preço anunciado. |
| ON-09 | Tabela de pacotes | Conteúdo de um pacote P e de um Q desenhado por unidades, com preços e necessidade total. |
| ON-10 | Tabela de distâncias | Rotas com origem e destino comuns, ponte fechada e desvio substituto. Desenho sem escala. |
| ON-11 | Tabela de tempos | Sequência de experimentos e limpezas entre eles, com continuação indicada por pontos. |
| ON-12 | Tabela de medidas | Faixas retangulares lado a lado, malha unitária e altura comum; apoio à distributividade. |

As 12 tabelas foram retiradas. São 12 SVG revisados, dos quais 11 novos arquivos e a substituição do SVG já existente de ON-05, sem duplicar sua grade. Continuam **12 questões visuais**, distribuídas em quatro fáceis, quatro médias e quatro difíceis. ON-13 a ON-20 permanecem sem recurso visual. Os esquemas apresentam dados ou relações úteis à resolução e não fornecem os resultados calculados.

Cada SVG tem `viewBox`, largura fluida com limite e altura proporcional, título, descrição acessível, rótulos e contraste. Não há dependência exclusiva de cor nem carregamento de imagens externas. Os 12 foram renderizados e inspecionados a 320 px de largura; a verificação de integração e acessibilidade do futuro componente ocorrerá quando houver interface.

## Conferências matemáticas e de preservação

- Conferência manual dos enunciados, alternativas, justificativas e resoluções das 20 questões.
- Modelos matemáticos calculados a partir dos dados, sem consultar a letra do gabarito; quatro opções distintas e exatamente uma válida em cada item.
- Dados dos SVG comparados com os registros; contagem de grupos e unidades, borda, interseção, proporção do tempo, substituição do trecho e divisão das faixas verificadas.
- ON-11: máximo de quatro experimentos (57 minutos); cinco exigiriam 72 minutos.
- ON-19: compensação confere diferença de 30 folhas e coincide com 980 − 950.
- Execução do validador completo: 100 itens validados, 60 visuais. O reprocessamento dos outros assuntos é somente leitura.
- Comparação de SHA-256 dos arquivos preexistentes: outros quatro bancos inéditos, bancos anteriores, recursos de outros assuntos e relatório anterior de SN preservados. No caderno compartilhado, somente a seção de ON foi substituída; prefixo e sufixo comparados literalmente.

## Arquivos atualizados

- `operacoes.json`: revisões e histórico por item.
- `recursos/MFC6-B1-I-ON-01.svg` a `recursos/MFC6-B1-I-ON-12.svg`: 12 diagramas.
- `revisao-pedagogica.md`: somente seção de ON.
- `validar_banco.py`: conferência dos novos SVG de ON e da compensação de ON-19.
- `resultado-validacao.json`, `relatorio-validacao.md` e `README.md`: resultados, inventário de recursos e referências desta revisão.
- `relatorio-revisao-on.md`: este relatório e as sete versões completas solicitadas.

Nenhuma interface ou publicação foi realizada. Outros assuntos, bancos anteriores, Blogger e outros repositórios permanecem preservados.

## Versões completas das sete questões corrigidas

### MFC6-B1-I-ON-01 — Tarifa do armário

**Dificuldade:** facil. **Habilidade:** Comparar custos de estratégias de uso e quantificar economia.

Um centro esportivo oferece um plano diário e um pacote para guardar equipamentos. A pessoa usará o serviço por quatro dias. O pacote cobre todos esses quatro dias, sem cobrança diária adicional. Observe as ofertas no esquema. Qual plano custa menos e qual é a economia?

![Diagrama: Quatro espaços de diária, um para cada dia de uso, com R$ 9 em cada. Uma faixa de pacote cobre os mesmos quatro dias por R$ 30 no total, sem cobrança diária adicional. O total do plano diário não está calculado.](recursos/MFC6-B1-I-ON-01.svg)

**Descrição do recurso visual:** Quatro espaços de diária, um para cada dia de uso, com R$ 9 em cada. Uma faixa de pacote cobre os mesmos quatro dias por R$ 30 no total, sem cobrança diária adicional. O total do plano diário não está calculado.

- **A)** Pacote: R$ 30,00; economia de R$ 6,00.
- **B)** Diário: R$ 9,00; economia de R$ 21,00.
- **C)** Pacote: R$ 30,00; economia de R$ 9,00.
- **D)** Diário: R$ 36,00; economia de R$ 6,00.

**Gabarito: A.** O plano diário custa 4 × 9 = 36 reais para os quatro dias. O pacote cobre o mesmo período por 30 reais, sem cobrança diária adicional. A economia é 36 − 30 = 6 reais. Comparar apenas o preço de um dia com o pacote não compara períodos iguais.

**Distratores:**

- B: Comparar apenas um dia.
- C: Confundir preço diário com economia.
- D: Escolher o plano mais caro.

### MFC6-B1-I-ON-03 — Produção com parada para manutenção

**Dificuldade:** facil. **Habilidade:** Separar tempo produtivo e tempo indisponível antes de calcular capacidade.

Uma prensa produz peças em ritmo constante enquanto está funcionando. Dentro da janela de trabalho, ela ficará parada para uma manutenção. Observe o esquema, que reúne o tempo total, a parada e o ritmo de produção. Quantas peças podem ficar prontas nessa janela?

![Diagrama: Barra de 30 minutos dividida em uma parte de manutenção de 6 minutos e uma parte de produção sem duração escrita. O ritmo é quatro peças por minuto. A barra agrupa durações, sem indicar em qual momento ocorreu a parada.](recursos/MFC6-B1-I-ON-03.svg)

**Descrição do recurso visual:** Barra de 30 minutos dividida em uma parte de manutenção de 6 minutos e uma parte de produção sem duração escrita. O ritmo é quatro peças por minuto. A barra agrupa durações, sem indicar em qual momento ocorreu a parada.

- **A)** 120 peças.
- **B)** 114 peças.
- **C)** 96 peças.
- **D)** 24 peças.

**Gabarito: C.** Só 24 dos 30 minutos produzem peças. A capacidade é 24×4=96; não se deve multiplicar os minutos de manutenção.

**Distratores:**

- A: Ignorar manutenção.
- B: Retirar seis peças em vez de seis minutos de produção.
- D: Responder o tempo disponível como quantidade.

### MFC6-B1-I-ON-07 — Canal de envio mais rápido

**Dificuldade:** media. **Habilidade:** Comparar tempos totais que combinam parcela fixa e ritmo.

Uma turma precisa enviar uma pasta de 60 arquivos por um dos dois canais. Em cada canal, a preparação ocorre antes da transmissão. Considere velocidades constantes e os dados do esquema. Comparando o tempo total, algum canal termina antes do outro ou há empate?

![Diagrama: Pasta de 60 arquivos. Canal A: preparação de três minutos seguida de envio a seis arquivos por minuto. Canal B: preparação de sete minutos seguida de envio a dez arquivos por minuto. Os blocos indicam fases, não durações em escala; os totais não estão calculados.](recursos/MFC6-B1-I-ON-07.svg)

**Descrição do recurso visual:** Pasta de 60 arquivos. Canal A: preparação de três minutos seguida de envio a seis arquivos por minuto. Canal B: preparação de sete minutos seguida de envio a dez arquivos por minuto. Os blocos indicam fases, não durações em escala; os totais não estão calculados.

- **A)** B termina em 6 minutos; A em 10.
- **B)** A termina em 3 minutos; B em 7.
- **C)** Empatam, ambos em 13 minutos.
- **D)** B termina em 13 minutos; A em 16.

**Gabarito: C.** A termina em 3+60÷6=13 minutos. B termina em 7+60÷10=13. Embora B transmita mais rápido, demora mais para preparar; há empate.

**Distratores:**

- A: Ignorar preparação.
- B: Ignorar transmissão.
- D: Somar preparo de A duas vezes.

### MFC6-B1-I-ON-09 — Pacotes inteiros pelo menor custo

**Dificuldade:** dificil. **Habilidade:** Combinar arredondamento de pacotes e comparação de custos.

Um painel precisa de 35 adesivos. A compra deve fornecer pelo menos essa quantidade e pode deixar adesivos sobrando. A loja vende somente pacotes inteiros, sem adesivos avulsos, e a compra deve usar um único tamanho de pacote. Observe os pacotes e seus preços. Qual tamanho de pacote dá o menor custo para atender à necessidade?

![Diagrama: Necessidade de 35 adesivos. Um pacote P tem oito adesivos, desenhados em duas linhas de quatro, e custa R$ 10. Um pacote Q tem doze adesivos, em três linhas de quatro, e custa R$ 14. Não são mostradas quantidades de pacotes a comprar.](recursos/MFC6-B1-I-ON-09.svg)

**Descrição do recurso visual:** Necessidade de 35 adesivos. Um pacote P tem oito adesivos, desenhados em duas linhas de quatro, e custa R$ 10. Um pacote Q tem doze adesivos, em três linhas de quatro, e custa R$ 14. Não são mostradas quantidades de pacotes a comprar.

- **A)** Q: R$ 42,00; P custaria R$ 50,00.
- **B)** P: R$ 40,00; Q custaria R$ 42,00.
- **C)** P: R$ 10,00; Q custaria R$ 14,00.
- **D)** Q: R$ 28,00; P custaria R$ 50,00.

**Gabarito: A.** P exige cinco pacotes, custo 50 reais. Q exige três pacotes, custo 42 reais, fornecendo 36 adesivos. O preço unitário do pacote sozinho não decide o custo da compra.

**Distratores:**

- B: Comprar quatro pacotes P fornece só 32.
- C: Comparar só um pacote.
- D: Dois pacotes Q não cobrem a necessidade.

### MFC6-B1-I-ON-11 — Turnos com limites de uso

**Dificuldade:** dificil. **Habilidade:** Modelar repetição com intervalo somente entre atividades.

Um laboratório dispõe de um período total de 65 minutos. Cada experimento completo dura 12 minutos. Entre o fim de um experimento e o início do seguinte, são necessários 3 minutos de limpeza. Não há limpeza antes do primeiro nem depois do último experimento dentro desse período. Observe o esquema da sequência. Quantos experimentos completos cabem no período disponível?

![Diagrama: Sequência de experimentos de 12 minutos separados por limpezas de três minutos. Há três pontos indicando continuação, uma limpeza antes do último experimento e nenhuma depois dele. O período disponível é 65 minutos; o número total de experimentos ainda não é informado.](recursos/MFC6-B1-I-ON-11.svg)

**Descrição do recurso visual:** Sequência de experimentos de 12 minutos separados por limpezas de três minutos. Há três pontos indicando continuação, uma limpeza antes do último experimento e nenhuma depois dele. O período disponível é 65 minutos; o número total de experimentos ainda não é informado.

- **A)** 5.
- **B)** 3.
- **C)** 4.
- **D)** 6.

**Gabarito: C.** As limpezas acontecem somente entre experimentos: quatro experimentos precisam de três limpezas. Eles ocupam 4 × 12 + 3 × 3 = 48 + 9 = 57 minutos e cabem no período de 65 minutos. Cinco experimentos precisariam de quatro limpezas: 5 × 12 + 4 × 3 = 60 + 12 = 72 minutos, acima do disponível. Portanto, cabem no máximo quatro experimentos completos.

**Distratores:**

- A: Ignorar limpezas.
- B: Subestimar a capacidade e parar em três experimentos, sem conferir que um quarto ainda cabe.
- D: Ignorar as limpezas e arredondar 65 ÷ 12 para cima, embora seis experimentos nem caibam no tempo disponível.

### MFC6-B1-I-ON-14 — Excluindo cópias e preservando originais

**Dificuldade:** facil. **Habilidade:** Distinguir originais, cópias e total em grupos.

Uma pasta tem 8 arquivos originais. Cada um foi copiado duas vezes, além do original. Apagar apenas todas as cópias deixa quantos arquivos? Escolha a alternativa que responde à situação.

- **A)** 16.
- **B)** 8.
- **C)** 24.
- **D)** 0.

**Gabarito: B.** Cada original gera duas cópias, mas continua existindo. Apagar as 16 cópias deixa os oito originais. Não se apagam todos os 24 arquivos.

**Distratores:**

- A: Responder a quantidade apagada.
- C: Ignorar a exclusão.
- D: Apagar os originais junto das cópias.

### MFC6-B1-I-ON-19 — Comparação sem calcular os produtos inteiros

**Dificuldade:** dificil. **Habilidade:** Comparar produtos e argumentar sobre compensação entre fatores.

Uma escola precisa escolher entre a oferta A, com 49 caixas de 20 folhas cada, e a oferta B, com 50 caixas de 19 folhas cada. Qual oferta tem mais folhas e por quantas? Escolha a alternativa que responde à situação.

- **A)** B, com 30 a mais.
- **B)** Empate.
- **C)** A, com 30 folhas a mais.
- **D)** A, com 1 a mais.

**Gabarito: C.** Podemos comparar por compensação, usando a mesma referência: 50 caixas com 20 folhas cada. A oferta A tem uma caixa de 20 folhas a menos que essa referência, portanto retira 20 folhas. A oferta B tem uma folha a menos em cada uma das 50 caixas, portanto retira 50 folhas. Como a oferta A retira 30 folhas a menos (50 − 20 = 30), ela fornece 30 folhas a mais que B, sem precisar calcular os dois produtos completos. Como conferência, A fornece 49 × 20 = 980 folhas e B fornece 50 × 19 = 950 folhas; a diferença também é 30.

**Distratores:**

- A: Escolher só a quantidade de caixas.
- B: Supor que alterações opostas nos fatores se compensam sempre.
- D: Comparar apenas a diferença de um fator.

