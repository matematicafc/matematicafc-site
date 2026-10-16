import { BANCO_ID, ASSUNTOS } from './regras.mjs';
export const CHAVE_HISTORICO = `${BANCO_ID}:historico-selecao:v1`;
export function idPermitido(id) { return /^MFC6-B2-I-(EA|IP|PC|AR)-(0[1-9]|1[0-9]|2[0-5])$/.test(id); }
export function normalizarHistorico(valor) {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return {};
  return Object.fromEntries(Object.entries(valor).filter(([id, n]) => idPermitido(id) && Number.isSafeInteger(n) && n >= 0));
}
export function normalizarPar(valor) {
  return Array.isArray(valor) && valor.length === 2 && new Set(valor).size === 2 && valor.every(c => ASSUNTOS.includes(c)) ? [...valor] : [];
}
// Somente contagens e o último par de oito. Nunca nome ou respostas do estudante.
// A persistência exige fornecer explicitamente o armazenamento; não é ativada pela interface.
export function criarHistoricoLocal(storage) {
  let memoria = {}, par = [], erro = null;
  function lerEstado() {
    try {
      const texto = storage.getItem(CHAVE_HISTORICO);
      if (texto !== null) {
        const dados = JSON.parse(texto);
        memoria = normalizarHistorico(dados?.contagens);
        par = normalizarPar(dados?.ultimoParOito);
      }
      erro = null;
    } catch (e) { erro = String(e.message || e); }
  }
  return Object.freeze({
    ler() { lerEstado(); return { ...memoria }; },
    lerRotacao() { lerEstado(); return [...par]; },
    registrar(ids, ultimoParOito) {
      lerEstado();
      for (const id of new Set(ids.filter(idPermitido))) memoria[id] = Math.min(Number.MAX_SAFE_INTEGER, (memoria[id] || 0) + 1);
      par = normalizarPar(ultimoParOito);
      try { storage.setItem(CHAVE_HISTORICO, JSON.stringify({ versao: 1, contagens: memoria, ultimoParOito: par })); erro = null; }
      catch (e) { erro = String(e.message || e); }
    },
    obterErro() { return erro; },
  });
}
