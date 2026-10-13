import { prepararBanco } from './banco.mjs';
import { aleatorio } from './aleatorio.mjs';
import { selecionar } from './selecao.mjs';
import { criarAplicacao } from './aplicacao.mjs';
export { carregarBanco } from './banco.mjs';
export { criarHistoricoLocal } from './historico.mjs';
export function criarMecanismo(blocos, { rng = aleatorio, historico = null } = {}) {
  const banco = prepararBanco(blocos);
  let anterior = [];
  return Object.freeze({
    novaAplicacao() {
      let contagens = {};
      try { contagens = historico?.ler() || {}; } catch { /* Histórico é opcional. */ }
      const selecionadas = selecionar(banco, rng, contagens, anterior);
      const aplicacao = criarAplicacao(selecionadas, rng);
      anterior = selecionadas.map(q => q.id);
      // Conta apresentação, inclusive quando a tentativa for abandonada. Uma vez por criação.
      try { historico?.registrar(anterior); } catch { /* Falha de armazenamento não inviabiliza a seleção. */ }
      return aplicacao;
    },
  });
}
