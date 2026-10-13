import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { criarMecanismo, criarHistoricoLocal, carregarBanco } from '../index.mjs';
import { prepararBanco } from '../banco.mjs';
import { selecionar } from '../selecao.mjs';
import { ARQUIVOS, ASSUNTOS, COTAS, NIVEIS } from '../regras.mjs';

const blocos = await Promise.all(ARQUIVOS.map(f => readFile(new URL(`../../banco-inedito/${f}`, import.meta.url), 'utf8').then(JSON.parse)));
const fonte = new Map(blocos.flatMap(b => b.questoes.map(q => [q.id, q])));
function rngSemente(seed) {
  let estado = seed >>> 0;
  return () => { estado = (Math.imul(1664525, estado) + 1013904223) >>> 0; return estado / 4294967296; };
}
function semCorrecao(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const [key, value] of Object.entries(obj)) {
    assert.ok(!['gabarito', 'resolucao', 'resolucao_comentada', 'erro_comum', 'valor', 'modelo_verificacao', 'opcaoCorretaId'].includes(key), key);
    semCorrecao(value);
  }
}
function conferir(app) {
  const qs = app.obterQuestoes();
  assert.equal(qs.length, 30);
  assert.equal(new Set(qs.map(q => q.id)).size, 30);
  assert.equal(new Set(qs.map(q => fonte.get(q.id).sorteio.grupo_equivalencia)).size, 30);
  assert.ok(qs.filter(q => q.recursosVisuais.length).length >= 15);
  for (const c of ASSUNTOS) {
    const sub = qs.filter(q => q.assunto === c);
    assert.equal(sub.length, 6);
    assert.ok(sub.filter(q => q.recursosVisuais.length).length >= 3);
    assert.deepEqual(NIVEIS.map(n => sub.filter(q => q.dificuldade.nivel === n).length), COTAS[c]);
  }
  assert.deepEqual(NIVEIS.map(n => qs.filter(q => q.dificuldade.nivel === n).length), [8, 14, 8]);
  assert.throws(() => app.obterCorrecao(), /finalização/);
  semCorrecao(qs);
  const snapshot = JSON.stringify(qs);
  for (const q of qs) {
    assert.deepEqual(q.alternativas.map(o => o.letra), [...'ABCD']);
    assert.equal(new Set(q.alternativas.map(o => o.id)).size, 4);
    const original = fonte.get(q.id);
    for (const o of q.alternativas) {
      const ref = original.alternativas.find(a => o.id === `${q.id}:opcao:${a.letra}`);
      assert.ok(ref); assert.equal(o.texto, ref.texto);
    }
    app.responder(q.id, q.alternativas[0].id);
    app.responder(q.id, q.alternativas[1].id);
    assert.equal(app.obterRespostas()[q.id], q.alternativas[1].id);
  }
  assert.equal(JSON.stringify(app.obterQuestoes()), snapshot);
  const correcao = app.finalizar();
  assert.equal(correcao.length, 30);
  for (const c of correcao) {
    const original = fonte.get(c.questaoId), q = qs.find(q => q.id === c.questaoId);
    assert.equal(c.opcaoCorretaId, `${original.id}:opcao:${original.gabarito}`);
    assert.equal(q.alternativas.find(o => o.id === c.opcaoCorretaId).letra, c.letraCorreta);
    assert.equal(c.resolucao, original.resolucao_comentada);
    assert.equal(c.respostaId, q.alternativas[1].id);
  }
  assert.equal(app.finalizar(), correcao);
  assert.equal(app.obterCorrecao(), correcao);
  assert.equal(JSON.stringify(app.obterQuestoes()), snapshot);
  assert.throws(() => app.responder(qs[0].id, qs[0].alternativas[0].id), /finalizada/);
  return qs;
}

test('10.000 aplicações: cotas, visuais, unicidade, estabilidade e correção', () => {
  const mecanismo = criarMecanismo(blocos, { rng: rngSemente(20261013) });
  let minimo = 30, maximo = 0, soma = 0, anterior;
  const gabaritos = { A: 0, B: 0, C: 0, D: 0 }, conjuntos = new Set(), permutacoes = new Set(), ordens = new Set();
  for (let i = 0; i < 10000; i++) {
    const app = mecanismo.novaAplicacao(), qs = conferir(app);
    const visuais = qs.filter(q => q.recursosVisuais.length).length;
    minimo = Math.min(minimo, visuais); maximo = Math.max(maximo, visuais); soma += visuais;
    const chave = qs.map(q => q.id).sort().join('|');
    assert.notEqual(chave, anterior); anterior = chave; conjuntos.add(chave);
    ordens.add(qs.map(q => q.assunto).join('|'));
    for (const q of qs) permutacoes.add(q.alternativas.map(o => o.id.split(':').at(-1)).join(''));
    for (const c of app.obterCorrecao()) gabaritos[c.letraCorreta]++;
  }
  assert.equal(permutacoes.size, 24); assert.ok(ordens.size > 1);
  console.log(JSON.stringify({ aplicacoes: 10000, selecoes: 300000, visuais: { minimo, maximo, media: soma / 10000 }, dificuldadesPorAplicacao: [8, 14, 8], questoesPorAssunto: 6, conjuntosDistintos: conjuntos.size, permutacoes: permutacoes.size, gabaritos, violacoes: 0 }));
});

