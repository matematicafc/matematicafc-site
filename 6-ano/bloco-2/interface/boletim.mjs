import { calcularResultados } from './resultados.mjs';
import { copiar, congelar } from './util.mjs';

export function criarBoletim(aplicacao, { nome = '', data = new Date(), configuracao } = {}) {
  if (!configuracao?.assuntos || !configuracao.identificacao) throw new Error('Configuração do boletim ausente.');
  // A própria API bloqueia esta leitura antes da finalização.
  const correcao = aplicacao.obterCorrecao();
  const questoes = aplicacao.obterQuestoes();
  const resultado = calcularResultados(questoes, correcao, configuracao.assuntos.map(a=>a.codigo));
  const porId = new Map(correcao.map(c => [c.questaoId, c]));
  const instante = new Date(data);
  if (!Number.isFinite(instante.getTime())) throw new Error('Data de realização inválida.');
  return congelar({
    titulo: 'Boletim de Desempenho', marca: 'MatemáticaFC',
    aviso: configuracao.estado === 'revisao_pedagogica' ? 'Material em revisão pedagógica. Uso exclusivo para inspeção local.' : '',
    simulado: configuracao.identificacao,
    recomendacoes: resultado.assuntos.filter(a=>a.acertos<a.total).map(a=>({assunto:a.nome,texto:configuracao.assuntos.find(c=>c.codigo===a.codigo).recomendacao})),
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
