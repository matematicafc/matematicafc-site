export const BANCO_ID = 'MFC6-B1-INEDITO-V1';
export const ARQUIVOS = Object.freeze(['sistema-numeracao.json', 'operacoes.json', 'multiplos-divisores.json', 'fracoes.json', 'decimais.json']);
export const ASSUNTOS = Object.freeze(['SN', 'ON', 'MD', 'FR', 'ND']);
export const NIVEIS = Object.freeze(['facil', 'media', 'dificil']);
export const COTAS = Object.freeze(Object.fromEntries([
  ['SN', [2, 3, 1]], ['ON', [2, 2, 2]], ['MD', [1, 3, 2]], ['FR', [2, 3, 1]], ['ND', [1, 3, 2]],
].map(([codigo, cotas]) => [codigo, Object.freeze(cotas)])));
export const MINIMO_VISUAL_ASSUNTO = 3;
export function congelar(valor) {
  if (valor && typeof valor === 'object' && !Object.isFrozen(valor)) {
    Object.values(valor).forEach(congelar);
    Object.freeze(valor);
  }
  return valor;
}
export function copiar(valor) { return JSON.parse(JSON.stringify(valor)); }
