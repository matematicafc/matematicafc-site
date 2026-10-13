import { calcularResultados } from './resultados.mjs';
import { copiar, congelar } from '../mecanismo/regras.mjs';

export function criarBoletim(aplicacao, { nome = '', data = new Date() } = {}) {
  // A própria API bloqueia esta leitura antes da finalização.
  const correcao = aplicacao.obterCorrecao();
  const questoes = aplicacao.obterQuestoes();
  const resultado = calcularResultados(questoes, correcao);
  const porId = new Map(correcao.map(c => [c.questaoId, c]));
  const instante = new Date(data);
  if (!Number.isFinite(instante.getTime())) throw new Error('Data de realização inválida.');
  return congelar({
    titulo: 'Boletim de Desempenho', marca: 'MatemáticaFC',
    simulado: '6º ano, Bloco 1 — Números e Operações',
    nome: String(nome).normalize('NFC').trim().replace(/\s+/g, ' ').slice(0, 120),
    dataISO: instante.toISOString(),
    dataFormatada: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(instante),
    resultado,
    questoes: questoes.map((q, i) => {
      const c = porId.get(q.id);
      const escolhida = q.alternativas.find(o => o.id === c.respostaId);
      const correta = q.alternativas.find(o => o.id === c.opcaoCorretaId);
      return { numero: i + 1, ...copiar(q), escolhida: escolhida ? copiar(escolhida) : null,
        correta: copiar(correta), resolucao: c.resolucao,
        situacao: !escolhida ? 'Não respondida' : escolhida.id === correta.id ? 'Correta' : 'Incorreta' };
    }),
  });
}
