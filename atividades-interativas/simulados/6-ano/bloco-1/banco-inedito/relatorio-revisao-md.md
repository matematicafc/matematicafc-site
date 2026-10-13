# Revisão pedagógica — Múltiplos e Divisores

## Resultado e escopo

**20 questões revalidadas, 12 com recursos visuais relevantes e nenhum impedimento matemático identificado.** Todas mantêm quatro alternativas A–D, uma única correta, resolução comentada, assunto, habilidade e dificuldade. Nenhuma questão foi excluída ou dividida. A apreciação pedagógica final do material atualizado continua disponível para o usuário; a validação não equivale a aprovação humana.

Foram modificados 14 registros: MD-01 a MD-12, MD-18 e MD-20. MD-13 a MD-17 e MD-19 permanecem idênticos. Todos os identificadores, dados, habilidades, níveis de dificuldade, gabaritos e modelos matemáticos foram preservados. As alternativas foram preservadas, exceto o distrator A de MD-20, cuja mudança foi solicitada.

## Correções específicas

- MD-02: título “Caixas e recombinação dos agrupamentos”, coerente com a situação apresentada.
- MD-03: devolução de todos os objetos de cada professor em pacotes completos de seis, sem avulsos nem sobras; limite de sete pacotes de cada professor nesta viagem.
- MD-06: plantas junto às estacas correspondentes, avanço de dois espaços e inclusão de planta nos dois extremos. O recurso distingue pontos e intervalos.
- MD-07: A aparece inicialmente no minuto zero; B, no minuto três. Resolução apresenta A: 0, 6, 12, 18, 24, ... e B: 3, 12, 21, 30, ... . O primeiro instante comum permanece 12.
- MD-09: resolução sem raiz quadrada. Se ambas as dimensões fossem pelo menos sete, seriam necessárias 49 peças. Uma dimensão deve ser de dois a seis; as divisões de 37 por esses números deixam sobras. Só os arranjos 1 × 37 e 37 × 1 usam tudo, mas não atendem à condição.
- MD-18: todas as peças serão reorganizadas após acrescentar a quantidade mínima necessária, sem obrigação de preservar um retângulo inicial.
- MD-20: distrator A passa a “6 e 7.”, com valor semântico `[6, 7]`. Explora a composição 2 × 3 = 6 confundida com tamanho primo. A justificativa e a resolução explicitam que seis e nove são compostos. A alternativa D continua sendo a única correta.

Os enunciados de MD-01 a MD-12 passaram a referenciar os esquemas, em lugar das tabelas retiradas, sem mudança dos objetivos matemáticos.

## Revisão individual dos recursos visuais

| Questão | Representação atualizada | Contribuição para a resolução |
| --- | --- | --- |
| MD-01 | Reta proporcional com saltos de sete e alvo 45 | Relaciona pontos alcançáveis e posição final, apoiando a interpretação do resto. |
| MD-02 | Caixas com unidades em grupos de seis e sobras | Permite recombinar as sobras sem desfazer grupos completos. |
| MD-03 | Modelo de pacote e sete espaços de transporte | Explicita simultaneamente composição do pacote, limite por professor e quantidades a devolver. |
| MD-04 | Fluxo lote → reserva → carrinhos de quatro rodas | Mostra que a reserva antecede o teste de agrupamento; não fornece os restos calculados. |
| MD-05 | Conjuntos de amostras e composição de kit a determinar | Permite relacionar repartição das duas quantidades a uma composição comum. |
| MD-06 | Estacas igualmente espaçadas e plantios junto aos pontos | Preserva e aprimora a ideia do SVG anterior, diferenciando estacas e espaços e incluindo os extremos. |
| MD-07 | Linhas do tempo na mesma escala | Mostra os inícios deslocados e os instantes de cada sinal, incluindo o zero de A. |
| MD-08 | Fitas proporcionais alinhadas e modelo de corte desconhecido | Permite comparar comprimentos e planejar cortes iguais, sem antecipar o MDC. |
| MD-09 | Estoque de 37 unidades reorganizáveis | Apoia testes de agrupamento; não representa um painel pronto nem exige manter a disposição inicial. |
| MD-10 | Modelos de grupos de oito e doze com limite aberto na reta | Relaciona dois formatos exatos à exigência de total estritamente maior que 50. |
| MD-11 | Quadro de páginas com duas formas de marcação | Torna visíveis as interseções sem fornecer a contagem final. |
| MD-12 | Calendário contínuo com inspeções assinaladas | Cruza o ciclo de quatro dias com a semana de sete, sem reinício semanal. |

