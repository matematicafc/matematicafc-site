import { formatarPercentual } from './resultados.mjs';

let dependencias;
async function carregarDependencias() {
  if (!dependencias) dependencias = Promise.all([
    import('./vendor/jspdf.mjs'),
    fetch(new URL('./fontes/DejaVuSans.ttf', import.meta.url)).then(async r => {
      if (!r.ok) throw new Error('Não foi possível carregar a fonte local do PDF.');
      const bytes = new Uint8Array(await r.arrayBuffer());
      let binario = ''; for (let i = 0; i < bytes.length; i += 8192) binario += String.fromCharCode(...bytes.subarray(i, i + 8192));
      return btoa(binario);
    }),
  ]).catch(e => { dependencias = null; throw e; });
  return dependencias;
}
async function imagemSVG(html) {
  const xml = new DOMParser().parseFromString(html, 'image/svg+xml');
  const svg = xml.documentElement, partes = svg.getAttribute('viewBox').split(/\s+/).map(Number);
  const largura = partes[2], altura = partes[3];
  if (!(largura > 0 && altura > 0)) throw new Error('Recurso SVG sem dimensões válidas.');
  svg.setAttribute('width', largura); svg.setAttribute('height', altura);
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = () => reject(new Error('Não foi possível renderizar o SVG.')); img.src = url; });
    const canvas = document.createElement('canvas'); canvas.width = Math.ceil(largura * 3); canvas.height = Math.ceil(altura * 3);
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas indisponível.');
    ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return { png: canvas.toDataURL('image/png'), largura, altura };
  } finally { URL.revokeObjectURL(url); }
}
export async function gerarPDF(boletim) {
  const [{ jsPDF }, fonte] = await carregarDependencias();
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true, putOnlyUsedFonts: true });
  doc.addFileToVFS('MFC-DejaVu.ttf', fonte); doc.addFont('MFC-DejaVu.ttf', 'MFC', 'normal'); doc.setFont('MFC');
  doc.setProperties({ title: 'Boletim de Desempenho — MatemáticaFC', author: 'MatemáticaFC', subject: boletim.simulado });
  doc.setCreationDate(new Date(boletim.dataISO));
  const margem = 16, largura = 178, limite = 277, avisos = [];
  let y = margem, contexto = '', recursosIncluidos = 0;
  function novaPagina() {
    doc.addPage(); y = margem;
    if (contexto) { doc.setFontSize(9); doc.setTextColor(80); doc.text(`${contexto} — continuação`, margem, y); y += 8; }
  }
  function reservar(altura) { if (y + altura > limite) novaPagina(); }
  function texto(valor, size = 10.5, espaco = 3) {
    doc.setFont('MFC'); doc.setFontSize(size); doc.setTextColor(23, 43, 58);
    const linhas = doc.splitTextToSize(String(valor), largura), passo = size * 0.352778 * 1.4;
    for (const linha of linhas) { reservar(passo); doc.setFontSize(size); doc.setTextColor(23, 43, 58); doc.text(linha, margem, y + size * 0.352778); y += passo; }
    y += espaco;
  }
  function tabela(linhas, colunas) {
    for (let r = 0; r < linhas.length; r++) {
      doc.setFontSize(9);
      const celulas = linhas[r].map((v, i) => doc.splitTextToSize(String(v), colunas[i] - 4));
      const altura = Math.max(...celulas.map(c => c.length)) * 4.5 + 5;
      reservar(altura); let x = margem;
      for (let i = 0; i < colunas.length; i++) {
        doc.setDrawColor(140); doc.setFillColor(r === 0 ? 237 : 255, r === 0 ? 244 : 255, r === 0 ? 244 : 255);
        doc.rect(x, y, colunas[i], altura, 'FD'); doc.setFontSize(9); doc.setTextColor(23, 43, 58);
        doc.text(celulas[i], x + 2, y + 5, { lineHeightFactor: 1.4 }); x += colunas[i];
      }
      y += altura;
    }
    y += 5;
  }
  const r = boletim.resultado;
  texto(boletim.marca, 15); texto(boletim.titulo, 21); texto(boletim.simulado, 11);
  if (boletim.nome) texto(`Nome do estudante: ${boletim.nome}`);
  texto(`Data de realização: ${boletim.dataFormatada}`); y += 4;
  texto('Resumo do desempenho', 15);
  texto(`Total de questões: ${r.total}`);
  texto(`Acertos: ${r.acertos}   |   Erros: ${r.erros}   |   Não respondidas: ${r.semResposta}`);
  texto(`Percentual de aproveitamento: ${formatarPercentual(r.percentual)}`, 12); y += 4;
  texto('Desempenho por assunto', 14);
  tabela([['Assunto', 'Acertos', 'Total', 'Aproveitamento'], ...r.assuntos.map(a => [a.nome, a.acertos, a.total, formatarPercentual(a.percentual)])], [89, 23, 20, 46]);
  texto('Questões sem resposta são consideradas sem acerto e estão separadas dos erros.', 10);
  texto('Para continuar estudando', 13);
  texto('Consulte as resoluções das questões sem acerto e retome os assuntos em que encontrou dificuldades. Depois, tente uma nova aplicação.', 10);
  novaPagina(); texto('Gabarito comentado completo', 17);
  for (const q of boletim.questoes) {
    contexto = ''; reservar(25); contexto = `Questão ${q.numero}`;
    texto(`Questão ${q.numero} — ${q.titulo}`, 13);
    texto(`Assunto: ${q.assuntoNome}`, 9);
    texto(q.enunciado);
    for (const recurso of q.recursosVisuais) {
      if (recurso.tipo === 'svg') {
        try {
          const img = await imagemSVG(recurso.html);
          let w = 130, h = w * img.altura / img.largura;
          if (h > 160) { w *= 160 / h; h = 160; }
          reservar(h + 6); doc.addImage(img.png, 'PNG', margem + (largura - w) / 2, y, w, h); y += h + 6; recursosIncluidos++;
        } catch {
          avisos.push(`Questão ${q.numero}: imagem substituída pela descrição acessível.`);
          texto(`Recurso visual — descrição: ${recurso.descricao}`, 10);
        }
      } else if (recurso.tipo === 'tabela_html') {
        const html = new DOMParser().parseFromString(recurso.html, 'text/html');
        const rows = [...html.querySelectorAll('tr')].map(row => [...row.querySelectorAll('th,td')].map(c => c.textContent.trim().replace(/\s+/g, ' ')));
        if (rows.length) { tabela(rows, Array(rows[0].length).fill(largura / rows[0].length)); recursosIncluidos++; }
      }
    }
    q.alternativas.forEach(o => texto(`${o.letra}) ${o.texto}`, 10));
    texto(`Alternativa escolhida: ${q.escolhida ? `${q.escolhida.letra}) ${q.escolhida.texto}` : 'Não respondida'}`, 10);
    texto(`Resposta correta: ${q.correta.letra}) ${q.correta.texto}`, 10);
    texto(`Situação: ${q.situacao}`, 10);
    texto('Resolução comentada', 11); texto(q.resolucao, 10);
    y += 5;
  }
  const paginas = doc.getNumberOfPages();
  for (let p = 1; p <= paginas; p++) {
    doc.setPage(p); doc.setFontSize(8); doc.setTextColor(80);
    doc.text(`MatemáticaFC · Página ${p} de ${paginas}`, margem, 289);
  }
  return { blob: doc.output('blob'), avisos, paginas, recursosIncluidos };
}
export function baixarPDF(blob) {
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = 'boletim-matematicafc-6ano-bloco1.pdf'; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
