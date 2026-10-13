export function calcularResultados(questoes, correcao) {
  if (questoes.length !== correcao.length || new Set(correcao.map(c => c.questaoId)).size !== questoes.length) throw new Error('Correção incompleta.');
  const porId = new Map(correcao.map(c => [c.questaoId, c]));
  const assuntos = new Map();
  let acertos = 0, respondidas = 0;
  for (const q of questoes) {
    const c = porId.get(q.id);
    if (!c || !q.alternativas.some(o => o.id === c.opcaoCorretaId) || (c.respostaId !== null && !q.alternativas.some(o => o.id === c.respostaId))) throw new Error('Correção incompatível com a aplicação.');
    const certo = c.respostaId === c.opcaoCorretaId;
    acertos += Number(certo); respondidas += Number(c.respostaId !== null);
    if (!assuntos.has(q.assunto)) assuntos.set(q.assunto, { codigo: q.assunto, nome: q.assuntoNome, acertos: 0, total: 0 });
    const a = assuntos.get(q.assunto); a.total++; a.acertos += Number(certo);
  }
  return { acertos, erros: respondidas - acertos, total: questoes.length, respondidas, semResposta: questoes.length - respondidas,
    percentual: acertos / questoes.length * 100,
    assuntos: ['SN', 'ON', 'MD', 'FR', 'ND'].filter(c => assuntos.has(c)).map(c => { const a = assuntos.get(c); return { ...a, percentual: a.acertos / a.total * 100 }; }) };
}
export function formatarPercentual(valor) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(valor) + '%';
}