test('aprovação, identidade do banco e inviabilidade: falhar sem relaxar regras', () => {
  const mudar = fn => { const b = structuredClone(blocos); fn(b); return b; };
  assert.throws(() => criarMecanismo(mudar(b => b[0].questoes[0].revisao_pedagogica.status = 'pendente')));
  assert.throws(() => criarMecanismo(mudar(b => b[0].banco_id = 'BANCO-ANTIGO')));
  assert.throws(() => criarMecanismo(mudar(b => b[0].questoes[1].id = b[0].questoes[0].id)));
  assert.throws(() => criarMecanismo(mudar(b => b[0].questoes[0].alternativas.pop())));
  assert.throws(() => criarMecanismo(mudar(b => b[0].questoes[0].sorteio.visual_relevante = false)));
  assert.throws(() => criarMecanismo(mudar(b => b[0].questoes.forEach(q => { q.dificuldade.nivel = 'facil'; q.sorteio.nivel = 'facil'; }))));
  assert.throws(() => criarMecanismo(blocos, { rng: () => 1 }).novaAplicacao(), /aleatória/);
});

test('respostas inválidas, limpeza, imutabilidade e finalização sem respostas', () => {
  const mecanismo = criarMecanismo(blocos, { rng: rngSemente(7) });
  const app = mecanismo.novaAplicacao(), qs = app.obterQuestoes();
  assert.throws(() => app.responder('inexistente', null));
  assert.throws(() => app.responder(qs[0].id, qs[1].alternativas[0].id));
  app.responder(qs[0].id, qs[0].alternativas[0].id); app.responder(qs[0].id, null);
  assert.deepEqual(app.obterRespostas(), {});
  assert.throws(() => qs.reverse(), TypeError);
  assert.throws(() => qs[0].alternativas[0].texto = 'alterado', TypeError);
  assert.ok(app.finalizar().every(c => c.respostaId === null));
});

test('histórico opcional prioriza inéditas e menor uso sem violar cotas', () => {
  const banco = prepararBanco(blocos), preferido = banco.conjuntos.SN[0];
  const contagens = Object.fromEntries(blocos.flatMap(b => b.questoes.map(q => [q.id, 50])));
  preferido.forEach(q => contagens[q.id] = 0);
  const selecionadas = selecionar(banco, rngSemente(1), contagens);
  assert.deepEqual(selecionadas.filter(q => q.assunto === 'SN').map(q => q.id).sort(), preferido.map(q => q.id).sort());
  // Sem inéditas, o conjunto de menor uso continua sendo preferido.
  preferido.forEach(q => contagens[q.id] = 1);
  assert.deepEqual(selecionar(banco, rngSemente(1), contagens).filter(q => q.assunto === 'SN').map(q => q.id).sort(), preferido.map(q => q.id).sort());
  let registro = null;
  const storage = { getItem: () => registro, setItem: (_, valor) => { registro = valor; } };
  const historico = criarHistoricoLocal(storage), mecanismo = criarMecanismo(blocos, { rng: rngSemente(42), historico });
  for (let i = 0; i < 100; i++) conferir(mecanismo.novaAplicacao());
  assert.equal(Object.values(JSON.parse(registro)).reduce((a, b) => a + b, 0), 3000);
  const recarregado = criarHistoricoLocal(storage);
  assert.deepEqual(recarregado.ler(), historico.ler());
  assert.equal(historico.obterErro(), null);
});

test('histórico corrompido ou bloqueado não impede aplicação', () => {
  const storage = { getItem: () => '{inválido', setItem: () => { throw new Error('quota'); } };
  const historico = criarHistoricoLocal(storage);
  assert.deepEqual(historico.ler(), {});
  conferir(criarMecanismo(blocos, { rng: rngSemente(99), historico }).novaAplicacao());
  assert.ok(historico.obterErro());
  assert.equal(Object.values(historico.ler()).reduce((a, b) => a + b, 0), 30);
  conferir(criarMecanismo(blocos, { historico: { ler() { throw new Error('bloqueado'); }, registrar() { throw new Error('bloqueado'); } } }).novaAplicacao());
});

test('novas aplicações diferentes mesmo com fonte constante; sessões anteriores intactas', () => {
  const mecanismo = criarMecanismo(blocos, { rng: () => 0 });
  const primeira = mecanismo.novaAplicacao(), original = JSON.stringify(primeira.obterQuestoes());
  const segunda = mecanismo.novaAplicacao();
  assert.notDeepEqual(primeira.obterQuestoes().map(q => q.id).sort(), segunda.obterQuestoes().map(q => q.id).sort());
  assert.equal(JSON.stringify(primeira.obterQuestoes()), original);
  conferir(primeira); conferir(segunda);
});

test('carregamento somente dos cinco arquivos inéditos e erros de leitura', async () => {
  const chamadas = [];
  const lidos = await carregarBanco('/banco-inedito/', async url => {
    chamadas.push(url); return { ok: true, json: async () => blocos[ARQUIVOS.indexOf(url.split('/').at(-1))] };
  });
  assert.deepEqual(chamadas, ARQUIVOS.map(f => '/banco-inedito/' + f));
  assert.equal(lidos.length, 5);
  await assert.rejects(carregarBanco('/banco-inedito', async () => ({ ok: false, status: 404 })), /404/);
});

test('manifesto e implementação têm as mesmas cotas; banco de entrada preservado', async () => {
  const manifesto = JSON.parse(await readFile(new URL('../../banco-inedito/manifesto.json', import.meta.url), 'utf8'));
  for (const c of ASSUNTOS) assert.deepEqual(NIVEIS.map(n => manifesto.regras_selecao.dificuldade_por_assunto[c][n]), COTAS[c]);
  assert.deepEqual(manifesto.regras_selecao.dificuldade_total, { facil: 8, media: 14, dificil: 8 });
  assert.equal(manifesto.regras_selecao.minimo_visuais_por_assunto, 3);
  const snapshot = JSON.stringify(blocos), mecanismo = criarMecanismo(blocos, { rng: rngSemente(123) });
  conferir(mecanismo.novaAplicacao()); assert.equal(JSON.stringify(blocos), snapshot);
});
