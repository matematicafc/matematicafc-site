// Recursos estáticos do banco: XML inerte, lista permitida e construção via DOM.
// Não modifica o banco e não aceita HTML genérico fornecido por estudantes.
const SVG = 'http://www.w3.org/2000/svg';
const SVG_TAGS = new Set(['svg', 'title', 'desc', 'rect', 'text', 'defs', 'pattern', 'circle', 'line', 'path']);
const TABLE_TAGS = new Set(['table', 'caption', 'thead', 'tbody', 'tr', 'th', 'td', 'span']);
const ATTRS = new Set(['viewBox', 'role', 'aria-label', 'aria-hidden', 'width', 'height', 'fill', 'x', 'y',
  'font-family', 'font-size', 'text-anchor', 'rx', 'stroke', 'id', 'patternUnits', 'cx', 'cy', 'r',
  'data-pintada', 'data-marcacao-acessivel', 'x1', 'x2', 'y1', 'y2', 'stroke-width', 'data-subdivisao',
  'class', 'scope', 'data-rotulo', 'data-ciclo', 'd', 'stroke-dasharray', 'data-tira', 'data-fita',
  'data-valor', 'data-regua', 'data-plano', 'data-marca', 'data-posicao']);
const NUMERICOS = new Set(['viewBox', 'width', 'height', 'x', 'y', 'font-size', 'rx', 'cx', 'cy', 'r',
  'x1', 'x2', 'y1', 'y2', 'stroke-width', 'stroke-dasharray']);
const ID = /^[A-Za-z][A-Za-z0-9_.:-]*$/;
function rejeitar(motivo) { throw new Error(`Recurso visual não permitido: ${motivo}.`); }

export function criarRecursoSeguro(recurso, destino = document) {
  if (!recurso || !['svg', 'tabela_html'].includes(recurso.tipo) || typeof recurso.html !== 'string') rejeitar('tipo ou conteúdo');
  // Não permitir DTD, entidades definidas pelo documento ou instruções de processamento.
  if (/<!DOCTYPE|<!ENTITY|<\?/i.test(recurso.html)) rejeitar('declaração XML');
  // O parser XML não cria contexto HTML ativo nem carrega imagens/iframes HTML.
  const xml = new DOMParser().parseFromString(recurso.html, 'application/xml');
  if (xml.getElementsByTagName('parsererror').length) rejeitar('XML inválido');
  const raiz = xml.documentElement;
  const svg = recurso.tipo === 'svg';
  const tags = svg ? SVG_TAGS : TABLE_TAGS;
  if (raiz.localName !== (svg ? 'svg' : 'table')) rejeitar('elemento principal');
  const elementos = [raiz, ...raiz.querySelectorAll('*')], ids = new Map(), referencias = [];
  for (const node of elementos) {
    if (!tags.has(node.localName) || node.prefix || node.namespaceURI !== (svg ? SVG : null)) rejeitar('elemento ou namespace');
    for (const attr of node.attributes) {
      if (attr.name === 'xmlns' && node === raiz && svg && attr.value === SVG) continue;
      if (attr.namespaceURI || !ATTRS.has(attr.name)) rejeitar(`atributo ${attr.name}`);
      const valor = attr.value;
      if (NUMERICOS.has(attr.name) && !/^[0-9eE+.,\s-]+$/.test(valor)) rejeitar('medida');
      if (attr.name === 'id') {
        if (!ID.test(valor) || ids.has(valor)) rejeitar('identificador');
        ids.set(valor, node);
      }
      if (['fill', 'stroke'].includes(attr.name)) {
        const ref = /^url\(#([A-Za-z][A-Za-z0-9_.:-]*)\)$/.exec(valor);
        if (ref) referencias.push(ref[1]);
        else if (!/^(?:none|#[0-9a-f]{3}|#[0-9a-f]{6})$/i.test(valor)) rejeitar('cor ou referência');
      }
      if (attr.name === 'font-family' && !/^[A-Za-z,\s-]+$/.test(valor)) rejeitar('fonte');
      if (attr.name === 'd' && !/^[MmLlHhVvCcSsQqTtAaZz0-9eE+.,\s-]+$/.test(valor)) rejeitar('trajeto');
      if (attr.name === 'patternUnits' && !['userSpaceOnUse', 'objectBoundingBox'].includes(valor)) rejeitar('unidade de padrão');
    }
  }
  for (const ref of referencias) if (ids.get(ref)?.localName !== 'pattern') rejeitar('referência de padrão ausente');
  function construir(node) {
    if (node.nodeType === 3) return destino.createTextNode(node.data);
    if (node.nodeType !== 1) rejeitar('nó não permitido');
    const novo = svg ? destino.createElementNS(SVG, node.localName) : destino.createElement(node.localName);
    for (const attr of node.attributes) novo.setAttribute(attr.name, attr.value);
    for (const filho of node.childNodes) novo.append(construir(filho));
    return novo;
  }
  return construir(raiz);
}