As 12 tabelas foram substituídas por 12 SVG matemáticos. Foram criados 11 arquivos SVG e atualizado o SVG preexistente de MD-06, preservando a ideia das estacas. Uma questão conta uma única vez: permanecem **12 visuais**, sendo três fáceis, cinco médias e quatro difíceis. MD-13 a MD-20 continuam sem recurso visual.

Todos os esquemas têm `viewBox`, CSS de largura fluida e altura proporcional, título e descrição acessível. Dados e relações matemáticas podem ser lidos em texto. Em MD-11, as marcações são diferenciadas por formas e legenda, sem depender apenas de cor. Não há imagens externas, scripts ou recursos decorativos classificados como apoio visual.

Os 12 SVG foram renderizados com CairoSVG e inspecionados a 320 pixels de largura. Essa inspeção verifica o material estático; integração e acessibilidade no futuro componente serão avaliadas quando houver interface.

## Validação matemática

| Questão | Resultado conferido | Gabarito |
| --- | --- | --- |
| MD-01 | 45 = 7 × 6 + 3; alvo não alcançado | A |
| MD-02 | Sobras 4 e 2 completam outro grupo; cinco grupos no total | B |
| MD-03 | Nara: 42 ÷ 6 = 7; Ivo exige oito pacotes | C |
| MD-04 | 46 − 2 = 44, divisível por quatro | D |
| MD-05 | MDC(24, 36) = 12; duas amostras A e três B por kit | A |
| MD-06 | Nove intervalos de plantio e uma planta inicial: dez | B |
| MD-07 | Primeiro instante comum: minuto 12 | C |
| MD-08 | MDC(54, 72) = 18 cm | D |
| MD-09 | 37 não admite retângulo com ambas as dimensões maiores que um | A |
| MD-10 | Múltiplos de 24; primeiro acima de 50: 72 | B |
| MD-11 | 6 + 4 − 2 = 8 páginas distintas | C |
| MD-12 | MMC(4, 7) = 28 dias | D |
| MD-13 | 15 × 8 = 120, divisível por quatro | A |
| MD-14 | Entre consecutivos sempre há um par; produto não pode ser ímpar | B |
| MD-15 | Sobras 1 + 1 formam um par | C |
| MD-16 | 8.000 ÷ 8 + 136 ÷ 8 = 1.017 caixas | D |
| MD-17 | Posição 26: segunda posição do sétimo bloco, verde | A |
| MD-18 | 49 − 48 = 1 peça; reorganização em 7 × 7 | B |
| MD-19 | Restos zero e um módulo quatro impedem coincidência | C |
| MD-20 | Total 126; divisores primos distintos 2, 3 e 7 | D |

As alternativas e resoluções das 20 questões foram relidas. O validador calcula os modelos a partir dos dados, sem consultar as letras dos gabaritos, e confirma quatro alternativas distintas, uma única correta e três distratores justificados. Os SVG são conferidos por dados, contagens, agrupamentos, proporções, posições, ciclos e marcações, além da correspondência entre arquivo e conteúdo do JSON.

O validador completo passou nas 100 questões: 100 validadas e 60 visuais, com 12 em cada assunto. A execução nos outros assuntos foi somente leitura. Os requisitos do futuro sorteio permanecem documentados: 30 itens, seis por assunto e pelo menos 15 com apoio visual.

## Preservação e arquivos atualizados

Foram atualizados `multiplos-divisores.json`, os 12 SVG de MD, somente a seção de MD em `revisao-pedagogica.md`, o validador de apoio, `resultado-validacao.json`, `README.md` e `relatorio-validacao.md`. Este `relatorio-revisao-md.md` foi criado.

