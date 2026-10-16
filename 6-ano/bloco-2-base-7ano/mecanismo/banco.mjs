import { BANCO_ID, ARQUIVOS, ASSUNTOS, NIVEIS, COTAS, CONFIGURACAO, congelar, copiar } from './regras.mjs';
export async function carregarBanco(baseURL, buscar = globalThis.fetch) {
  if (typeof buscar !== 'function') throw new Error('Forneça uma função de leitura dos JSON.');
  const base = String(baseURL).replace(/\/?$/, '/');
  return Promise.all(ARQUIVOS.map(async arquivo => {
    const r = await buscar(base + arquivo);
    if (!r.ok) throw new Error(`Não foi possível ler ${arquivo}: HTTP ${r.status}.`);
    return r.json();
  }));
}
export function combinacoes(n, k) {
  if (k < 0 || k > n) return 0;
  let valor = 1;
  for (let i = 1; i <= k; i++) valor = valor * (n - i + 1) / i;
  return Math.round(valor);
}
function perfis(baldes, quantidade) {
  const resultado = [], cotas = COTAS[quantidade];
  function montar(i, fatias, visuais, peso) {
    if (i === NIVEIS.length) {
      if (visuais >= CONFIGURACAO.minimoVisualAssunto) resultado.push({ fatias, visuais, peso });
      return;
    }
    const nivel = NIVEIS[i], quota = cotas[i];
    for (let v = 0; v <= quota; v++) {
      const p = combinacoes(baldes[nivel].visual.length, v) * combinacoes(baldes[nivel].texto.length, quota - v);
      if (p) montar(i + 1, [...fatias, { nivel, tipo: 'visual', n: v }, { nivel, tipo: 'texto', n: quota - v }], visuais + v, peso * p);
    }
  }
  montar(0, [], 0, 1); return resultado;
}
export function prepararBanco(blocos, { usoTeste = false } = {}) {
  if (!Array.isArray(blocos) || blocos.length !== 4) throw new Error('São necessários os quatro bancos do Bloco 2.');
  const copia = copiar(blocos), ids = new Set(), grupos = new Set(), porAssunto = {}, preparados = {};
  for (const bloco of copia) {
    const c = bloco.codigo_assunto;
    if (bloco.banco_id !== BANCO_ID || !ASSUNTOS.includes(c) || porAssunto[c]) throw new Error('Banco ou assunto não permitido.');
    if (bloco.tipo !== 'definitivo' && !(usoTeste === true && bloco.tipo === 'dados_de_teste')) throw new Error('Dados de teste não podem iniciar o simulado normal.');
    if (!Array.isArray(bloco.questoes) || bloco.questoes.length !== 25) {
      const erro = new Error(`${c}: banco definitivo em preparação; esperadas 25 questões.`); erro.code = 'BANCO_INCOMPLETO'; throw erro;
    }
    for (const q of bloco.questoes) {
      if (!Number.isInteger(q.numero) || q.numero < 1 || q.numero > 25 || q.id !== `MFC6-B2-I-${c}-${String(q.numero).padStart(2, '0')}` || ids.has(q.id)) throw new Error('Identificador inválido ou repetido.');
      ids.add(q.id);
      if (q.assunto !== c || !NIVEIS.includes(q.dificuldade?.nivel) || q.revisao_pedagogica?.status !== 'aprovada' || q.revisao_pedagogica.impedimento_identificado || q.sorteio?.ativo !== true) throw new Error(`${q.id}: classificação ou aprovação inválida.`);
      for (const campo of ['titulo', 'enunciado', 'habilidade', 'resolucao_comentada']) if (typeof q[campo] !== 'string' || !q[campo].trim()) throw new Error(`${q.id}: ${campo} ausente.`);
      const assunto = CONFIGURACAO.assuntos.find(a => a.codigo === c);
      if (q.assunto_nome !== assunto.nome || !Array.isArray(q.recursos_visuais)) throw new Error(`${q.id}: assunto ou recursos inconsistentes.`);
      if (q.sorteio.assunto !== c || q.sorteio.nivel !== q.dificuldade.nivel || typeof q.sorteio.visual_relevante !== 'boolean' || q.sorteio.visual_relevante !== Boolean(q.recursos_visuais.length)) throw new Error(`${q.id}: metadados inconsistentes.`);
      for (const r of q.recursos_visuais) if (!['svg', 'tabela_html'].includes(r.tipo) || typeof r.html !== 'string' || !r.html.trim() || typeof r.acessibilidade !== 'string' || !r.acessibilidade.trim() || r.css) throw new Error(`${q.id}: recurso incompleto ou CSS externo não permitido.`);
      if (typeof q.sorteio.grupo_equivalencia !== 'string' || !q.sorteio.grupo_equivalencia.startsWith(`${CONFIGURACAO.prefixoId}-`) || grupos.has(q.sorteio.grupo_equivalencia)) throw new Error('Grupo de equivalência ausente ou repetido.');
      grupos.add(q.sorteio.grupo_equivalencia);
      if (!Array.isArray(q.alternativas) || q.alternativas.length !== 4 || q.alternativas.map(o => o.letra).join('') !== 'ABCD' || q.alternativas.some(o => typeof o.texto !== 'string' || !o.texto.trim()) || new Set(q.alternativas.map(o => o.texto.trim())).size !== 4 || typeof q.gabarito !== 'string' || !/^[ABCD]$/.test(q.gabarito)) throw new Error(`${q.id}: alternativas ou correção inválidas.`);
    }
    const baldes = Object.fromEntries(NIVEIS.map(n => [n, { visual: bloco.questoes.filter(q => q.dificuldade.nivel === n && q.sorteio.visual_relevante), texto: bloco.questoes.filter(q => q.dificuldade.nivel === n && !q.sorteio.visual_relevante) }]));
    const porQuantidade = Object.fromEntries([7, 8].map(n => [n, perfis(baldes, n)]));
    if ([7, 8].some(n => !porQuantidade[n].length)) throw new Error(`${c}: cotas inviáveis; nenhuma regra será relaxada.`);
    porAssunto[c] = bloco.questoes; preparados[c] = { baldes, perfis: porQuantidade };
  }
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
    const maximo = ASSUNTOS.reduce((s, c, n) => s + Math.max(...preparados[c].perfis[n === i || n === j ? 8 : 7].map(p => p.visuais)), 0);
    if (maximo < CONFIGURACAO.minimoVisualTotal) throw new Error('Mínimo visual global inviável para algum par de oito.');
  }
  return congelar({ porAssunto, preparados });
}
