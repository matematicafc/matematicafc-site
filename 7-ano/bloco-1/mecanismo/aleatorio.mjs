// Fonte injetável para testes; no navegador, usa Web Crypto quando disponível.
export function aleatorio() {
  if (globalThis.crypto?.getRandomValues) {
    return globalThis.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
  }
  return Math.random();
}
export function indice(tamanho, rng) {
  const valor = rng();
  if (!Number.isFinite(valor) || valor < 0 || valor >= 1) throw new Error('Fonte aleatória deve retornar um número em [0, 1).');
  return Math.floor(valor * tamanho);
}
export function embaralhar(itens, rng) {
  const resultado = [...itens];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = indice(i + 1, rng);
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}