Comparação por SHA-256 confirma a preservação dos outros quatro bancos inéditos, dos bancos anteriores, dos recursos de outros assuntos e dos relatórios específicos de SN e ON. No caderno compartilhado, o conteúdo anterior e posterior à seção de MD foi comparado literalmente e permanece idêntico.

Nenhuma interface ou rotina de sorteio foi implementada. Blogger e outros repositórios não foram alterados.

## Versões completas das sete questões corrigidas

### MFC6-B1-I-MD-02 — Caixas e recombinação dos agrupamentos

**Dificuldade:** facil. **Habilidade:** Recombinar restos de dois agrupamentos para verificar divisibilidade do total.

Duas caixas foram embaladas separadamente em grupos de seis objetos. As sobras podem ser reunidas sem alterar os grupos completos. Observe o esquema das caixas e dos agrupamentos. Ao reunir as duas caixas, será possível embalar tudo em grupos de seis?

![Diagrama: Caixa A com 16 objetos: dois grupos completos de seis e quatro objetos no último agrupamento. Caixa B com 14 objetos: dois grupos completos de seis e dois no último agrupamento. Cada objeto aparece uma vez; a recombinação e o total final não estão desenhados.](recursos/MFC6-B1-I-MD-02.svg)

**Descrição do recurso visual:** Caixa A com 16 objetos: dois grupos completos de seis e quatro objetos no último agrupamento. Caixa B com 14 objetos: dois grupos completos de seis e dois no último agrupamento. Cada objeto aparece uma vez; a recombinação e o total final não estão desenhados.

- **A)** Não; só os quatro grupos já completos podem ser usados.
- **B)** Sim, formam cinco grupos completos.
- **C)** Sim, formam seis grupos completos.
- **D)** Não; só há dois grupos completos no total.

**Gabarito: B.** A primeira caixa deixa quatro objetos e a segunda deixa dois. As sobras juntas formam outro grupo de seis. O total é 30, suficiente para cinco grupos sem sobra; não é necessário que cada caixa individual seja múltipla de seis.

**Distratores:**

- A: Ignorar a recombinação das duas sobras.
- C: Confundir tamanho do grupo com número de grupos.
- D: Considerar somente uma caixa.

### MFC6-B1-I-MD-03 — Mesmo total, pacotes diferentes

**Dificuldade:** media. **Habilidade:** Combinar agrupamento exato e capacidade máxima de transporte.

Uma editora aceita a devolução de todos os objetos de cada professor somente em pacotes completos de seis objetos, sem objetos avulsos nem sobras. Nesta viagem, a transportadora pode levar no máximo sete pacotes de cada professor. Observe as quantidades e o esquema das regras. Qual professor consegue devolver todos os seus objetos sem ultrapassar esse limite?

![Diagrama: Um pacote tem seis objetos em duas linhas de três. Sete espaços numerados representam o limite de pacotes por professor. Abaixo, Lia tem 26 objetos, Rui 34, Nara 42 e Ivo 48 para devolver. Não estão calculados os pacotes de cada professor.](recursos/MFC6-B1-I-MD-03.svg)

**Descrição do recurso visual:** Um pacote tem seis objetos em duas linhas de três. Sete espaços numerados representam o limite de pacotes por professor. Abaixo, Lia tem 26 objetos, Rui 34, Nara 42 e Ivo 48 para devolver. Não estão calculados os pacotes de cada professor.

- **A)** Lia.
- **B)** Rui.
- **C)** Nara.
- **D)** Ivo.

**Gabarito: C.** Nara devolve 42 objetos, formando sete pacotes, exatamente o limite. Ivo formaria oito pacotes e ultrapassaria o limite. Lia e Rui deixam restos, portanto seus pacotes não ficam completos.

**Distratores:**

- A: Aceitar qualquer número par.
- B: Truncar o quociente de 34 ÷ 6 e ignorar quatro objetos.
- D: Verificar divisibilidade de 48 por seis, mas ignorar o limite de sete pacotes.

