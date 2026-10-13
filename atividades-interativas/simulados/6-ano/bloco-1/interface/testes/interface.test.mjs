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
