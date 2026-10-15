import { formatarPercentual } from './resultados.mjs';
import { criarRecursoSeguro } from './recursos.mjs';
import { carregarBanco as carregarBancoPadrao, criarMecanismo as criarMecanismoPadrao } from '../mecanismo/index.mjs';
import { CONFIGURACAO } from '../configuracao.mjs';

import { criarBoletim } from './boletim.mjs';
import { imprimirBoletim } from './impressao.mjs';

let numeroMontagem = 0;

function elemento(tag, atributos = {}, filhos = []) {
  const node = document.createElement(tag);
  for (const [nome, valor] of Object.entries(atributos)) {
    if (nome === 'texto') node.textContent = valor;
    else if (nome === 'classe') node.className = valor;
    else if (valor !== false && valor != null) node.setAttribute(nome, valor === true ? '' : String(valor));
  }
  node.append(...filhos);
  return node;
}
function botao(texto, executar, atributos = {}) {
  const node = elemento('button', { type: 'button', texto, ...atributos });
  node.addEventListener('click', executar); return node;
}
function recursos(q, destino) {
  for (const r of q.recursosVisuais) {
    const figura = elemento('div', { classe: 'mfc-recurso' });
    figura.append(criarRecursoSeguro(r));
    if (!figura.querySelector('svg, table')) figura.setAttribute('aria-label', r.descricao);
    destino.append(figura);
  }
}
export async function montarSimulado(container, { baseBanco = new URL('../banco-inedito/', import.meta.url), buscar = globalThis.fetch, carregarBanco = carregarBancoPadrao, criarMecanismo = criarMecanismoPadrao, configuracao = CONFIGURACAO, modoRevisao = false } = {}) {
  if (!configuracao || !carregarBanco || !criarMecanismo || !baseBanco) throw new Error('Configuração da aplicação incompleta.');
  if (!container) throw new Error('Contêiner do simulado não encontrado.');
  container.classList.add('mfc-simulado');
  let mecanismo, aplicacao, questoes, indice = 0, correcao, contador, progresso, mapa, campoNome, nome = '', boletim;
  const marca = elemento('header', { classe: 'mfc-brand' }, [elemento('img', { classe: 'mfc-logo', src: new URL('./imagens/favicon-matematicafc.ico', import.meta.url).href, alt: '', width: 44, height: 44, 'aria-hidden': 'true' }), elemento('span', { texto: 'MatemáticaFC' })]);
  const main = elemento('main');
  const status = elemento('p', { classe: 'mfc-status', role: 'status', 'aria-live': 'polite' });
  const dialog = elemento('dialog', { 'aria-labelledby': 'mfc-confirmar-titulo-' + ++numeroMontagem });
  const dialogTitulo = elemento('h2', { id: dialog.getAttribute('aria-labelledby'), texto: 'Finalizar simulado?' });
  const dialogAviso = elemento('p', { id: `mfc-confirmar-aviso-${numeroMontagem}` });
  dialog.setAttribute('aria-describedby', dialogAviso.id);
  let origemDialogo;
  dialog.addEventListener('close', () => {
    if (container.dataset.etapa === 'aplicacao' && origemDialogo?.isConnected) origemDialogo.focus();
  });
  const cancelar = botao('Continuar respondendo', () => dialog.close());
  const confirmar = botao('Confirmar finalização', () => {
    if (aplicacao.estaFinalizada()) return;
    dialog.close();
    correcao = aplicacao.finalizar();
    mostrarResultado();
  }, { classe: 'mfc-primary' });
  dialog.append(dialogTitulo, dialogAviso, elemento('div', { classe: 'mfc-dialog-buttons' }, [cancelar, confirmar]));
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controles = [...dialog.querySelectorAll('button:not([disabled])')];
    const primeiro = controles[0], ultimo = controles.at(-1);
    if (event.shiftKey && document.activeElement === primeiro) {
      event.preventDefault(); ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault(); primeiro.focus();
    }
  });
  // O aviso fica em região identificada, fora da área substituída a cada questão.
  const aviso = modoRevisao ? elemento('aside', { 'aria-label':'Estado de revisão pedagógica' }, [elemento('p', {classe:'mfc-revisao-aviso',role:'note',texto:'Versão para revisão pedagógica — questões pendentes. Uso somente em inspeção local.'})]) : null;
  container.replaceChildren(marca, ...(aviso ? [aviso] : []), main, status, dialog);

  function mostrarInicio() {
    container.dataset.etapa = 'inicio';
    const nomeId = `mfc-nome-${numeroMontagem}`;
    campoNome = elemento('input', { id: nomeId, type: 'text', maxlength: 120, autocomplete: 'off', 'aria-describedby': `${nomeId}-ajuda` });
    const identificacao = elemento('div', { classe: 'mfc-identificacao' }, [
      elemento('label', { for: nomeId, texto: 'Nome do estudante (opcional)' }), campoNome,
      elemento('p', { id: `${nomeId}-ajuda`, classe: 'mfc-note', texto: 'Usado apenas para personalizar seu boletim. Você pode começar sem preencher. Nome e resultados ficam somente no navegador.' }),
    ]);
    const iniciar = botao('Iniciar simulado', iniciarAplicacao, { classe: 'mfc-primary', disabled: true });
    const textoCarga = elemento('p', { classe: 'mfc-note', role:'status', texto: 'Preparando as questões…' });
    const card = elemento('section', { classe: 'mfc-card mfc-intro' }, [
      elemento('p', { classe: 'mfc-kicker', texto: `Simulado • ${configuracao.ano}º ano` }),
      elemento('h1', { texto: configuracao.titulo }),
      elemento('p', { classe: 'mfc-subtitle', texto: 'Leia, pense e escolha seu caminho. Ao terminar, confira suas respostas e as explicações.' }),
      elemento('div', { classe: 'mfc-pills' }, [elemento('span', { classe: 'mfc-pill', texto: '30 questões' }), elemento('span', { classe: 'mfc-pill', texto: '5 assuntos' }), elemento('span', { classe: 'mfc-pill', texto: 'Sem login' })]),
      elemento('ul', {}, [
        elemento('li', { texto: 'Escolha uma alternativa por questão. Você pode mudar suas respostas antes de finalizar.' }),
        elemento('li', { texto: 'Use Anterior, Próxima ou os números para navegar. As questões respondidas serão identificadas.' }),
        elemento('li', { texto: 'O resultado e o gabarito comentado aparecem somente depois da finalização.' }),
      ]), identificacao, iniciar, textoCarga,
      elemento('p', { classe: 'mfc-note', texto: 'Suas respostas ficam nesta página. Recarregar ou fechar a página encerra a aplicação atual.' }),
    ]);
    main.replaceChildren(card);
    return { iniciar, textoCarga, card };
  }
  async function preparar() {
    const inicio = mostrarInicio();
    try {
      const blocos = await carregarBanco(baseBanco, buscar);
      mecanismo = criarMecanismo(blocos, { modoRevisao });
      inicio.iniciar.disabled = false;
      inicio.textoCarga.textContent = 'Tudo pronto para começar.';
    } catch (erro) {
      const pendente = String(erro?.message).includes('pendente');
      inicio.textoCarga.textContent = pendente ? 'Este banco aguarda revisão pedagógica e ainda não está disponível para aplicação.' : 'Não foi possível carregar as questões. Confira sua conexão e tente novamente.';
      if (!pendente) inicio.card.append(botao('Tentar novamente', preparar));
      status.textContent = pendente ? 'Aplicação bloqueada: revisão pedagógica pendente.' : 'Falha no carregamento das questões.';
    }
  }
  function iniciarAplicacao() {
    nome = campoNome.value; boletim = null;
    aplicacao = mecanismo.novaAplicacao();
    questoes = aplicacao.obterQuestoes(); indice = 0; correcao = null;
    container.dataset.etapa = 'aplicacao'; status.textContent = '';
    mostrarQuestao();
  }
  function atualizarProgresso() {
    const respostas = aplicacao.obterRespostas();
    const total = Object.keys(respostas).length;
    contador.textContent = `${total} de 30 questões respondidas`;
    progresso.value = total;
    mapa.querySelectorAll('button').forEach((b, i) => {
      const respondida = Boolean(respostas[questoes[i].id]);
      b.dataset.respondida = String(respondida);
      b.setAttribute('aria-label', `Questão ${i + 1}, ${respondida ? 'respondida' : 'não respondida'}`);
      b.querySelector('.mfc-marca-resposta').textContent = respondida ? '✓' : '';
    });
  }
  function navegar(destino) {
    if (destino < 0 || destino >= questoes.length) return;
    indice = destino; status.textContent = ''; mostrarQuestao();
  }
  function pedirFinalizacao(event) {
    origemDialogo = event?.currentTarget || document.activeElement;
    const faltam = questoes.length - Object.keys(aplicacao.obterRespostas()).length;
    dialogAviso.textContent = faltam
      ? `Ainda ${faltam === 1 ? 'há 1 questão sem resposta' : `há ${faltam} questões sem resposta`}. Elas serão consideradas sem acerto. Deseja finalizar mesmo assim? Depois, você não poderá alterar as respostas.`
      : 'Você respondeu às 30 questões. Depois da finalização, não poderá alterar as respostas. Deseja continuar?';
    dialog.showModal(); cancelar.focus();
  }
  function mostrarQuestao() {
    const q = questoes[indice];
    contador = elemento('p', { 'aria-live': 'polite' });
    progresso = elemento('progress', { max: 30, value: 0, 'aria-label': 'Progresso de respostas' });
    const toolbar = elemento('div', { classe: 'mfc-toolbar' }, [elemento('div', {}, [contador, progresso]), botao('Finalizar simulado', pedirFinalizacao)]);
    const questaoId = `mfc-questao-${numeroMontagem}-${indice + 1}`;
    const heading = elemento('h1', { id: `${questaoId}-titulo`, classe: 'mfc-question-heading', tabindex: -1, texto: `Questão ${indice + 1} de 30` });
    const card = elemento('article', { classe: 'mfc-card', 'data-questao-id': q.id, 'aria-labelledby': `${questaoId}-titulo ${questaoId}-tema` }, [
      elemento('p', { classe: 'mfc-pill', texto: q.assuntoNome }), heading,
      elemento('h2', { id:`${questaoId}-tema`, classe:'mfc-titulo-problema', texto: q.titulo }), elemento('p', { id:`${questaoId}-enunciado`, classe: 'mfc-enunciado', texto: q.enunciado }),
    ]);
    recursos(q, card);
    const fieldset = elemento('fieldset', { 'aria-describedby': `${questaoId}-enunciado` }, [elemento('legend', { texto: 'Escolha uma alternativa:' })]);
    const resposta = aplicacao.obterRespostas()[q.id];
    for (const o of q.alternativas) {
      const radio = elemento('input', { type: 'radio', name: q.id, value: o.id, checked: o.id === resposta });
      radio.addEventListener('change', () => {
        aplicacao.responder(q.id, o.id); atualizarProgresso(); status.textContent = `Resposta da questão ${indice + 1} registrada.`;
      });
      fieldset.append(elemento('label', { classe: 'mfc-option' }, [radio, elemento('span', { classe: 'mfc-letter', texto: `${o.letra})` }), elemento('span', { texto: o.texto })]));
    }
    card.append(fieldset, botao('Limpar resposta', () => {
      aplicacao.responder(q.id, null); fieldset.querySelectorAll('input').forEach(r => r.checked = false); atualizarProgresso(); status.textContent = `Resposta da questão ${indice + 1} removida.`;
    }), elemento('div', { classe: 'mfc-nav-actions' }, [botao('Anterior', () => navegar(indice - 1), { disabled: indice === 0 }), botao('Próxima', () => navegar(indice + 1), { disabled: indice === questoes.length - 1, classe: 'mfc-primary' })]));
    mapa = elemento('nav', { classe: 'mfc-card mfc-question-map', 'aria-label': 'Navegação pelas questões' }, [elemento('h2', { texto: 'Ir para a questão' })]);
    const numeros = elemento('div', { classe: 'mfc-numbers' });
    for (let i = 0; i < questoes.length; i++) {
      const b = botao('', () => navegar(i), { 'aria-current': i === indice ? 'step' : null });
      b.append(elemento('span', {classe:'mfc-numero-questao',texto:String(i+1)}), elemento('span', { classe:'mfc-marca-resposta', 'aria-hidden':'true' }), ...(i === indice ? [elemento('span', {classe:'mfc-marca-atual', 'aria-hidden':'true', texto:'Atual'})] : []));
      numeros.append(b);
    }
    mapa.append(numeros, elemento('p', { classe: 'mfc-legend', texto:'✓: respondida. Sem ✓: não respondida. “Atual”: questão em exibição.' }));
    main.replaceChildren(toolbar, elemento('div', { classe: 'mfc-layout' }, [card, mapa]));
    atualizarProgresso(); heading.focus({ preventScroll: true }); container.scrollIntoView({ block: 'start' });
  }
  function mostrarResultado() {
    container.dataset.etapa = 'resultado'; status.textContent = 'Simulado finalizado. Resultado disponível.';
    boletim = criarBoletim(aplicacao, { nome, configuracao });
    const resultado = boletim.resultado;
    const heading = elemento('h1', { tabindex: -1, texto: 'Seu resultado' });
    const lista = elemento('ul', { classe: 'mfc-performance', 'aria-label': 'Desempenho por assunto' });
    for (const a of resultado.assuntos) lista.append(elemento('li', { 'data-assunto': a.codigo }, [elemento('span', { texto: a.nome }), elemento('strong', { texto: `${a.acertos} de ${a.total} · ${formatarPercentual(a.percentual)}` })]));
    const revisao = elemento('section', { classe: 'mfc-review', hidden: true, id:`mfc-gabarito-${numeroMontagem}`, 'aria-label': 'Gabarito comentado', 'data-correcao': true });
    let revisaoCriada = false;
    const gabarito = botao('Ver gabarito comentado', () => {
      if (!revisaoCriada) { montarGabarito(revisao); revisaoCriada = true; }
      revisao.hidden = !revisao.hidden;
      gabarito.setAttribute('aria-expanded', String(!revisao.hidden));
      gabarito.textContent = revisao.hidden ? 'Ver gabarito comentado' : 'Ocultar gabarito comentado';
    }, { 'aria-expanded': false, 'aria-controls': revisao.id });
    const mensagemExportacao = elemento('p', { classe: 'mfc-status', role: 'status', 'aria-live': 'polite' });
    const snapshot = boletim;
    async function exportar(button, acao) {
      const recuperarFoco = document.activeElement === button;
      button.disabled = true; mensagemExportacao.textContent = 'Preparando o boletim…';
      try { mensagemExportacao.textContent = await acao(); }
      catch { mensagemExportacao.textContent = 'Não foi possível preparar o boletim. Tente novamente ou consulte os resultados na tela.'; }
      finally {
        button.disabled = false;
        if (recuperarFoco && button.isConnected && (document.activeElement === document.body || document.activeElement?.classList.contains('mfc-frame-impressao'))) button.focus();
      }
    }
    const pdf = botao('Baixar PDF', () => exportar(pdf, async () => {
      const { gerarPDF, baixarPDF } = await import('./pdf.mjs');
      const arquivo = await gerarPDF(snapshot); baixarPDF(arquivo.blob, configuracao.arquivoPDF);
      return arquivo.avisos.length ? 'PDF preparado. Algumas imagens foram substituídas por suas descrições acessíveis.' : 'PDF preparado para download.';
    }));
    const imprimir = botao('Imprimir', () => exportar(imprimir, async () => {
      await imprimirBoletim(snapshot); return 'Versão de impressão preparada.';
    }));
    const consultar = botao('Consultar na tela', () => {
      if (revisao.hidden) gabarito.click();
      revisao.querySelector('h2').focus(); revisao.scrollIntoView({ block: 'start' });
    });
    const card = elemento('section', { classe: 'mfc-card' }, [
      elemento('p', { classe: 'mfc-kicker', texto: 'Simulado concluído' }), heading,
      elemento('p', { texto: configuracao.identificacao }),
      ...(boletim.nome ? [elemento('p', { 'data-nome-estudante': true, texto: `Nome do estudante: ${boletim.nome}` })] : []),
      elemento('p', { texto: `Data de realização: ${boletim.dataFormatada}` }),
      elemento('div', { classe: 'mfc-stats' }, [
        elemento('div', { classe: 'mfc-stat' }, [elemento('span', { texto: 'Acertos' }), elemento('strong', { 'data-total-acertos': true, texto: `${resultado.acertos} de ${resultado.total}` })]),
        elemento('div', { classe: 'mfc-stat' }, [elemento('span', { texto: 'Erros' }), elemento('strong', { 'data-total-erros': true, texto: resultado.erros })]),
        elemento('div', { classe: 'mfc-stat' }, [elemento('span', { texto: 'Não respondidas' }), elemento('strong', { 'data-total-branco': true, texto: resultado.semResposta })]),
        elemento('div', { classe: 'mfc-stat' }, [elemento('span', { texto: 'Aproveitamento' }), elemento('strong', { 'data-percentual': true, texto: formatarPercentual(resultado.percentual) })]),
      ]),
      elemento('p', { texto: `${resultado.respondidas} ${resultado.respondidas === 1 ? 'questão respondida' : 'questões respondidas'}; ${resultado.semResposta} sem resposta.` }),
      elemento('h2', { texto: 'Desempenho por assunto' }), lista,
      elemento('p', { classe: 'mfc-note', texto: 'Confira as resoluções para compreender as estratégias e retomar os assuntos que precisam de estudo.' }),
      elemento('h2', { texto: 'Como deseja guardar ou consultar seu resultado?' }),
      elemento('p', { classe: 'mfc-note', texto: 'Escolha livremente: não é necessário baixar ou imprimir. O PDF é gerado neste navegador, sem envio de dados pessoais.' }),
      elemento('div', { classe: 'mfc-result-actions' }, [pdf, imprimir, consultar]), mensagemExportacao,
      elemento('div', { classe: 'mfc-result-actions' }, [gabarito, botao('Iniciar nova aplicação', iniciarAplicacao, { classe: 'mfc-primary' })]),
    ]);
    main.replaceChildren(card, revisao); heading.focus({ preventScroll: true }); container.scrollIntoView({ block: 'start' });
  }
  function montarGabarito(destino) {
    destino.append(elemento('h2', { tabindex: -1, texto: 'Gabarito comentado' }));
    const porId = new Map(correcao.map(c => [c.questaoId, c]));
    questoes.forEach((q, i) => {
      const c = porId.get(q.id), certo = c.respostaId === c.opcaoCorretaId;
      const detalhe = elemento('details', { 'data-questao-id': q.id }, [elemento('summary', { texto: `Questão ${i + 1} — ${q.titulo}` })]);
      detalhe.append(elemento('p', { classe: 'mfc-answer-status', texto: c.respostaId === null ? 'Você não respondeu.' : certo ? 'Sua resposta está correta.' : 'Sua resposta está incorreta.' }), elemento('p', { classe: 'mfc-enunciado', texto: q.enunciado }));
      recursos(q, detalhe);
      for (const o of q.alternativas) {
        const marcas = [o.id === c.opcaoCorretaId ? 'Resposta correta' : '', o.id === c.respostaId ? 'Sua resposta' : ''].filter(Boolean);
        detalhe.append(elemento('p', { classe: 'mfc-review-option', 'data-correta': String(o.id === c.opcaoCorretaId), texto: `${o.letra}) ${o.texto}${marcas.length ? ' — ' + marcas.join(' · ') : ''}` }));
      }
      detalhe.append(elemento('div', { classe: 'mfc-resolution' }, [elemento('h3', { texto: 'Resolução comentada' }), elemento('p', { texto: c.resolucao })]));
      destino.append(detalhe);
    });
  }
  await preparar();
  return Object.freeze({ desmontar: () => container.replaceChildren() });
}
