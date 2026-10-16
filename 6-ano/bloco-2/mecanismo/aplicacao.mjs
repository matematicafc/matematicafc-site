import { copiar, congelar } from './regras.mjs';
import { embaralhar } from './aleatorio.mjs';
export function criarAplicacao(selecionadas, rng) {
  const correcao = [], respostas = new Map();
  const questoes = congelar(selecionadas.map(q => {
    const opcoes = embaralhar(q.alternativas, rng).map((o, i) => ({ id: `${q.id}:opcao:${o.letra}`, letra: 'ABCD'[i], texto: o.texto }));
    const correta = opcoes.find(o => o.id === `${q.id}:opcao:${q.gabarito}`);
    correcao.push({ questaoId: q.id, opcaoCorretaId: correta.id, letraCorreta: correta.letra, resolucao: q.resolucao_comentada });
    // Projeção por lista explícita: nunca envia valor, erro comum, modelo ou gabarito.
    return { id: q.id, titulo: q.titulo, assunto: q.assunto, assuntoNome: q.assunto_nome,
      habilidade: q.habilidade, dificuldade: copiar(q.dificuldade), enunciado: q.enunciado,
      recursosVisuais: q.recursos_visuais.map(r => ({ tipo: r.tipo, html: r.html, css: r.css, descricao: r.acessibilidade })), alternativas: opcoes };
  }));
  const ids = new Map(questoes.map(q => [q.id, new Set(q.alternativas.map(o => o.id))]));
  let finalizada = false, resultado;
  function obterCorrecao() {
    if (!finalizada) throw new Error('A correção só é liberada após a finalização.');
    return resultado;
  }
  return Object.freeze({
    obterQuestoes: () => questoes,
    estaFinalizada: () => finalizada,
    responder(questaoId, opcaoId) {
      if (finalizada) throw new Error('Aplicação finalizada.');
      if (!ids.has(questaoId) || (opcaoId !== null && !ids.get(questaoId).has(opcaoId))) throw new Error('Questão ou alternativa não pertence à aplicação.');
      if (opcaoId === null) respostas.delete(questaoId); else respostas.set(questaoId, opcaoId);
    },
    obterRespostas: () => congelar(Object.fromEntries(respostas)),
    finalizar() {
      if (!finalizada) {
        resultado = congelar(correcao.map(q => ({ ...q, respostaId: respostas.get(q.questaoId) ?? null })));
        finalizada = true;
      }
      return obterCorrecao();
    },
    obterCorrecao,
  });
}
