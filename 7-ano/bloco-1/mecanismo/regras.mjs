import { CONFIGURACAO as c } from '../configuracao.mjs';
export { copiar, congelar } from '../../../compartilhado/simulados/v1/util.mjs';
export const BANCO_ID=c.bancoId;
export const PREFIXO_ID=c.prefixoId;
export const ARQUIVOS=Object.freeze(c.assuntos.map(a=>a.arquivo));
export const ASSUNTOS=Object.freeze(c.assuntos.map(a=>a.codigo));
export const NIVEIS=c.niveis;
export const COTAS=Object.freeze(Object.fromEntries(c.assuntos.map(a=>[a.codigo,a.cotas])));
export const MINIMO_VISUAL_ASSUNTO=c.minimoVisualAssunto;
