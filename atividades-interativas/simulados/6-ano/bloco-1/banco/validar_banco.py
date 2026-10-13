"""Valida o conteúdo do banco com cálculos independentes; não implementa o simulado.

Executar: python3 validar_banco.py
A comparação usa valores exatos e não depende do gabarito declarado no JSON.
Os campos 'valores' têm a ordem definida em 'componentes_resposta'. A revisão
pedagógica do texto, distratores e representação visual continua necessária.
"""
from pathlib import Path
from fractions import Fraction as F
from decimal import Decimal as D
from math import lcm, isqrt, ceil
import json
import re

PASTA = Path(__file__).resolve().parent
ADAPTACOES_APROVADAS = {'SN-03', 'SN-06', 'ON-10', 'FR-19'}
ARQUIVOS = ['sistema-numeracao.json', 'operacoes.json', 'multiplos-divisores.json', 'fracoes.json', 'decimais.json']


def primo(n):
    return n >= 2 and all(n % d for d in range(2, isqrt(n) + 1))


def por_extenso(n):
    """Escrita de naturais até 99.999 para conferir o quadro original de SN-03."""
    unidades = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove']
    especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove']
    dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']
    centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos']
    if n < 10:
        return unidades[n]
    if n < 20:
        return especiais[n - 10]
    if n < 100:
        d, u = divmod(n, 10)
        return dezenas[d] + (' e ' + unidades[u] if u else '')
    if n == 100:
        return 'cem'
    if n < 1000:
        c, r = divmod(n, 100)
        return centenas[c] + (' e ' + por_extenso(r) if r else '')
    if n < 100000:
        mil, r = divmod(n, 1000)
        prefixo = 'mil' if mil == 1 else por_extenso(mil) + ' mil'
        ligacao = ' e ' if r < 100 or r % 100 == 0 else ' '
        return prefixo + (ligacao + por_extenso(r) if r else '')
    raise ValueError('Número fora do intervalo de escrita implementado')


def opcao_correta(id, opcao, esperada):
    valores = opcao['valores']
    if id == 'SN-06':
        total, parcelas = valores
        return total == esperada[0] and sum(parcelas) == total
    if id == 'FR-19':
        # A equivalência não basta: testar denominadores ANTES de simplificar.
        par = valores[0]
        if len(par) != 2 or par[0] == par[1]:
            return False
        for escrita in par:
            numerador, denominador = map(int, escrita.split('/'))
            if not 20 < denominador < 40 or F(numerador, denominador) != F(3, 4):
                return False
        return True
    if id == 'ON-10':
        resultado_original_valido, quociente, fatores, produto, operacao = valores
        if operacao != 'multiplicacao' or fatores[0] * fatores[1] != produto:
            return False
    return normalizar(valores) == normalizar(esperada)


