import { BANCO_ID } from './regras.mjs';
const CHAVE = `${BANCO_ID}:historico-selecao:v1`;
export function normalizarHistorico(valor) {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return {};
  return Object.fromEntries(Object.entries(valor).filter(([id, n]) => /^MFC7-B1-I-(DP|NI|OI|FR|NR)-(0[1-9]|1[0-9]|20)$/.test(id) && Number.isSafeInteger(n) && n >= 0));
}
// Ativação explícita: o chamador fornece localStorage; não acessamos dados pessoais.
export function criarHistoricoLocal(storage, chave = CHAVE) {
  let memoria = {}, erro = null;
  return Object.freeze({
    ler() {
      try {
        const texto = storage.getItem(chave);
        if (texto !== null) memoria = normalizarHistorico(JSON.parse(texto));
        erro = null;
      } catch (e) { erro = String(e.message || e); }
      return { ...memoria };
    },
    registrar(ids) {
      this.ler();
      for (const id of new Set(ids)) memoria[id] = Math.min(Number.MAX_SAFE_INTEGER, (memoria[id] || 0) + 1);
      try { storage.setItem(chave, JSON.stringify(memoria)); erro = null; }
      catch (e) { erro = String(e.message || e); }
    },
    obterErro() { return erro; },
  });
}
