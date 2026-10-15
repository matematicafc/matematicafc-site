import { BANCO_ID, PREFIXO_ID, ARQUIVOS, ASSUNTOS, NIVEIS, COTAS, congelar, copiar } from './regras.mjs';

export async function carregarBanco(baseURL, buscar = globalThis.fetch) {
  if (typeof buscar !== 'function') throw new Error('Forneça uma função de leitura dos JSON.');
  const base = String(baseURL).replace(/\/?$/, '/');
  return Promise.all(ARQUIVOS.map(async arquivo => {
    const resposta = await buscar(base + arquivo);
    if (!resposta.ok) throw new Error(`Não foi possível ler ${arquivo}: HTTP ${resposta.status}.`);
    return resposta.json();
  }));
}
function combinacoes(itens, quantidade, inicio = 0, prefixo = [], resultado = []) {
  if (!quantidade) { resultado.push(prefixo); return resultado; }
  for (let i = inicio; i <= itens.length - quantidade; i++) {
    combinacoes(itens, quantidade - 1, i + 1, [...prefixo, itens[i]], resultado);
  }
  return resultado;
}
export function prepararBanco(blocos, { modoRevisao = false } = {}) {
  if (!Array.isArray(blocos) || blocos.length !== 5) throw new Error('São necessários os cinco bancos inéditos.');
  modoRevisao = modoRevisao === true;
  const copia = copiar(blocos), ids = new Set(), grupos = new Set(), porAssunto = {}, conjuntos = {};
  for (const bloco of copia) {
    const codigo = bloco.codigo_assunto;
    if (bloco.banco_id !== BANCO_ID || !ASSUNTOS.includes(codigo) || porAssunto[codigo]) throw new Error('Banco ou assunto não permitido.');
    if (!Array.isArray(bloco.questoes) || bloco.questoes.length !== 20) throw new Error(`${codigo}: esperado banco de 20 questões.`);
    for (const q of bloco.questoes) {
      if (q.id !== `${PREFIXO_ID}-${codigo}-${String(q.numero).padStart(2, '0')}` || !Number.isInteger(q.numero) || q.numero < 1 || q.numero > 20 || ids.has(q.id)) throw new Error('Identificador inválido ou repetido.');
      ids.add(q.id);
      if (q.assunto !== codigo || !NIVEIS.includes(q.dificuldade?.nivel) || !['aprovada', ...(modoRevisao ? ['pendente'] : [])].includes(q.revisao_pedagogica?.status) || q.revisao_pedagogica?.impedimento_identificado || (q.sorteio?.ativo !== true && !(modoRevisao && q.revisao_pedagogica?.status === 'pendente' && q.sorteio?.ativo === false))) throw new Error(`${q.id}: banco pendente de revisão pedagógica ou classificação inválida. O modo de revisão deve ser solicitado explicitamente.`);
      if (q.sorteio.assunto !== codigo || q.sorteio.nivel !== q.dificuldade.nivel || typeof q.sorteio.visual_relevante !== 'boolean' || q.sorteio.visual_relevante !== Boolean(q.recursos_visuais?.length)) throw new Error(`${q.id}: metadados inconsistentes.`);
      if (!q.sorteio.grupo_equivalencia || grupos.has(q.sorteio.grupo_equivalencia)) throw new Error('Grupo de equivalência ausente ou repetido.');
      grupos.add(q.sorteio.grupo_equivalencia);
      if (!Array.isArray(q.alternativas) || q.alternativas.length !== 4 || q.alternativas.map(o => o.letra).join('') !== 'ABCD' || new Set(q.alternativas.map(o => o.texto)).size !== 4 || q.alternativas.some(o => typeof o.texto !== 'string' || !o.texto.trim()) || !'ABCD'.includes(q.gabarito) || q.gabarito.length !== 1 || !q.resolucao_comentada) throw new Error(`${q.id}: alternativas ou correção inválidas.`);
    }
    if (bloco.questoes.filter(q => q.sorteio.visual_relevante).length !== 12) throw new Error(`${codigo}: esperado banco com 12 visuais.`);
    porAssunto[codigo] = bloco.questoes;
    const estratos = NIVEIS.map((nivel, i) => combinacoes(bloco.questoes.filter(q => q.dificuldade.nivel === nivel), COTAS[codigo][i]));
    const elegiveis = [];
    for (const a of estratos[0]) for (const b of estratos[1]) for (const c of estratos[2]) {
      const conjunto = [...a, ...b, ...c];
      if (conjunto.filter(q => q.sorteio.visual_relevante).length >= 3) elegiveis.push(conjunto);
    }
    if (!elegiveis.length) throw new Error(`${codigo}: cotas inviáveis; nenhuma regra será relaxada.`);
    conjuntos[codigo] = elegiveis;
  }
  return congelar({ porAssunto, conjuntos });
}