def respostas_calculadas():
    """Dados numéricos originais e operações, independentemente das opções criadas."""
    e = {}
    visitantes = {'Matemática': 1248, 'Ciências': 1482, 'Tecnologia': 1284, 'Robótica': 1428}
    ordem = sorted(visitantes, key=visitantes.get)
    e['SN-01'] = [ordem, ordem[-1], max(visitantes.values()) - min(visitantes.values())]
    e['SN-02'] = [5 * 1000, 'milhar']
    numero_quadro = 2 * 10000 + 4 * 1000 + 6 * 100 + 3 * 10 + 8
    e['SN-03'] = [numero_quadro, por_extenso(numero_quadro)]
    e['SN-06'] = [40000 + 7000 + 300 + 20 + 6, [47000, 300, 20, 6]]
    e['SN-04'] = [sum([325, 470, 285, 510]), sum([325, 470, 285, 510]) - 1500]
    guiches = {'A': 786, 'B': 945, 'C': 869}
    e['SN-05'] = [max(guiches, key=guiches.get), max(guiches.values()) - min(guiches.values())]
    p = (2500 + 3500) // 2
    e['SN-07'] = [p, 4000 - p]
    estoque = 23 * 100 + 7 * 10 + 4
    e['SN-08'] = [estoque, *divmod(estoque, 100)]
    equipes = {'A': 8970, 'B': 9078, 'C': 8907, 'D': 9087}
    vencedores = sorted(equipes, key=equipes.get, reverse=True)
    e['SN-09'] = [*vencedores[:2], 'ordens']
    e['SN-10'] = [int(str(304052).replace('0', '')), 'posicoes']
    pops = {'Boa Esperança': 48720, 'Santa Clara': 47820, 'Nova União': 48270}
    e['SN-11'] = [sorted(pops.values(), reverse=True), max(pops, key=pops.get)]
    e['SN-12'] = [[4998 + 1, 4998 + 2], 'novo_milhar']
    e['SN-13'] = [12485 + 13790, 'maio', 13790 - 12485]
    e['SN-14'] = [25000 + 3875, 30000 - (25000 + 3875)]
    e['SN-15'] = [sorted([18305, 18350, 18053, 18530])]
    restante = 32450 - 8975
    e['SN-16'] = [restante, 'menor' if restante < 25000 else 'maior', abs(25000 - restante)]
    e['SN-17'] = [45000 - 38675, 40000 - 38675]
    e['SN-18'] = ['janeiro', 125480 - 119750]
    assert 70405 > 70045 and (70405 // 100) % 10 > (70045 // 100) % 10
    e['SN-19'] = ['colega', 'maior', 'centenas']
    novo = 76845 + 20000
    e['SN-20'] = [100000 - 76845, novo, novo >= 100000, 100000 - novo]

    e['ON-01'] = [D(25 * 32 + 18 * 45 + 20 * 38)]
    e['ON-02'] = ['divisao', ceil(F(186, 42))]
    producao = [2480, 3125, 2795, 1600]
    assert not any(v > 2 * producao[-1] for v in producao[:-1])
    e['ON-03'] = [sum(producao), 'nenhum']
    lotacao = 28 * 36
    e['ON-04'] = [['V' if x else 'F' for x in [lotacao > 1000, lotacao == 28 * 36, lotacao - 8 == 1000, lotacao / 2 == 504]]]
    e['ON-05'] = [1440 // 12, 12, 1440]
    e['ON-06'] = ['duas_saidas']
    assert 2350 - 875 - 946 == 529
    e['ON-07'] = list(divmod(3276, 24))
    e['ON-08'] = ['B', D(18 * (47 + 35)), '18_vezes_82']
    c, d = 365 + 160, 480 - 70
    e['ON-09'] = [c, d, 480 + 365 + c + d]
    quociente, resto = divmod(864, 18)
    assert resto == 0
    e['ON-10'] = [42 * 18 == 864, quociente, [quociente, 18], 864, 'multiplicacao']
    e['ON-11'] = [5000 + 2750 - 3685]
    e['ON-12'] = [['divisao', 'adicao', 'subtracao', 'multiplicacao']]
    publico = sum([1285, 1640, 1375])
    e['ON-13'] = [publico, 4500 - publico]
    q, r = divmod(2184, 21)
    e['ON-14'] = [q, r, 'sem_sobra']
    economia = 18750 - 15980
    e['ON-15'] = [economia, economia * 4]
    e['ON-16'] = [50 * 48, 125 * 48, 'multiplicacao']
    vendidas = 238 + 317
    e['ON-17'] = [vendidas, 750 - vendidas]
    assert divmod(428, 8) == (53, 4)
    e['ON-18'] = [ceil(F(428, 8)), 'restam_4']
    exato = 2985 + 4112
    estimativas = {'Ana': 3000 + 4000, 'Bruno': 2000 + 4000, 'Caio': 3000 + 5000}
    autor = min(estimativas, key=lambda k: abs(estimativas[k] - exato))
    e['ON-19'] = [autor, estimativas[autor], exato, abs(estimativas[autor] - exato)]
    e['ON-20'] = [2400 + 36 * 25]

    e['MD-01'] = [lcm(40, 60), 'mmc']
    e['MD-02'] = [[n for n in [90, 105, 120, 135] if all(n % d == 0 for d in [2, 3, 5])], '2_3_5']
    e['MD-03'] = [['par' if n % 2 == 0 else 'impar' for n in [247, 508, 1036]], 'ultimo_par']
    candidates = [2, 3, 4, 5, 6, 8, 9, 12]
    e['MD-04'] = [[n for n in candidates if 36 % n == 0], [n for n in candidates if 36 % n], 'resto']
    e['MD-05'] = [lcm(4, 6)]
    lotes = [1250, 3400, 7830, 9000]
    e['MD-06'] = [[n for n in lotes if n % 10 == 0], [n for n in lotes if n % 100 == 0]]
    candidatos = [n for n in range(41, 60) if n % 3 == n % 4 == 0]
    assert len(candidatos) == 1
    e['MD-07'] = [candidatos[0], 'multiplo_12']
    e['MD-08'] = [[n for n in [6, 7, 8, 12, 14] if 84 % n == 0]]
    e['MD-09'] = [[n for n in [29, 33, 37, 51] if primo(n)], 3, 3]
    assert 33 % 3 == 51 % 3 == 0
    nums = [11, 21, 23, 27, 31, 49]
    e['MD-10'] = [[n for n in nums if primo(n)], [n for n in nums if not primo(n)], [3, 7]]
    tamanhos = [n for n in [6, 8, 10, 12] if 96 % n == 0]
    e['MD-11'] = [tamanhos, [96 // n for n in tamanhos]]
    e['MD-12'] = [[n for n in [12, 18, 20, 24, 30, 35, 42, 48] if n % 6 == 0], 48 + 6]
    minutos = 9 * 60 + lcm(18, 24)
    e['MD-13'] = [f'{minutos // 60:02}:{minutos % 60:02}']
    assert 9 == 3 * 3 and 15 == 3 * 5 and not primo(9) and not primo(15)
    e['MD-14'] = [False, [9, 15], [[3, 3], [3, 5]]]
    codigos = {'A': 4574, 'B': 3690, 'C': 5428}
    validos = [k for k, n in codigos.items() if n % 9 == 0]
    assert validos == ['B']
    e['MD-15'] = [validos, sum(map(int, str(codigos['B'])))]
    periodo = lcm(8, 12)
    e['MD-16'] = [periodo // 8, periodo // 12]
    linhas = [3, 4, 5, 6, 8, 9]
    e['MD-17'] = [[[n, 72 // n] for n in linhas if 72 % n == 0], next(n for n in linhas if 72 % n)]
    e['MD-18'] = [[n for n in [114, 125, 132, 145] if n % 6 == 0]]
    assert all(a * b == 60 for a, b in [(6, 10), (5, 12), (3, 20), (2, 30)])
    e['MD-19'] = [True, [2, 2, 3, 5]]
    e['MD-20'] = [lcm(6, 8, 12), 'mmc']

    e['FR-01'] = [F(3, 8), F(8 - 3, 8)]
    e['FR-02'] = [F(3, 4)]
    e['FR-03'] = [F(3, 4)]
    assert [1, 2, 1, 3, 1, 2] != [1] * 6
    e['FR-04'] = ['areas_iguais']
    e['FR-05'] = [F(2, 3), 6]
    assert F(12, 18) == F(2, 3) and 12 // 6 == 2 and 18 // 6 == 3
    corrida = {'Lia': F(2, 5), 'Caio': F(1, 2), 'Bia': F(5, 8), 'Ravi': F(3, 4)}
    e['FR-06'] = [sorted(corrida, key=corrida.get), max(corrida, key=corrida.get)]
    e['FR-07'] = [F(1, 2)]
    e['FR-08'] = [F(2, 3), '2_div_3']
    e['FR-09'] = [8 // 2]
    fractions = [F(3, 8), F(5, 8), F(6, 8), F(8, 8)]
    valid = [f for f in fractions if F(1, 2) < f < 1 and f.denominator == 8 and f.numerator % 2]
    assert valid == [F(5, 8)]
    e['FR-10'] = [valid[0]]
    e['FR-11'] = [F(1, 4), F(3, 4)]
    cartes = {'A': F(1, 4), 'B': F(3, 4), 'C': F(2, 5), 'D': F(3, 5), 'E': F(1, 2)}
    duplas = [[a, b] for i, a in enumerate(cartes) for b in list(cartes)[i + 1:] if cartes[a] + cartes[b] == 1]
    e['FR-12'] = [duplas]
    e['FR-13'] = [F(5, 6) - F(2, 6)]
    pintado = F(2, 7) + F(3, 7)
    e['FR-14'] = [pintado, 1 - pintado]
    assert F(7, 10) > F(3, 5) == F(6, 10)
    e['FR-15'] = ['A', '7/10_maior_6/10']
    separados = 36 * F(2, 3)
    e['FR-16'] = [separados, 36 - separados]
    manha, tarde = 48 * F(3, 8), 48 * F(1, 4)
    e['FR-17'] = [manha, tarde, 48 - manha - tarde]
    assert F(4, 6) == F(16, 24) > F(15, 24) == F(5, 8)
    e['FR-18'] = ['Clara', '4/6_maior_5/8']
    e['FR-19'] = [[F(3, 4), F(3, 4)]]
    completada = F(5, 12) + F(1, 3)
    e['FR-20'] = [completada, 1 - completada, completada > F(3, 4)]

    compra = sum(map(D, ['24.90', '6.75', '18.35']))
    e['ND-01'] = [compra, D('60') - compra]
    e['ND-02'] = [D(2) + 7 * D('0.1')]
    e['ND-03'] = [7 * D('0.01'), D('4.275') * 1000]
    e['ND-04'] = [D(2) + D(35) / 100]
    parcela = D('25.20') - D('18.75')
    e['ND-05'] = [int(parcela * 100) % 10]
    tempos = {'Lia': D('12.48'), 'Ravi': D('12.5'), 'Bia': D('12.39'), 'Caio': D('12.405')}
    e['ND-06'] = [sorted(tempos, key=tempos.get)]
    e['ND-07'] = [D(10) - D('6.75')]
    e['ND-08'] = [D('3.47') * 10, 'dez_vezes']
    e['ND-09'] = [D('36.80') * D('2.5')]
    e['ND-10'] = ['divisao', D('157.5') / D('12.5')]
    e['ND-11'] = [D(5) - D('1.85') - D('2.4')]
    e['ND-12'] = [False, D('7.2') * D('0.5'), 'metade']
    e['ND-13'] = [F(63, 100), D(63) / 100]
    e['ND-14'] = [[D('0.75'), F(75, 100), F(3, 4)], 'simplificar_25']
    preco = D('48.50') - D('7.25')
    e['ND-15'] = [preco, D(50) - preco]
    garrafa = D('3.6') / 8
    e['ND-16'] = [garrafa, garrafa * 1000]
    e['ND-17'] = [D(5) + D(2) / 10 + D(0) / 100 + D(8) / 1000]
    medic = list(map(D, ['9.89', '10.12', '9.98', '10.07']))
    perto = min(medic, key=lambda v: abs(v - 10))
    e['ND-18'] = [perto, abs(perto - 10)]
    produtos = {'caderno': D('12.50'), 'canetas': D('7.50'), 'estojo': D('8.25'), 'regua': D('3.40')}
    pares = [[a, b] for i, a in enumerate(produtos) for b in list(produtos)[i + 1:] if produtos[a] + produtos[b] == 20]
    assert len(pares) == 1
    e['ND-19'] = [pares[0], len(pares) > 1]
    energia = sum(map(D, ['2.75', '3.608', '1.42']))
    e['ND-20'] = [energia, D(8) - energia]
    assert len(e) == 100
    # Conferências dos dados originais das quatro adaptações aprovadas.
    assert 2 * 10000 + 4 * 1000 + 6 * 100 + 3 * 10 + 8 == 24638
    assert 40000 + 7000 + 300 + 20 + 6 == 47000 + 300 + 20 + 6 == 47326
    assert divmod(864, 18) == (48, 0) and 42 * 18 != 864
    assert F(18, 24) == F(21, 28) == F(3, 4) and 20 < 24 < 40 and 20 < 28 < 40
    return e


def normalizar(value):
    if isinstance(value, bool):
        return ('booleano', value)
    if value is None:
        return ('nulo',)
    if isinstance(value, list):
        return tuple(normalizar(v) for v in value)
    if isinstance(value, (int, F, D)):
        return ('numero', F(value))
    if isinstance(value, str) and re.fullmatch(r'-?\d+(?:\.\d+|/\d+)?', value):
        return ('numero', F(value))
    return ('texto', value)


def verificar(condicao, mensagem):
    if not condicao:
        raise ValueError(mensagem)


def validar():
    esperadas = respostas_calculadas()
    ids = set()
    resumo = {}
    pendentes = []
    gabaritos = {c: 0 for c in 'ABCD'}
    for nome in ARQUIVOS:
        banco = json.loads((PASTA / nome).read_text(encoding='utf-8'))
        verificar(banco['versao_formato'] == 1, f'{nome}: versão desconhecida')
        questoes = banco['questoes']
        verificar(len(questoes) == 20, f'{nome}: deve conter 20 registros')
        preparadas = 0
        for numero, q in enumerate(questoes, 1):
            id = q['id']
            verificar(id not in ids, f'{id}: ID duplicado')
            ids.add(id)
            verificar(id == f"{banco['codigo_assunto']}-{numero:02}", f'{id}: correspondência com número original')
            verificar(q['numero_original'] == q['fonte']['numero'] == numero, f'{id}: número original')
            verificar(q['assunto'] == banco['assunto'], f'{id}: assunto incorreto')
            verificar(q['titulo'] and q['conteudo'] and q['habilidade'] and q['enunciado']['comando'] and q['resolucao_comentada'] and q['resposta_matematica'], f'{id}: campos obrigatórios')
            verificar(q['dificuldade']['nivel'] in ['facil', 'media', 'dificil'], f'{id}: dificuldade inválida')
            verificar(bool(q['dificuldade']['justificativa']), f'{id}: dificuldade sem justificativa')
            if id in ADAPTACOES_APROVADAS:
                verificar(q['adaptacao_pedagogica']['status'] == 'aprovada' and q['adaptacao_pedagogica']['descricao'] and q['habilidade_original'], f'{id}: adaptação não registrada')
            for recurso in q['recursos_visuais']:
                verificar(not re.search(r'<(?:script|iframe)\b|\bon\w+\s*=|javascript:', recurso['html'], re.I), f'{id}: recurso deve ser estático')
            verificar(q['status'] == 'preparada' and q['elegivel_sorteio'], f'{id}: status')
            opcoes = q['alternativas']
            verificar([o['letra'] for o in opcoes] == list('ABCD'), f'{id}: deve ter A, B, C e D')
            verificar(len({o['texto'] for o in opcoes}) == 4, f'{id}: textos duplicados')
            verificar(all(len(o['valores']) == len(q['componentes_resposta']) for o in opcoes), f'{id}: componentes incompletos')
            corretas = [o for o in opcoes if opcao_correta(id, o, esperadas[id])]
            verificar(len(corretas) == 1, f'{id}: {len(corretas)} alternativas matematicamente corretas')
            verificar(corretas[0]['letra'] == q['gabarito'], f'{id}: gabarito diverge do cálculo independente')
            verificar(corretas[0]['erro_comum'] is None, f'{id}: opção correta marcada como distrator')
            verificar(all(o['erro_comum'] for o in opcoes if o not in corretas), f'{id}: distrator sem justificativa')
            if id == 'MD-15':
                verificar(q['correcoes'][0]['valor_original'] == 4572 and q['correcoes'][0]['valor_banco'] == 4574, 'MD-15: correção aprovada')
                verificar(q['recursos_visuais'][0]['tabelas'][0][0] == ['Código A', '4 5 7 4'], 'MD-15: tabela não corrigida')
                verificar(q['recursos_visuais'][0]['tabelas'][0][1:] == [['Código B', '3 6 9 0'], ['Código C', '5 4 2 8']], 'MD-15: B e C devem ser preservados')
            preparadas += 1
            gabaritos[q['gabarito']] += 1
        resumo[banco['codigo_assunto']] = {'registros': 20, 'preparadas': preparadas, 'pendentes': 20 - preparadas}
    verificar(len(ids) == 100 and not pendentes, 'Inventário incompleto ou pendente')
    return {'resultado': 'aprovado_nas_verificacoes_estruturais_e_matematicas', 'registros': len(ids),
            'preparadas': sum(v['preparadas'] for v in resumo.values()), 'pendentes': sorted(pendentes),
            'por_assunto': resumo, 'distribuicao_gabaritos': gabaritos,
            'limite': 'Não substitui revisão pedagógica dos enunciados/distratores, produção escrita nem validação visual em navegador. Nenhuma interface foi executada.'}


if __name__ == '__main__':
    print(json.dumps(validar(), ensure_ascii=False, indent=2))
