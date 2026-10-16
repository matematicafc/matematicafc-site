import { ASSUNTOS, NIVEIS, COTAS, CONFIGURACAO } from './regras.mjs';
import { embaralhar } from './aleatorio.mjs';
import { combinacoes } from './banco.mjs';
import { normalizarHistorico, normalizarPar } from './historico.mjs';

export function proximoParOito(anterior, rng) {
  const par = normalizarPar(anterior);
  return par.length ? ASSUNTOS.filter(c => !par.includes(c)) : embaralhar(ASSUNTOS, rng).slice(0, 2);
}
function escolherPonderado(itens, rng) {
  const valor = rng();
  if (!Number.isFinite(valor) || valor < 0 || valor >= 1) throw new Error('Fonte aleatória deve retornar um número em [0, 1).');
  const total = itens.reduce((s, i) => s + i.peso, 0);
  if (!(total > 0 && Number.isFinite(total))) throw new Error('Não há seleção viável.');
  let alvo = valor * total;
  for (const i of itens) { alvo -= i.peso; if (alvo < 0) return i; }
  return itens.at(-1); // Arredondamento de ponto flutuante na fronteira da soma.
}
// Compara prioridades: mais inéditas primeiro, depois menor soma de utilizações.
function comparar(a, b) { return a.novas - b.novas || b.uso - a.uso; }
function mesmaPrioridade(a, b) { return a.novas === b.novas && a.uso === b.uso; }
function avaliar(perfil, baldes, contagens) {
  let novas = 0, uso = 0, peso = 1;
  for (const f of perfil.fatias) {
    if (!f.n) continue;
    const numeros = baldes[f.nivel][f.tipo].map(q => contagens[q.id] || 0).sort((a, b) => a - b);
    const limite = numeros[f.n - 1], antes = numeros.filter(n => n < limite).length;
    peso *= combinacoes(numeros.filter(n => n === limite).length, f.n - antes);
    for (const n of numeros.slice(0, f.n)) { novas += Number(n === 0); uso += n; }
  }
  return { ...perfil, novas, uso, peso };
}
function somar(a, b) { return { novas: a.novas + b.novas, uso: a.uso + b.uso, peso: a.peso * b.peso }; }

export function selecionar(banco, rng, historico = {}, parOito) {
  const par = normalizarPar(parOito);
  if (!par.length) throw new Error('Informe exatamente dois assuntos para receber oito questões.');
  const contagens = normalizarHistorico(historico);
  const opcoes = ASSUNTOS.map(c => banco.preparados[c].perfis[par.includes(c) ? 8 : 7].map(p => avaliar(p, banco.preparados[c].baldes, contagens)));
  // Programação dinâmica por total visual. Não enumera milhões de subconjuntos de questões.
  // Guarda apenas as melhores prioridades do histórico para cada total, sem relaxar cotas.
  const dp = Array.from({ length: 5 }, () => new Map());
  dp[4].set(0, { novas: 0, uso: 0, peso: 1 });
  for (let i = 3; i >= 0; i--) for (const p of opcoes[i]) for (const [v, resto] of dp[i + 1]) {
    const total = v + p.visuais, candidato = somar(p, resto), atual = dp[i].get(total);
    if (!atual || comparar(candidato, atual) > 0) dp[i].set(total, candidato);
    else if (mesmaPrioridade(candidato, atual)) atual.peso += candidato.peso;
  }
  let finais = [...dp[0]].filter(([v]) => v >= CONFIGURACAO.minimoVisualTotal).map(([visuais, p]) => ({ visuais, ...p }));
  if (!finais.length) throw new Error('Cotas visuais inviáveis; nenhuma regra será relaxada.');
  const melhor = finais.reduce((a, b) => comparar(a, b) >= 0 ? a : b);
  finais = finais.filter(p => mesmaPrioridade(p, melhor));
  let restantes = escolherPonderado(finais, rng).visuais;
  const selecionadas = [];
  for (let i = 0; i < 4; i++) {
    const alvo = dp[i].get(restantes);
    const escolhas = opcoes[i].flatMap(p => {
      const resto = dp[i + 1].get(restantes - p.visuais);
      return resto && mesmaPrioridade(somar(p, resto), alvo) ? [{ perfil: p, peso: p.peso * resto.peso }] : [];
    });
    const p = escolherPonderado(escolhas, rng).perfil;
    for (const f of p.fatias) {
      if (!f.n) continue;
      const itens = banco.preparados[ASSUNTOS[i]].baldes[f.nivel][f.tipo];
      // Embaralha empates antes da ordenação estável pelo menor uso.
      selecionadas.push(...embaralhar(itens, rng).sort((a, b) => (contagens[a.id] || 0) - (contagens[b.id] || 0)).slice(0, f.n));
    }
    restantes -= p.visuais;
  }
  conferirSelecao(selecionadas, par);
  return embaralhar(selecionadas, rng);
}
export function conferirSelecao(questoes, parOito) {
  if (questoes.length !== CONFIGURACAO.total || new Set(questoes.map(q => q.id)).size !== CONFIGURACAO.total || questoes.filter(q => q.sorteio.visual_relevante).length < CONFIGURACAO.minimoVisualTotal) throw new Error('Seleção inconsistente.');
  for (const c of ASSUNTOS) {
    const sub = questoes.filter(q => q.assunto === c), n = parOito.includes(c) ? 8 : 7;
    if (sub.length !== n || sub.filter(q => q.sorteio.visual_relevante).length < CONFIGURACAO.minimoVisualAssunto || NIVEIS.some((nivel, i) => sub.filter(q => q.dificuldade.nivel === nivel).length !== COTAS[n][i])) throw new Error('Cotas por assunto inconsistentes.');
  }
}
