# Critérios de qualidade

Usar esta lista na revisão de cada recurso futuro. Registrar resultados e
pendências no README do recurso; nesta etapa nenhuma dessas verificações de
aplicação foi executada.

## Pedagogia

- [ ] Público, objetivo de aprendizagem e pré-requisitos estão claros.
- [ ] Enunciados, dados, unidades e ilustrações são coerentes e escritos em português do Brasil.
- [ ] Respostas e cálculos foram revisados; explicações apresentam o raciocínio, não apenas o resultado.
- [ ] Questões são originais; fontes de inspiração e direitos de imagens estão registrados.
- [ ] Erros recebem feedback respeitoso, com orientação para aprender.
- [ ] Nos simulados, as questões são inéditas, contextualizadas e bem elaboradas, têm quatro alternativas, uma única correta e resolução comentada.
- [ ] Pelo menos 50% das questões de cada tentativa têm recursos visuais pedagogicamente relevantes; em 30 questões, o mínimo é 15. Elementos decorativos não entram na contagem.

## Funcionalidade

- [ ] Respostas corretas, incorretas e ausentes têm comportamento definido e verificado.
- [ ] Nos simulados, navegar preserva respostas; a finalização trata questões não respondidas e apresenta gabarito comentado.
- [ ] Reiniciar limpa o estado conforme documentado, sem resultados antigos.
- [ ] Fórmulas e valores em reais são exibidos corretamente quando houver MathJax.
- [ ] Não há erros JavaScript no console durante os fluxos principais.

## Boletim e privacidade dos simulados

Aplicar as [regras dos simulados](simulados.md) na futura implementação:

- [ ] O nome é opcional, serve somente à personalização do boletim e pode ser deixado vazio sem bloquear o fluxo.
- [ ] Não há cadastro obrigatório nem solicitação de e-mail ou telefone.
- [ ] O boletim final apresenta nome quando informado, identificação do simulado, acertos, percentual, desempenho por assunto e recomendações de estudo.
- [ ] Nome e resultados são processados localmente, sem envio ou armazenamento em servidores, inclusive analytics e logs externos.
- [ ] O PDF é gerado localmente; nenhum serviço externo recebe dados pessoais para produzi-lo.
- [ ] Download e compartilhamento, inclusive pelo WhatsApp, são iniciados pelo estudante; não há envio automático nem hospedagem do boletim.
- [ ] Há alternativa de download e encaminhamento manual quando o compartilhamento de arquivos não é suportado.
- [ ] O boletim é legível no celular, no PDF e na impressão, sem cortes de tabelas ou dependência exclusiva de cores.

## Acessibilidade e responsividade

- [ ] A página usa `lang="pt-BR"`, títulos em ordem e controles HTML semânticos com rótulos.
- [ ] Todas as ações funcionam pelo teclado; o foco é visível e segue uma ordem compreensível.
- [ ] Mensagens de correção são perceptíveis por leitores de tela, sem depender apenas de cor.
- [ ] Texto e controles têm contraste adequado; imagens têm texto alternativo e gráficos têm descrição ou dados equivalentes.
- [ ] A interface permanece utilizável com zoom de 200% e em telas estreitas, tablets e computadores.
- [ ] Controles de toque têm tamanho e espaçamento adequados; animações respeitam preferência por movimento reduzido.
- [ ] Foram registrados os navegadores, tamanhos de tela e tecnologias assistivas usados na revisão.

## Desempenho e Blogger

- [ ] Imagens estão dimensionadas e otimizadas; dependências têm justificativa.
- [ ] O carregamento em conexão limitada foi avaliado e não bloqueia desnecessariamente a leitura.
- [ ] Estilos e scripts não afetam outros elementos nem outras instâncias do recurso.
- [ ] URLs externas usam HTTPS e estão documentadas.
- [ ] A integração foi conferida em rascunho autorizado no Blogger antes da publicação manual.
