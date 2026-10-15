import { formatarPercentual } from './resultados.mjs';
import { criarRecursoSeguro } from './recursos.mjs';

export const CSS_BOLETIM = `
@font-face{font-family:MFCBoletim;src:url("${new URL('./fontes/DejaVuSans.ttf', import.meta.url)}") format("truetype");font-display:swap}
@page{size:A4;margin:16mm}
*{box-sizing:border-box}body{margin:0;color:#172b3a;background:white;font:10.5pt/1.4 MFCBoletim,Arial,sans-serif}
h1{font-size:21pt;margin:10px 0}h2{font-size:15pt;margin:12px 0 8px;break-after:avoid}h3{font-size:12pt;margin:16px 0 8px;break-after:avoid}
p{margin:6px 0;white-space:pre-wrap}header{border-bottom:2px solid #086a68;padding-bottom:14px}header strong{color:#086a68;font-size:14pt}
.mfc-boletim-resumo{break-after:page}.mfc-boletim-questao{margin:10px 0 12px;border-bottom:1px solid #bccbd0;padding-bottom:10px;break-inside:avoid-page}
.mfc-boletim-questao h3{break-after:avoid}.mfc-boletim-recurso{max-width:85mm;margin:10px auto;break-inside:avoid}
.mfc-boletim-recurso svg{display:block;width:100%;height:auto;max-height:138mm;object-fit:contain;overflow:visible}
table{border-collapse:collapse;width:100%;margin:10px 0;font-size:10pt}th,td{border:1px solid #84999f;padding:6px;text-align:left}th{background:#eef4f4}thead{display:table-header-group}tr{break-inside:avoid}
.mfc-boletim-escolha{border-left:3px solid #086a68;padding-left:10px}.mfc-boletim-opcoes{padding-left:0;list-style:none}.mfc-boletim-opcoes li{margin:5px 0;break-inside:avoid}
.mfc-boletim-resolucao{margin-top:10px;break-inside:avoid-page}.mfc-boletim-resolucao strong{break-after:avoid}
.mfc-boletim-apresentacao,.mfc-boletim-enunciado,.mfc-boletim-opcoes{break-inside:avoid-page}.mfc-boletim-enunciado h3{margin-top:0}p{orphans:3;widows:3}.mfc-rotulo-celula{display:none}
@media screen{body{max-width:190mm;padding:16mm;margin:auto}.mfc-boletim-resumo{border-bottom:1px solid #bccbd0;padding-bottom:16px}}
`;
function el(doc, tag, text, classe) {
  const n = doc.createElement(tag);
  if (text != null) n.textContent = text;
  if (classe) n.className = classe;
  return n;
}
export function documentoImpressao(boletim) {
  const doc = document.implementation.createHTMLDocument('Boletim de Desempenho — MatemáticaFC');
  doc.documentElement.lang = 'pt-BR';
  const politica = el(doc, 'meta');
  politica.httpEquiv = 'Content-Security-Policy';
  politica.content = "default-src 'none'; style-src 'unsafe-inline'; font-src 'self'; script-src 'none'; base-uri 'none'; form-action 'none'";
  doc.head.append(politica);
  const style = el(doc, 'style', CSS_BOLETIM); doc.head.append(style);
  const r = boletim.resultado;
  const resumo = el(doc, 'section', null, 'mfc-boletim-resumo');
  const header = el(doc, 'header'); header.append(el(doc, 'strong', boletim.marca), el(doc, 'h1', boletim.titulo), el(doc, 'p', boletim.simulado)); resumo.append(header);
  if (boletim.aviso) resumo.append(el(doc, 'p', boletim.aviso));
  if (boletim.nome) resumo.append(el(doc, 'p', `Nome do estudante: ${boletim.nome}`));
  resumo.append(el(doc, 'p', `Data de realização: ${boletim.dataFormatada}`), el(doc, 'h2', 'Resumo do desempenho'),
    el(doc, 'p', `Total: ${r.total} questões · Acertos: ${r.acertos} · Erros: ${r.erros} · Não respondidas: ${r.semResposta}`),
    el(doc, 'p', `Aproveitamento: ${formatarPercentual(r.percentual)}`), el(doc, 'h2', 'Desempenho por assunto'));
  const table = el(doc, 'table'); const thead = el(doc, 'thead'); const head = el(doc, 'tr');
  for (const texto of ['Assunto', 'Acertos', 'Total', 'Aproveitamento']) { const th = el(doc, 'th', texto); th.scope = 'col'; head.append(th); }
  thead.append(head); table.append(thead); const tbody = el(doc, 'tbody');
  for (const a of r.assuntos) { const row = el(doc, 'tr'); row.append(el(doc, 'th', a.nome), el(doc, 'td', a.acertos), el(doc, 'td', a.total), el(doc, 'td', formatarPercentual(a.percentual))); row.firstChild.scope = 'row'; tbody.append(row); }
  table.append(tbody); resumo.append(table, el(doc, 'p', 'Questões sem resposta são consideradas sem acerto e estão separadas dos erros.'),
    el(doc, 'h2', 'Para continuar estudando'), el(doc, 'p', boletim.recomendacoes?.length ? boletim.recomendacoes.map(a=>`${a.assunto}: ${a.texto}`).join('\n\n') : 'Revise as estratégias no gabarito e experimente uma nova aplicação.'));
  doc.body.append(resumo);
  for (const q of boletim.questoes) {
    const article = el(doc, 'article', null, 'mfc-boletim-questao'); article.dataset.numero = q.numero;
    if (q.numero === 1) article.append(el(doc, 'h2', 'Gabarito comentado completo'));
    const apresentacao = el(doc, 'div', null, 'mfc-boletim-apresentacao');
    const inicio = el(doc, 'div', null, 'mfc-boletim-enunciado');
    inicio.append(el(doc, 'h3', `Questão ${q.numero} — ${q.titulo}`), el(doc, 'p', `Assunto: ${q.assuntoNome}`), el(doc, 'p', q.enunciado)); apresentacao.append(inicio);
    for (const recurso of q.recursosVisuais) { const figura = el(doc, 'div', null, 'mfc-boletim-recurso'); figura.append(criarRecursoSeguro(recurso, doc)); apresentacao.append(figura); }
    article.append(apresentacao);
    const lista = el(doc, 'ol', null, 'mfc-boletim-opcoes');
    for (const o of q.alternativas) lista.append(el(doc, 'li', `${o.letra}) ${o.texto}`));
    article.append(lista, el(doc, 'p', `Alternativa escolhida: ${q.escolhida ? `${q.escolhida.letra}) ${q.escolhida.texto}` : 'Não respondida'}`, 'mfc-boletim-escolha'),
      el(doc, 'p', `Resposta correta: ${q.correta.letra}) ${q.correta.texto}`), el(doc, 'p', `Situação: ${q.situacao}`));
    const resolucao = el(doc, 'div', null, 'mfc-boletim-resolucao'); resolucao.append(el(doc, 'strong', 'Resolução comentada'), el(doc, 'p', q.resolucao)); article.append(resolucao); doc.body.append(article);
  }
  return '<!doctype html>\n' + doc.documentElement.outerHTML;
}
export async function imprimirBoletim(boletim, destino = document.body) {
  const frame = document.createElement('iframe');
  frame.title = 'Versão para impressão do Boletim de Desempenho'; frame.className = 'mfc-frame-impressao';
  // A impressão precisa de mesma origem e diálogo; não precisa executar scripts.
  frame.setAttribute('sandbox', 'allow-same-origin allow-modals');
  frame.style.cssText = 'position:fixed;left:-20000px;top:0;width:794px;height:1123px;border:0';
  let removerDepois;
  const origem = document.activeElement;
  frame.tabIndex = -1;
  const pronto = new Promise((resolve, reject) => {
    frame.onload = async () => {
      try {
        await frame.contentDocument.fonts.ready;
        const limpar = () => {
          clearTimeout(removerDepois); const devolver = document.activeElement === frame || document.activeElement === document.body; frame.remove();
          if (devolver) requestAnimationFrame(() => { if (origem?.isConnected && !origem.disabled) origem.focus(); });
        };
        frame.contentWindow.addEventListener('afterprint', limpar, { once: true });
        removerDepois = setTimeout(limpar, 60000);
        frame.contentWindow.focus(); frame.contentWindow.print(); resolve();
      } catch (e) { frame.remove(); reject(e); }
    };
  });
  frame.srcdoc = documentoImpressao(boletim); destino.append(frame);
  return pronto;
}