### MFC6-B1-I-MD-06 — Uma planta entre estacas

**Dificuldade:** media. **Habilidade:** Distinguir intervalos de pontos em uma sequência de múltiplos.

Uma borda de jardim tem estacas igualmente espaçadas. As plantas serão colocadas junto às estacas correspondentes, começando na primeira estaca e avançando dois espaços entre estacas a cada plantio. Observe o esquema. Quantas plantas ficam da primeira até a última estaca, incluindo uma planta em cada extremo?

![Diagrama: Dezenove estacas marcam dezoito espaços iguais em uma linha. Os plantios iniciais aparecem junto às estacas 0 e 2, com arco de dois espaços; o plantio no extremo final aparece junto à estaca 18. Os plantios intermediários ficam a determinar seguindo o mesmo avanço. Os dois extremos são incluídos.](recursos/MFC6-B1-I-MD-06.svg)

**Descrição do recurso visual:** Dezenove estacas marcam dezoito espaços iguais em uma linha. Os plantios iniciais aparecem junto às estacas 0 e 2, com arco de dois espaços; o plantio no extremo final aparece junto à estaca 18. Os plantios intermediários ficam a determinar seguindo o mesmo avanço. Os dois extremos são incluídos.

- **A)** 9 plantas.
- **B)** 10 plantas.
- **C)** 18 plantas.
- **D)** 19 plantas.

**Gabarito: B.** Dezoito espaços correspondem a nove intervalos de plantio. Contando a planta inicial, são dez plantas nas posições 0,2,4,...,18.

**Distratores:**

- A: Omitir o ponto inicial.
- C: Plantar em todo espaço.
- D: Plantar em todas as estacas, não a cada dois espaços.

### MFC6-B1-I-MD-07 — Sinal que começou depois

**Dificuldade:** media. **Habilidade:** Interpretar ciclos com instantes iniciais diferentes.

O sinal luminoso A aparece inicialmente no minuto zero e depois volta a aparecer a cada seis minutos. O sinal B aparece inicialmente no minuto três e depois volta a aparecer a cada nove minutos. Observe as linhas do tempo. Em qual minuto eles aparecem juntos pela primeira vez?

![Diagrama: Duas linhas do tempo com a mesma escala de zero a 24 minutos. A aparece nos minutos 0, 6, 12, 18 e 24; B aparece nos minutos 3, 12 e 21. São indicados os inícios zero e três e os intervalos seis e nove. Nenhum encontro está nomeado ou destacado.](recursos/MFC6-B1-I-MD-07.svg)

**Descrição do recurso visual:** Duas linhas do tempo com a mesma escala de zero a 24 minutos. A aparece nos minutos 0, 6, 12, 18 e 24; B aparece nos minutos 3, 12 e 21. São indicados os inícios zero e três e os intervalos seis e nove. Nenhum encontro está nomeado ou destacado.

- **A)** 18 minutos.
- **B)** 9 minutos.
- **C)** 12 minutos.
- **D)** 6 minutos.

**Gabarito: C.** A aparece nos minutos 0, 6, 12, 18, 24, ...; B aparece nos minutos 3, 12, 21, 30, ... . O primeiro instante comum é o minuto 12. Calcular MMC(6, 9) = 18 sem considerar os instantes iniciais ignoraria que B começou três minutos depois de A.

**Distratores:**

- A: Usar MMC sem considerar o deslocamento inicial.
- B: Somar início de B a um intervalo de A.
- D: Verificar apenas o primeiro sinal.

### MFC6-B1-I-MD-09 — Cartaz retangular com linhas limitadas

**Dificuldade:** dificil. **Habilidade:** Relacionar primalidade à impossibilidade de arranjo retangular não trivial.

Um painel será montado com todas as peças, em um retângulo com pelo menos duas linhas e duas colunas. Observe as peças disponíveis no esquema; elas podem ser reorganizadas para montar o painel. Qual conclusão é correta para a quantidade dada?

