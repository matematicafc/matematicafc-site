import { CONFIGURACAO } from '../configuracao.mjs';
export { CONFIGURACAO };
export const BANCO_ID = CONFIGURACAO.bancoId;
export const ARQUIVOS = Object.freeze(CONFIGURACAO.assuntos.map(a => a.arquivo));
export const ASSUNTOS = Object.freeze(CONFIGURACAO.assuntos.map(a => a.codigo));
export const NIVEIS = CONFIGURACAO.niveis;
export const COTAS = CONFIGURACAO.cotas;
export const MINIMO_VISUAL_ASSUNTO = CONFIGURACAO.minimoVisualAssunto;
export const MINIMO_VISUAL_TOTAL = CONFIGURACAO.minimoVisualTotal;
export function congelar(valor) {
  if (valor && typeof valor === 'object' && !Object.isFrozen(valor)) {
    Object.values(valor).forEach(congelar); Object.freeze(valor);
  }
  return valor;
}
export function copiar(valor) { return JSON.parse(JSON.stringify(valor)); }
