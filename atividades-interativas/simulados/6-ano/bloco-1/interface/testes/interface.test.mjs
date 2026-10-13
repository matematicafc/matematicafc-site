import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { calcularResultados } from '../resultados.mjs';

const root = fileURLToPath(new URL('../../../../../../', import.meta.url));
const caminho = '/atividades-interativas/simulados/6-ano/bloco-1/interface/';
const bancos = await Promise.all(['sistema-numeracao', 'operacoes', 'multiplos-divisores', 'fracoes', 'decimais'].map(f => readFile(root + `atividades-interativas/simulados/6-ano/bloco-1/banco-inedito/${f}.json`, 'utf8').then(JSON.parse)));
const fonte = new Map(bancos.flatMap(b => b.questoes.map(q => [q.id, q])));
let servidor, browser, url;
before(async () => {
  const reserva = createServer(); await new Promise(resolve => reserva.listen(0, '127.0.0.1', resolve));
  const porta = reserva.address().port; await new Promise(resolve => reserva.close(resolve));
  url = `http://127.0.0.1:${porta}${caminho}`;
  servidor = spawn('python3', ['-m', 'http.server', String(porta), '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore' });
  let pronto = false;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(url)).ok) { pronto = true; break; } } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  assert.ok(pronto, 'servidor HTTP não iniciou');
  const executablePath = process.env.MFC_CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
});
after(async () => { await browser?.close(); servidor?.kill(); });
async function abrir(width = 1280, height = 900) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const erros = [];
  page.on('pageerror', e => erros.push(e.message));
  await page.goto(url);
  await page.getByRole('button', { name: 'Iniciar simulado', exact: true }).waitFor();
  await page.waitForFunction(() => !document.querySelector('button.mfc-primary').disabled);
  return { context, page, erros };
}
async function iniciar(page) { await page.getByRole('button', { name: 'Iniciar simulado', exact: true }).click(); }
async function ir(page, n) { await page.getByRole('navigation').getByRole('button', { name: new RegExp(`^Questão ${n},`) }).click(); }
async function atual(page) {
  return page.locator('article').evaluate(a => ({ id: a.dataset.questaoId, opcoes: [...a.querySelectorAll('input[type=radio]')].map(r => r.value), svg: a.querySelectorAll('svg').length }));
}

test('navegação conserva ordem e respostas, permite alteração e limpeza sem correção', async () => {
  const { context, page, erros } = await abrir();
  try {
    await iniciar(page);
    assert.equal(await page.getByRole('navigation').getByRole('button').count(), 30);
    assert.equal(await page.getByRole('button', { name: 'Anterior', exact: true }).isDisabled(), true);
    const primeira = await atual(page);
    await page.getByRole('radio').nth(1).check();
    assert.equal(await page.getByText('1 de 30 questões respondidas', { exact: true }).count(), 1);
    assert.equal(await page.getByRole('navigation').getByRole('button', { name: 'Questão 1, respondida', exact: true }).count(), 1);
    await page.getByRole('button', { name: 'Próxima', exact: true }).click();
    await page.getByRole('radio').nth(2).check();
    await page.getByRole('button', { name: 'Anterior', exact: true }).click();
    assert.deepEqual(await atual(page), primeira);
    assert.equal(await page.getByRole('radio').nth(1).isChecked(), true);
    await page.getByRole('radio').nth(3).check();
    await ir(page, 30);
    assert.equal(await page.getByRole('button', { name: 'Próxima', exact: true }).isDisabled(), true);
    await ir(page, 1);
    assert.deepEqual(await atual(page), primeira);
    assert.equal(await page.getByRole('radio').nth(3).isChecked(), true);
    await page.getByRole('button', { name: 'Limpar resposta', exact: true }).click();
    assert.equal(await page.getByRole('radio', { checked: true }).count(), 0);
    assert.equal(await page.getByText('1 de 30 questões respondidas', { exact: true }).count(), 1);
    assert.equal(await page.locator('[data-correcao]').count(), 0);
    assert.equal(await page.getByText(fonte.get(primeira.id).resolucao_comentada, { exact: true }).count(), 0);
    assert.deepEqual(erros, []);
  } finally { await context.close(); }
});