![Diagrama: Trinta e sete peças individuais disponíveis, desenhadas em cinco linhas de sete e uma linha de duas apenas para contagem do estoque. Elas devem ser reorganizadas em um retângulo com pelo menos duas linhas e duas colunas, usando todas sem sobra. O estoque não representa um painel pronto.](recursos/MFC6-B1-I-MD-09.svg)

**Descrição do recurso visual:** Trinta e sete peças individuais disponíveis, desenhadas em cinco linhas de sete e uma linha de duas apenas para contagem do estoque. Elas devem ser reorganizadas em um retângulo com pelo menos duas linhas e duas colunas, usando todas sem sobra. O estoque não representa um painel pronto.

- **A)** Não é possível; não há divisor que produza duas dimensões maiores que 1.
- **B)** É possível usar 3 linhas de 12 peças.
- **C)** É possível usar 4 linhas de 9 peças.
- **D)** É possível usar 2 linhas, pois todo ímpar é divisível por 2.

**Gabarito: A.** Para usar todas as 37 peças, o número de linhas deve dividir 37 sem sobra. Se houvesse pelo menos sete linhas e sete colunas, seriam necessárias pelo menos 7 × 7 = 49 peças. Assim, em qualquer retângulo permitido, uma das dimensões teria de ser 2, 3, 4, 5 ou 6. Ao agrupar 37 peças nessas quantidades, há sobra: 37 = 2 × 18 + 1; 37 = 3 × 12 + 1; 37 = 4 × 9 + 1; 37 = 5 × 7 + 2; 37 = 6 × 6 + 1. Portanto, nenhum desses agrupamentos usa todas as peças. Só são possíveis 1 × 37 e 37 × 1, que não atendem à exigência de pelo menos duas linhas e duas colunas.

**Distratores:**

- B: Aceitar uma peça sobrando.
- C: Aceitar uma peça sobrando.
- D: Confundir ímpar e par.

### MFC6-B1-I-MD-18 — Peças para um quadrado

**Dificuldade:** media. **Habilidade:** Comparar o total com produtos quadrados vizinhos.

Uma oficina tem 48 peças. Depois de acrescentar a quantidade mínima necessária, todas as peças serão reorganizadas para formar um quadrado com o mesmo número inteiro de linhas e de colunas, sem sobras. Quantas peças precisa acrescentar? Escolha a alternativa que responde à situação.

- **A)** 12 peças.
- **B)** 1 peça.
- **C)** 16 peças.
- **D)** 0 peça.

**Gabarito: B.** O quadrado imediatamente maior tem 7×7=49 peças; basta acrescentar uma. Seis por seis usa só 36, deixando sobras, e não atende ao uso de todas.

**Distratores:**

- A: Usar a diferença para o quadrado anterior.
- C: Pular o quadrado de 49 e ir para 64.
- D: Confundir retângulo com quadrado.

### MFC6-B1-I-MD-20 — Bandejas de tamanho primo

**Dificuldade:** dificil. **Habilidade:** Identificar todos os divisores primos de um produto e aplicar restrição material de tamanho.

Uma oficina recebeu uma remessa cujo total de peças está descrito por 2 × 3 × 3 × 7. Ela só pode comprar bandejas com uma quantidade prima de lugares e quer distribuir todas as peças em bandejas iguais, sem sobra. Qual conjunto lista todos os tamanhos de bandeja possíveis?

- **A)** 6 e 7.
- **B)** 2, 3, 7 e 9.
- **C)** 2 e 7.
- **D)** 2, 3 e 7.

**Gabarito: D.** Os fatores primos distintos do total são 2, 3 e 7. Cada um divide o produto 2 × 3 × 3 × 7, permitindo bandejas completas. O fator 3 repetido não representa um novo tamanho. Seis e nove dividem o total, mas são compostos: 6 = 2 × 3 e 9 = 3 × 3. Portanto, não atendem à regra de tamanho primo.

**Distratores:**

- A: Agrupar os fatores 2 e 3 em 6 e tratá-lo como tamanho primo, embora 6 seja composto, omitindo também os tamanhos primos 2 e 3.
- B: Aceitar divisor composto, apesar da exigência de tamanho primo.
- C: Omitir o primo que aparece duas vezes na fatoração.

