// Estrutura técnica. A liberação exige banco definitivo completo e aprovação posterior.
const assuntos = [
  ['EA', 'Estimativas e aproximações', 'estimativas-aproximacoes.json'],
  ['IP', 'Igualdade e partilha', 'igualdade-partilha.json'],
  ['PC', 'Plano cartesiano', 'plano-cartesiano.json'],
  ['AR', 'Ampliação e redução de figuras', 'ampliacao-reducao.json'],
].map(([codigo, nome, arquivo]) => Object.freeze({ codigo, nome, arquivo, quantidadeBanco: 25, recomendacao: { EA: 'Retome os arredondamentos e compare estimativas com valores de referência.', IP: 'Revise o equilíbrio da igualdade e as relações usadas nas partilhas.', PC: 'Retome a origem, a ordem das coordenadas e os deslocamentos na malha.', AR: 'Compare lados correspondentes e confira se todas as medidas usam o mesmo fator.' }[codigo] }));
export const CONFIGURACAO = Object.freeze({
  estado: 'publicado', publicacaoAutorizada: true,
  bancoId: 'MFC6-B2-INEDITO-V1', prefixoId: 'MFC6-B2-I', ano: 6, bloco: 2,
  titulo: 'Bloco 2 — Pensamento algébrico e geometria',
  identificacao: '6º ano, Bloco 2 — Pensamento algébrico e geometria',
  arquivoPDF: 'boletim-matematicafc-6ano-bloco2.pdf', total: 30,
  assuntos: Object.freeze(assuntos), niveis: Object.freeze(['facil', 'media', 'dificil']),
  // Referência técnica herdada do Bloco 1; confirmar a viabilidade no banco definitivo.
  cotas: Object.freeze({ 7: Object.freeze([2, 3, 2]), 8: Object.freeze([2, 4, 2]) }),
  dificuldadeTotal: Object.freeze([8, 14, 8]), minimoVisualAssunto: 3, minimoVisualTotal: 15,
});
