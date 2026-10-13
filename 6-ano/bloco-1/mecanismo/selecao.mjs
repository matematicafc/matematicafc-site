import { ASSUNTOS } from './regras.mjs';
import { indice, embaralhar } from './aleatorio.mjs';
import { normalizarHistorico } from './historico.mjs';
function chave(questoes) { return questoes.map(q => q.id).sort().join('|'); }
function escolher(conjuntos, contagens, rng) {
  if (!Object.keys(contagens).length) return conjuntos[indice(conjuntos.length, rng)];
  let melhor = [], maxNovas = -1, minUso = Infinity;
  for (const conjunto of conjuntos) {
    const novas = conjunto.filter(q => !contagens[q.id]).length;
    const uso = conjunto.reduce((s, q) => s + (contagens[q.id] || 0), 0);
    if (novas > maxNovas || (novas === maxNovas && uso < minUso)) {
      melhor = [conjunto]; maxNovas = novas; minUso = uso;
    } else if (novas === maxNovas && uso === minUso) melhor.push(conjunto);
  }
  return melhor[indice(melhor.length, rng)];
}
export function selecionar(banco, rng, historico = {}, anterior = []) {
  const contagens = normalizarHistorico(historico);
  let questoes = ASSUNTOS.flatMap(c => escolher(banco.conjuntos[c], contagens, rng));
  // Garante outro conjunto completo na próxima aplicação do mesmo mecanismo.
  if (anterior.length && chave(questoes) === [...anterior].sort().join('|')) {
    const c = ASSUNTOS[0], anteriorAssunto = chave(questoes.filter(q => q.assunto === c));
    const outros = banco.conjuntos[c].filter(s => chave(s) !== anteriorAssunto);
    questoes = [...escolher(outros, contagens, rng), ...questoes.filter(q => q.assunto !== c)];
  }
  if (questoes.length !== 30 || new Set(questoes.map(q => q.id)).size !== 30) throw new Error('Seleção inconsistente.');
  return embaralhar(questoes, rng);
}
