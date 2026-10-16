export function congelar(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(congelar);Object.freeze(v);}return v;}
export function copiar(v){return JSON.parse(JSON.stringify(v));}
