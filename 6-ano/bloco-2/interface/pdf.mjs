import { formatarPercentual } from './resultados.mjs';
import { criarRecursoSeguro } from './recursos.mjs';

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
async function imagemSVG(recurso) {
  const svg = criarRecursoSeguro(recurso), partes = svg.getAttribute('viewBox').split(/\s+/).map(Number);
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
  const diagramacao = [];
  function alturaTexto(valor, size = 10.5, espaco = 2) {
    doc.setFontSize(size);
    return doc.splitTextToSize(String(valor), largura).length * size * 0.352778 * 1.4 + espaco;
  }
  function novaPagina() {
    doc.addPage(); y = margem;
    if (contexto) { doc.setFontSize(9); doc.setTextColor(80); doc.text(`${contexto} — continuação`, margem, y); y += 8; }
  }
  function reservar(altura) { if (y + altura > limite) novaPagina(); }
  function texto(valor, size = 10.5, espaco = 2) {
    doc.setFont('MFC'); doc.setFontSize(size); doc.setTextColor(23, 43, 58);
    const linhas = doc.splitTextToSize(String(valor), largura), passo = size * 0.352778 * 1.4;
    // Mantém parágrafos juntos quando cabem integralmente em uma página.
    const altura = linhas.length * passo + espaco;
    if (altura <= limite - margem - (contexto ? 8 : 0)) reservar(altura);
    for (const linha of linhas) { reservar(passo); doc.setFontSize(size); doc.setTextColor(23, 43, 58); doc.text(linha, margem, y + size * 0.352778); y += passo; }
    y += espaco;
  }
  function medirTabela(linhas, colunas) {
    doc.setFontSize(10);
    return linhas.map(linha => {
      const celulas = linha.map((v, i) => doc.splitTextToSize(String(v), colunas[i] - 4));
      return { celulas, altura: Math.max(...celulas.map(c => c.length)) * 5 + 5 };
    });
  }
  function tabela(linhas, colunas) {
    const medidas = medirTabela(linhas, colunas);
    const alturaTotal = medidas.reduce((s, r) => s + r.altura, 0) + 5;
    if (alturaTotal <= limite - margem - (contexto ? 8 : 0)) reservar(alturaTotal);
    function linha(medida, cabecalho) {
      let x = margem;
      for (let i = 0; i < colunas.length; i++) {
        doc.setDrawColor(140); doc.setFillColor(cabecalho ? 237 : 255, cabecalho ? 244 : 255, cabecalho ? 244 : 255);
        doc.rect(x, y, colunas[i], medida.altura, 'FD'); doc.setFontSize(10); doc.setTextColor(23, 43, 58);
        doc.text(medida.celulas[i], x + 2, y + 5, { lineHeightFactor: 1.4 }); x += colunas[i];
      }
      y += medida.altura;
    }
    for (let r = 0; r < medidas.length; r++) {
      if (y + medidas[r].altura > limite) { novaPagina(); if (r > 0) linha(medidas[0], true); }
      linha(medidas[r], r === 0);
    }
    y += 5;
  }
  const r = boletim.resultado;
  texto(boletim.marca, 15); texto(boletim.titulo, 21); texto(boletim.simulado, 11);
  if(boletim.aviso) texto(boletim.aviso,9);
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
  if(boletim.recomendacoes?.length) boletim.recomendacoes.forEach(a=>texto(`${a.assunto}: ${a.texto}`, 10));
  else texto('Revise as estratégias no gabarito e experimente uma nova aplicação.', 10);
  novaPagina();
  for (const q of boletim.questoes) {
    // SVGs continuam rasterizados em alta resolução (3x), preservando proporções.
    // O tamanho impresso é compatível com o texto, sem reduzir a fonte do boletim.
    const preparados = [];
    for (const recurso of q.recursosVisuais) {
      if (recurso.tipo === 'svg') {
        try {
          const img = await imagemSVG(recurso);
          let w = 85, h = w * img.altura / img.largura;
          if (h > 138) { w *= 138 / h; h = 138; }
          preparados.push({ tipo:'imagem', ...img, w, h });
        } catch {
          avisos.push(`Questão ${q.numero}: imagem substituída pela descrição acessível.`);
          preparados.push({ tipo:'descricao', texto:`Recurso visual — descrição: ${recurso.descricao}` });
        }
      } else if (recurso.tipo === 'tabela_html') {
        const html = criarRecursoSeguro(recurso);
        const linhas = [...html.querySelectorAll('tr')].map(row => [...row.querySelectorAll('th,td')].map(c => c.textContent.trim().replace(/\s+/g, ' ')));
        if (linhas.length) preparados.push({ tipo:'tabela', linhas, colunas:Array(linhas[0].length).fill(largura / linhas[0].length) });
      }
    }
    const opcoes = q.alternativas.map(o => `${o.letra}) ${o.texto}`);
    const escolhida = `Alternativa escolhida: ${q.escolhida ? `${q.escolhida.letra}) ${q.escolhida.texto}` : 'Não respondida'}`;
    const correta = `Resposta correta: ${q.correta.letra}) ${q.correta.texto}`;
    const situacao = `Situação: ${q.situacao}`;
    const alturaRecursos = preparados.reduce((s, r) => s + (r.tipo === 'imagem' ? r.h + 6 : r.tipo === 'tabela' ? medirTabela(r.linhas, r.colunas).reduce((s, c) => s + c.altura, 0) + 5 : alturaTexto(r.texto)), 0);
    const titulo = `Questão ${q.numero} — ${q.titulo}`;
    const alturaInicio = alturaTexto(titulo,13) + alturaTexto(`Assunto: ${q.assuntoNome}`,10) + alturaTexto(q.enunciado);
    const alturaOpcoes = opcoes.reduce((s, t) => s + alturaTexto(t,10.5,1.5),0);
    const alturaCorrecao = alturaTexto(escolhida) + alturaTexto(correta) + alturaTexto(situacao) + alturaTexto('Resolução comentada',11) + alturaTexto(q.resolucao);
    const tituloGabarito = q.numero === 1 ? alturaTexto('Gabarito comentado completo',17) : 0;
    const estimada = tituloGabarito + alturaInicio + alturaRecursos + alturaOpcoes + alturaCorrecao + 3;
    contexto = '';
    if (estimada <= limite - margem) reservar(estimada);
    else {
      // Em questões longas, manter enunciado e primeiro recurso juntos quando cabem.
      const primeiro = preparados[0];
      const alturaPrimeiro = !primeiro ? 0 : primeiro.tipo === 'imagem' ? primeiro.h + 6 : primeiro.tipo === 'tabela' ? medirTabela(primeiro.linhas,primeiro.colunas).reduce((s,c)=>s+c.altura,0)+5 : alturaTexto(primeiro.texto);
      const apresentacao = tituloGabarito + alturaInicio + alturaPrimeiro;
      reservar(apresentacao <= limite-margem ? apresentacao : tituloGabarito+alturaInicio);
    }
    const inicioPagina = doc.getNumberOfPages();
    contexto = `Questão ${q.numero}`;
    if (q.numero === 1) texto('Gabarito comentado completo',17);
    reservar(Math.min(alturaInicio, limite - margem - 8));
    texto(titulo,13); texto(`Assunto: ${q.assuntoNome}`,10); texto(q.enunciado);
    for (const r of preparados) {
      if (r.tipo === 'imagem') { reservar(r.h + 6); doc.addImage(r.png,'PNG',margem+(largura-r.w)/2,y,r.w,r.h); y+=r.h+6; recursosIncluidos++; }
      else if (r.tipo === 'tabela') { tabela(r.linhas,r.colunas); recursosIncluidos++; }
      else texto(r.texto);
    }
    reservar(alturaOpcoes);
    opcoes.forEach(o=>texto(o,10.5,1.5));
    if (alturaCorrecao <= limite - margem - 8) reservar(alturaCorrecao);
    texto(escolhida); texto(correta); texto(situacao);
    reservar(alturaTexto('Resolução comentada',11)+Math.min(alturaTexto(q.resolucao),25));
    texto('Resolução comentada',11); texto(q.resolucao);
    y += 3;
    diagramacao.push({numero:q.numero,id:q.id,inicioPagina,fimPagina:doc.getNumberOfPages(),alturaEstimadaMM:estimada,imagens:preparados.filter(r=>r.tipo==='imagem').map(r=>({larguraMM:r.w,alturaMM:r.h}))});
  }
  const paginas = doc.getNumberOfPages();
  for (let p = 1; p <= paginas; p++) {
    doc.setPage(p); doc.setFontSize(8); doc.setTextColor(80);
    doc.text(`MatemáticaFC · Página ${p} de ${paginas}`, margem, 289);
  }
  return { blob: doc.output('blob'), avisos, paginas, recursosIncluidos, diagramacao };
}
export function baixarPDF(blob, nomeArquivo = 'boletim-matematicafc.pdf') {
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = nomeArquivo; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
