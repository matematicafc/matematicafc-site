import { prepararBanco } from './banco.mjs';
import { aleatorio } from './aleatorio.mjs';
import { selecionar, proximoParOito } from './selecao.mjs';
import { criarAplicacao } from './aplicacao.mjs';
import { congelar, ASSUNTOS } from './regras.mjs';
import { normalizarPar } from './historico.mjs';
export { carregarBanco } from './banco.mjs';
export { criarHistoricoLocal } from './historico.mjs';

export function criarMecanismo(blocos, { rng = aleatorio, historico = null, usoTeste = false } = {}) {
  const banco = prepararBanco(blocos, { usoTeste });
  let anterior = [], distribuicao = null, iniciada = false;
  return Object.freeze({
    novaAplicacao() {
      let contagens = {};
      try { contagens = historico?.ler() || {}; } catch { /* O histórico é opcional. */ }
      if (!iniciada) {
        try { anterior = normalizarPar(historico?.lerRotacao()); } catch { anterior = []; }
      }
      const par = proximoParOito(anterior, rng);
      const selecionadas = selecionar(banco, rng, contagens, par);
      const aplicacao = criarAplicacao(selecionadas, rng);
      anterior = par; iniciada = true;
      distribuicao = congelar(Object.fromEntries(ASSUNTOS.map(c => [c, par.includes(c) ? 8 : 7])));
      try { historico?.registrar(selecionadas.map(q => q.id), par); } catch { /* Não bloqueia a aplicação. */ }
      return aplicacao;
    },
    obterUltimaDistribuicao: () => distribuicao,
  });
}