test('confirmação, cancelamento e finalização sem respostas: resultado e gabarito', async () => {
  const { context, page, erros } = await abrir(390, 844);
  try {
    await iniciar(page);
    await page.getByRole('button', { name: 'Finalizar simulado', exact: true }).click();
    assert.equal(await page.getByRole('dialog').isVisible(), true);
    assert.match(await page.getByRole('dialog').innerText(), /30 questões sem resposta/);
    assert.equal(await page.getByRole('button', { name: 'Continuar respondendo', exact: true }).evaluate(n => n === document.activeElement), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').isVisible(), false);
    assert.equal(await page.locator('[data-correcao]').count(), 0);
    await page.getByRole('button', { name: 'Finalizar simulado', exact: true }).click();
    await page.getByRole('button', { name: 'Continuar respondendo', exact: true }).click();
    assert.equal(await page.locator('article').count(), 1);
    await page.getByRole('button', { name: 'Finalizar simulado', exact: true }).click();
    await page.getByRole('button', { name: 'Confirmar finalização', exact: true }).click();
    assert.equal(await page.locator('[data-total-acertos]').innerText(), '0 de 30');
    assert.equal(await page.locator('[data-percentual]').innerText(), '0%');
    assert.equal(await page.getByRole('radio').count(), 0);
    await page.getByRole('button', { name: 'Ver gabarito comentado', exact: true }).click();
    assert.equal(await page.locator('.mfc-review details').count(), 30);
    await page.locator('.mfc-review summary').first().click();
    assert.equal(await page.getByText('Você não respondeu.', { exact: true }).first().isVisible(), true);
    assert.equal(await page.locator('.mfc-resolution').first().isVisible(), true);
    assert.deepEqual(erros, []);
  } finally { await context.close(); }
});

test('30 respostas, resultado por assunto e nova aplicação: integração com banco real', async () => {
  const { context, page, erros } = await abrir();
  try {
    await iniciar(page);
    const selecionadas = [], esperado = {};
    for (let i = 1; i <= 30; i++) {
      await ir(page, i); const q = await atual(page); selecionadas.push(q);
      const ref = fonte.get(q.id);
      const opcao = i <= 15 ? ref.gabarito : ref.alternativas.find(o => o.letra !== ref.gabarito).letra;
      await page.locator(`input[value="${q.id}:opcao:${opcao}"]`).check();
      esperado[ref.assunto] = (esperado[ref.assunto] || 0) + Number(i <= 15);
    }
    assert.equal(await page.getByText('30 de 30 questões respondidas', { exact: true }).count(), 1);
    assert.equal(await page.locator('[data-correcao]').count(), 0);
    const contagens = Object.fromEntries(['SN', 'ON', 'MD', 'FR', 'ND'].map(c => [c, selecionadas.filter(q => fonte.get(q.id).assunto === c).length]));
    assert.deepEqual(Object.values(contagens), [6, 6, 6, 6, 6]);
    assert.equal(new Set(selecionadas.map(q => q.id)).size, 30);
    assert.ok(selecionadas.filter(q => fonte.get(q.id).sorteio.visual_relevante).length >= 15);
    assert.deepEqual(['facil', 'media', 'dificil'].map(n => selecionadas.filter(q => fonte.get(q.id).dificuldade.nivel === n).length), [8, 14, 8]);
    await page.getByRole('button', { name: 'Finalizar simulado', exact: true }).click();
    assert.match(await page.getByRole('dialog').innerText(), /respondeu às 30/);
    await page.getByRole('button', { name: 'Confirmar finalização', exact: true }).click();
    assert.equal(await page.locator('[data-total-acertos]').innerText(), '15 de 30');
    assert.equal(await page.locator('[data-percentual]').innerText(), '50%');
    for (const [c, acertos] of Object.entries(esperado)) assert.match(await page.locator(`[data-assunto="${c}"]`).innerText(), new RegExp(`${acertos} de 6`));
    await page.getByRole('button', { name: 'Ver gabarito comentado', exact: true }).click();
    for (const q of selecionadas) {
      const detalhe = page.locator(`details[data-questao-id="${q.id}"]`);
      const ref = fonte.get(q.id);
      const correta = q.opcoes.indexOf(`${q.id}:opcao:${ref.gabarito}`);
      assert.match(await detalhe.locator('[data-correta="true"]').textContent(), new RegExp(`^${'ABCD'[correta]}\\)`));
      assert.equal(await detalhe.locator('.mfc-resolution p').textContent(), ref.resolucao_comentada);
    }
    await page.getByRole('button', { name: 'Iniciar nova aplicação', exact: true }).click();
    assert.equal(await page.getByText('0 de 30 questões respondidas', { exact: true }).count(), 1);
    const novos = [];
    for (let i = 1; i <= 30; i++) { await ir(page, i); novos.push((await atual(page)).id); }
    assert.notDeepEqual(novos.sort(), selecionadas.map(q => q.id).sort());
    assert.equal(await page.locator('[data-correcao]').count(), 0);
    assert.deepEqual(erros, []);
  } finally { await context.close(); }
});

test('SVGs e tabelas dos 100 itens, alvos de toque e layout em 320/768/1280 px', async () => {
  // Laboratório somente no teste: utiliza os recursos da projeção existente, sem sorteio alternativo.
  const { context, page, erros } = await abrir();
  try {
    await iniciar(page);
    for (const width of [320, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const metricas = await page.evaluate(() => ({ largura: innerWidth, conteudo: document.documentElement.scrollWidth,
        alvos: [...document.querySelectorAll('.mfc-numbers button')].map(n => ({ w: n.getBoundingClientRect().width, h: n.getBoundingClientRect().height })) }));
      assert.ok(metricas.conteudo <= metricas.largura + 1, `overflow em ${width}`);
      assert.ok(metricas.alvos.every(r => r.w >= 44 && r.h >= 44), `alvos em ${width}`);
      for (let i = 1; i <= 30; i++) {
        await ir(page, i);
        const problemas = await page.locator('.mfc-recurso svg').evaluateAll(nodes => nodes.filter(n => {
          const box = n.getBoundingClientRect(), parent = n.parentElement.getBoundingClientRect(), v = n.viewBox.baseVal;
          return box.width <= 0 || box.height <= 0 || box.width > parent.width + 1 || Math.abs(box.width / box.height - v.width / v.height) > 0.01;
        }).length);
        assert.equal(problemas, 0);
      }
    }
    await page.setViewportSize({ width: 320, height: 900 });
    const recursos = [...fonte.values()].flatMap(q => q.recursos_visuais);
    await page.evaluate(recursos => {
      const article = document.querySelector('article'); article.replaceChildren();
      for (const r of recursos) { const el = document.createElement('div'); el.className = 'mfc-recurso'; el.innerHTML = r.html; article.append(el); }
    }, recursos);
    assert.equal(await page.locator('article svg').count(), 58);
    assert.equal(await page.locator('article table').count(), 2);
    const cortes = await page.locator('article svg').evaluateAll(nodes => nodes.filter(n => {
      const box = n.getBoundingClientRect(), v = n.viewBox.baseVal;
      return box.left < 0 || box.right > innerWidth + 1 || Math.abs(box.width / box.height - v.width / v.height) > 0.01;
    }).length);
    assert.equal(cortes, 0);
    assert.deepEqual(erros, []);
  } finally { await context.close(); }
});

test('falha de carregamento e recuperação, sem login ou armazenamento de respostas', async () => {
  const { context, page } = await abrir();
  try {
    await page.route('**/banco-inedito/*.json', route => route.fulfill({ status: 503, body: 'Indisponível' }));
    await page.reload();
    await page.getByRole('button', { name: 'Tentar novamente', exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Iniciar simulado', exact: true }).isDisabled(), true);
    await page.unroute('**/banco-inedito/*.json');
    await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
    await page.waitForFunction(() => !document.querySelector('button.mfc-primary').disabled);
    await iniciar(page);
    await page.getByRole('radio').first().check();
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
  } finally { await context.close(); }
});


test('teclado: alternativa por setas, contador e foco contido na confirmação', async () => {
  const { context, page } = await abrir();
  try {
    await iniciar(page);
    await page.getByRole('radio').first().focus();
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.getByRole('radio').nth(1).isChecked(), true);
    assert.equal(await page.getByText('1 de 30 questões respondidas', { exact: true }).count(), 1);
    await page.getByRole('button', { name: 'Finalizar simulado', exact: true }).click();
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      assert.equal(await page.getByRole('dialog').evaluate(d => d.contains(document.activeElement)), true);
    }
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('radio').nth(1).isChecked(), true);
  } finally { await context.close(); }
});

test('cálculo: questões sem resposta contam no total e correção inválida é rejeitada', () => {
  const q = { id: 'q', assunto: 'SN', assuntoNome: 'Sistema de numeração', alternativas: [{ id: 'a' }, { id: 'b' }] };
  assert.equal(calcularResultados([q], [{ questaoId: 'q', opcaoCorretaId: 'a', respostaId: null }]).percentual, 0);
  assert.equal(calcularResultados([q], [{ questaoId: 'q', opcaoCorretaId: 'a', respostaId: 'a' }]).percentual, 100);
  assert.throws(() => calcularResultados([q], []));
  assert.throws(() => calcularResultados([q], [{ questaoId: 'q', opcaoCorretaId: 'c', respostaId: null }]));
});

test('capturas de inspeção da interface em computador e celular', { skip: !process.env.MFC_CAPTURAS }, async () => {
  const destino = process.env.MFC_CAPTURAS;
  if (!destino) return;
  await mkdir(destino, { recursive: true });
  for (const [nome, width, height] of [['computador', 1280, 900], ['celular', 390, 844]]) {
    const { context, page } = await abrir(width, height);
    try {
      await page.screenshot({ path: `${destino}/inicio-${nome}.png`, fullPage: true });
      await iniciar(page);
      for (let i = 1; i <= 30; i++) { await ir(page, i); if ((await atual(page)).svg) break; }
      await page.screenshot({ path: `${destino}/questao-${nome}.png`, fullPage: true });
      const q = await atual(page), ref = fonte.get(q.id);
      await page.locator(`input[value="${q.id}:opcao:${ref.gabarito}"]`).check();
      await page.getByRole('button', { name: 'Finalizar simulado', exact: true }).click();
      await page.getByRole('button', { name: 'Confirmar finalização', exact: true }).click();
      await page.screenshot({ path: `${destino}/resultado-${nome}.png`, fullPage: true });
      await page.getByRole('button', { name: 'Ver gabarito comentado', exact: true }).click();
      await page.locator('.mfc-review summary').first().click();
      await page.locator('.mfc-review').screenshot({ path: `${destino}/gabarito-${nome}.png` });
    } finally { await context.close(); }
  }
});

test('boletim local: nome opcional, PDF íntegro, impressão, consulta e nova aplicação', async () => {
  const { mkdtemp, writeFile } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { execFileSync } = await import('node:child_process');
  const { criarBoletim } = await import('../boletim.mjs');
  assert.throws(() => criarBoletim({ obterCorrecao() { throw new Error('Ainda não finalizada'); } }), /finalizada/);
  const pasta = process.env.MFC_BOLETIM_CAPTURAS || await mkdtemp(tmpdir() + '/mfc-boletim-');
  await mkdir(pasta, { recursive: true });
  const { context, page, erros } = await abrir();
  const requests = [];
  context.on('request', r => requests.push({ url: r.url(), method: r.method(), body: r.postData() }));
  await context.addInitScript(() => { window.print = () => { window.__mfcImprimiu = true; }; });
  try {
    await page.getByLabel('Nome do estudante (opcional)', { exact: true }).fill('Ana Júlia — exemplo fictício');
    await page.screenshot({ path: pasta + '/inicio-computador.png', fullPage: true });
    await iniciar(page);
    assert.equal(await page.getByRole('button', { name: 'Baixar PDF', exact: true }).count(), 0);
    assert.equal(requests.some(r => /jspdf|DejaVu/.test(r.url)), false);
    const apresentadas = [];
    for (let i = 1; i <= 30; i++) {
      await ir(page, i); const q = await atual(page); apresentadas.push(q);
      if (i <= 3) {
        const ref = fonte.get(q.id);
        const letra = i <= 2 ? ref.gabarito : ref.alternativas.find(o => o.letra !== ref.gabarito).letra;
        await page.locator(`input[value="${q.id}:opcao:${letra}"]`).check();
      }
    }
    await page.getByRole('button', { name: 'Finalizar simulado', exact: true }).click();
    assert.match(await page.getByRole('dialog').innerText(), /27 questões sem resposta/);
    await page.getByRole('button', { name: 'Confirmar finalização', exact: true }).click();
    assert.equal(await page.locator('[data-total-acertos]').innerText(), '2 de 30');
    assert.equal(await page.locator('[data-total-erros]').innerText(), '1');
    assert.equal(await page.locator('[data-total-branco]').innerText(), '27');
    assert.equal(await page.locator('[data-percentual]').innerText(), '6,7%');
    assert.match(await page.locator('[data-nome-estudante]').innerText(), /Ana Júlia/);
    await page.screenshot({ path: pasta + '/resultado-computador.png', fullPage: true });
    await page.setViewportSize({ width: 320, height: 760 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    for (const name of ['Baixar PDF', 'Imprimir', 'Consultar na tela']) {
      const box = await page.getByRole('button', { name, exact: true }).boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44 && box.x >= 0 && box.x + box.width <= 320);
    }
    await page.screenshot({ path: pasta + '/resultado-celular-320.png', fullPage: true });
    await page.getByRole('button', { name: 'Consultar na tela', exact: true }).click();
    assert.equal(await page.locator('.mfc-review details').count(), 30);
    assert.equal(await page.locator('.mfc-review').isVisible(), true);
    const esperadas = await page.locator('.mfc-review details').evaluateAll(ds => ds.map(d => ({ id: d.dataset.questaoId, titulo: d.querySelector('summary').textContent,
      enunciado: d.querySelector('.mfc-enunciado').textContent, resolucao: d.querySelector('.mfc-resolution p').textContent,
      opcoes: [...d.querySelectorAll('.mfc-review-option')].map(o => o.textContent.split(' — ')[0]),
      correta: d.querySelector('[data-correta="true"]').textContent.split(' — ')[0],
      escolhida: [...d.querySelectorAll('.mfc-review-option')].find(o => o.textContent.includes('Sua resposta'))?.textContent.split(' — ')[0] || 'Não respondida'
    })));
    assert.deepEqual(esperadas.map(q => q.id), apresentadas.map(q => q.id));
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Baixar PDF', exact: true }).click();
    const download = await downloadPromise; const arquivo = pasta + '/boletim-exemplo.pdf';
    await download.saveAs(arquivo);
    await page.getByText('PDF preparado para download.', { exact: true }).waitFor();
    const pdfText = execFileSync('pdftotext', ['-layout', arquivo, '-'], { encoding: 'utf8' });
    const normalizar = t => t.normalize('NFC').replace(/\s/g, '');
    const pdfSemCabecalhos = pdfText.replace(/MatemáticaFC · Página \d+ de \d+/g, '').replace(/Questão \d+ — continuação/g, '');
    const pdfNormal = normalizar(pdfSemCabecalhos);
    assert.ok(pdfNormal.includes(normalizar('Ana Júlia — exemplo fictício')));
    assert.ok(pdfNormal.includes(normalizar('Acertos: 2 | Erros: 1 | Não respondidas: 27')));
    let pos = 0;
    for (const q of esperadas) {
      const titulo = normalizar(q.titulo); const next = pdfNormal.indexOf(titulo, pos); assert.ok(next >= pos, q.titulo); pos = next + titulo.length;
      for (const t of [q.enunciado, q.resolucao, ...q.opcoes, `Resposta correta: ${q.correta}`, `Alternativa escolhida: ${q.escolhida}`]) assert.ok(pdfNormal.includes(normalizar(t)), `Texto ausente do PDF: ${q.id} / ${t}`);
    }
    await page.getByRole('button', { name: 'Imprimir', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('iframe.mfc-frame-impressao')?.contentWindow.__mfcImprimiu);
    const htmlImpressao = await page.locator('iframe.mfc-frame-impressao').evaluate(f => f.contentDocument.documentElement.outerHTML);
    const paginaImpressao = await context.newPage();
    await paginaImpressao.setContent(htmlImpressao);
    await paginaImpressao.evaluate(() => document.fonts.ready);
    await paginaImpressao.pdf({ path: pasta + '/impressao-exemplo.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
    await paginaImpressao.close();
    const impresso = await page.locator('iframe.mfc-frame-impressao').evaluate(frame => ({ nome: frame.contentDocument.body.textContent, ids: [...frame.contentDocument.querySelectorAll('article')].map(a => a.dataset.numero), res: [...frame.contentDocument.querySelectorAll('.mfc-boletim-resolucao p')].map(p => p.textContent) }));
    assert.match(impresso.nome, /Ana Júlia/); assert.equal(impresso.ids.length, 30);
    assert.deepEqual(impresso.res, esperadas.map(q => q.resolucao));
    const textoImpressao = normalizar(execFileSync('pdftotext', [pasta + '/impressao-exemplo.pdf', '-'], { encoding: 'utf8' }));
    for (const q of esperadas) for (const t of [q.enunciado, q.resolucao, `Resposta correta: ${q.correta}`]) assert.ok(textoImpressao.includes(normalizar(t)), `Impressão: ${q.id}`);
    const imagensPDF = execFileSync('pdfimages', ['-list', arquivo], { encoding: 'utf8' }).split('\n').filter(l => /^\s*\d+\s+\d+\s+image/.test(l)).length;
    assert.equal(imagensPDF, apresentadas.reduce((n, q) => n + q.svg, 0));
    await page.locator('iframe.mfc-frame-impressao').evaluate(frame => frame.contentWindow.dispatchEvent(new Event('afterprint')));
    assert.equal(await page.locator('iframe.mfc-frame-impressao').count(), 0);
    assert.equal(requests.every(r => r.method === 'GET' && !r.body && new URL(r.url).origin === new URL(url).origin), true);
    assert.equal(requests.some(r => /Ana|J%C3%BAlia/.test(r.url)), false);
    assert.deepEqual(await page.evaluate(() => [localStorage.length, sessionStorage.length]), [0, 0]);
    await page.getByRole('button', { name: 'Iniciar nova aplicação', exact: true }).click();
    assert.equal(await page.locator('[data-correcao]').count(), 0);
    assert.equal(await page.getByText('0 de 30 questões respondidas', { exact: true }).count(), 1);
    assert.equal(await page.getByRole('button', { name: 'Baixar PDF', exact: true }).count(), 0);
    await page.reload();
    await page.getByLabel('Nome do estudante (opcional)', { exact: true }).waitFor();
    assert.equal(await page.getByLabel('Nome do estudante (opcional)', { exact: true }).inputValue(), '');
    await iniciar(page);
    await page.getByRole('button', { name: 'Finalizar simulado', exact: true }).click();
    await page.getByRole('button', { name: 'Confirmar finalização', exact: true }).click();
    assert.equal(await page.locator('[data-nome-estudante]').count(), 0);
    assert.equal(await page.locator('[data-total-erros]').innerText(), '0');
    assert.equal(await page.locator('[data-total-branco]').innerText(), '30');
    const semNome = page.waitForEvent('download'); await page.getByRole('button', { name: 'Baixar PDF', exact: true }).click();
    await (await semNome).saveAs(pasta + '/boletim-sem-nome.pdf');
    const textoSemNome = execFileSync('pdftotext', [pasta + '/boletim-sem-nome.pdf', '-'], { encoding: 'utf8' });
    assert.equal(textoSemNome.includes('Nome do estudante:'), false);
    assert.deepEqual(erros, []);
    await writeFile(pasta + '/validacao.json', JSON.stringify({ questoesConferidas: 30, imagensPDF, acertos: 2, erros: 1, naoRespondidas: 27, ordemAlternativasResolucoes: 'conferidas contra a aplicação', requisicoesSomenteGETLocais: true, nomeOpcional: true, impressao: true }, null, 2));
  } finally { await context.close(); }
});


test('falha ao carregar fonte do PDF permite tentar novamente sem perder resultados', async () => {
  const { context, page, erros } = await abrir(320, 760);
  try {
    await iniciar(page);
    await page.getByRole('button', { name: 'Finalizar simulado', exact: true }).click();
    await page.getByRole('button', { name: 'Confirmar finalização', exact: true }).click();
    await page.route('**/fontes/DejaVuSans.ttf', route => route.fulfill({ status: 503, body: 'indisponível' }));
    await page.getByRole('button', { name: 'Baixar PDF', exact: true }).click();
    await page.getByText('Não foi possível preparar o boletim. Tente novamente ou consulte os resultados na tela.', { exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Baixar PDF', exact: true }).isEnabled(), true);
    assert.equal(await page.locator('[data-total-branco]').innerText(), '30');
    await page.unroute('**/fontes/DejaVuSans.ttf');
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Baixar PDF', exact: true }).click();
    assert.equal((await download).suggestedFilename(), 'boletim-matematicafc-6ano-bloco1.pdf');
    assert.deepEqual(erros, []);
  } finally { await context.close(); }
});
