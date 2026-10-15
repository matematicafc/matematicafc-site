const assuntos = [
  ['DP','Divisibilidade, números primos, MMC e MDC','divisibilidade-primos-mmc-mdc.json',[1,3,2],'Retome os critérios de divisibilidade e compare situações de agrupamento e periodicidade.'],
  ['NI','Números inteiros: representação, comparação e ordenação','inteiros-representacao.json',[2,3,1],'Retome a referência zero, os opostos, o módulo e a ordenação na reta numérica.'],
  ['OI','Operações com números inteiros','operacoes-inteiros.json',[1,3,2],'Revise as operações inversas, a regra dos sinais e a prioridade das operações.'],
  ['FR','Frações: significados, equivalência e comparação','fracoes.json',[2,3,1],'Identifique o inteiro de referência e compare frações por partes de mesmo tamanho.'],
  ['NR','Números racionais: representações fracionária e decimal','racionais-representacoes.json',[2,2,2],'Compare as representações com valores exatos e confira unidades e casas decimais.'],
].map(([codigo,nome,arquivo,cotas,recomendacao]) => Object.freeze({codigo,nome,arquivo,cotas:Object.freeze(cotas),recomendacao}));
export const CONFIGURACAO = Object.freeze({
  estado:'revisao_pedagogica', bancoId:'MFC7-B1-INEDITO-V1', prefixoId:'MFC7-B1-I', ano:7, bloco:1,
  titulo:'Bloco 1 — Números e Operações', identificacao:'7º ano, Bloco 1 — Números e Operações',
  arquivoPDF:'boletim-matematicafc-7ano-bloco1.pdf', total:30, porAssunto:6, minimoVisualAssunto:3,
  assuntos:Object.freeze(assuntos), niveis:Object.freeze(['facil','media','dificil']),
  rotulosNiveis:Object.freeze({facil:'Básico',media:'Intermediário',dificil:'Desafiador'}),
});
