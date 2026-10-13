"""Conferência do banco autoral, sem executar interface ou código dos enunciados.

Interpreta somente uma gramática matemática limitada. Não usa eval/exec.
Os modelos são documentação verificável do raciocínio e usam os dados de cada
questão; não consultam gabaritos. A revisão pedagógica humana permanece necessária.
"""
import ast
from pathlib import Path
from fractions import Fraction as F
from math import gcd, lcm, ceil, isqrt
from itertools import permutations
from html.parser import HTMLParser
import hashlib
import json
import re
import xml.etree.ElementTree as ET

PASTA=Path(__file__).resolve().parent
ARQUIVOS=['sistema-numeracao.json','operacoes.json','multiplos-divisores.json','fracoes.json','decimais.json']

def arredonda(n,p):
    return (F(n)/F(p)+F(1,2))//1*F(p)

def permutacoes(algarismos):
    return [int(''.join(map(str,p))) for p in permutations(algarismos) if p[0]!=0]

def troca_cu(n):
    c,u=n//100%10,n%10
    return n-c*100-u+u*100+c

FUNCOES={'abs':abs,'F':F,'gcd':gcd,'lcm':lcm,'ceil':ceil,'isqrt':isqrt,'min':min,'max':max,'sum':sum,'range':range,'len':len,'sorted':sorted,'set':set,'all':all,'any':any,'int':int,'str':str,'permutacoes':permutacoes,'troca_cu':troca_cu,'arredonda':arredonda}

class Modelo:
    def __init__(self,dados):
        self.dados=dados
        self.passos=0
    def ler(self,expressao):
        return self.no(ast.parse(expressao,mode='eval').body,{'D':self.dados})
    def vincular(self,target,value,env):
        if isinstance(target,ast.Name):env[target.id]=value
        elif isinstance(target,(ast.Tuple,ast.List)):
            for t,v in zip(target.elts,value):self.vincular(t,v,env)
        else:raise ValueError('Alvo de iteração inválido')
    def comp(self,node,env,indice=0):
        if indice==len(node.generators):return [self.no(node.elt,env)]
        g=node.generators[indice];out=[]
        for v in self.no(g.iter,env):
            local=env.copy();self.vincular(g.target,v,local)
            if all(self.no(i,local) for i in g.ifs):out.extend(self.comp(node,local,indice+1))
        return out
    def no(self,node,env):
        self.passos+=1
        if self.passos>30000:raise ValueError('Modelo excessivamente complexo')
        if isinstance(node,ast.Constant):return node.value
        if isinstance(node,ast.Name):return env[node.id]
        if isinstance(node,(ast.List,ast.Tuple)):return [self.no(n,env) for n in node.elts]
        if isinstance(node,ast.Subscript):
            v=self.no(node.value,env)
            if isinstance(node.slice,ast.Slice):
                a=self.no(node.slice.lower,env) if node.slice.lower else None
                b=self.no(node.slice.upper,env) if node.slice.upper else None
                return v[a:b]
            return v[self.no(node.slice,env)]
        if isinstance(node,ast.UnaryOp):
            v=self.no(node.operand,env)
            if isinstance(node.op,ast.Not):return not v
            if isinstance(node.op,ast.USub):return -v
            raise ValueError('Operação unária não permitida')
        if isinstance(node,ast.BinOp):
            a,b=self.no(node.left,env),self.no(node.right,env)
            if isinstance(node.op,ast.Add):return a+b
            if isinstance(node.op,ast.Sub):return a-b
            if isinstance(node.op,ast.Mult):return a*b
            if isinstance(node.op,ast.Div):return F(a)/F(b)
            if isinstance(node.op,ast.FloorDiv):return a//b
            if isinstance(node.op,ast.Mod):return a%b
            if isinstance(node.op,ast.BitOr) and isinstance(a,set) and isinstance(b,set):return a|b
            if isinstance(node.op,ast.Pow) and isinstance(b,int) and 0<=b<=8:return a**b
            raise ValueError('Operação binária não permitida')
        if isinstance(node,ast.Compare):
            a=self.no(node.left,env)
            for op,right in zip(node.ops,node.comparators):
                b=self.no(right,env)
                if isinstance(op,ast.Eq):ok=a==b
                elif isinstance(op,ast.NotEq):ok=a!=b
                elif isinstance(op,ast.Lt):ok=a<b
                elif isinstance(op,ast.LtE):ok=a<=b
                elif isinstance(op,ast.Gt):ok=a>b
                elif isinstance(op,ast.GtE):ok=a>=b
                else:raise ValueError('Comparação não permitida')
                if not ok:return False
                a=b
            return True
        if isinstance(node,ast.BoolOp):
            vals=[self.no(n,env) for n in node.values]
            return all(vals) if isinstance(node.op,ast.And) else any(vals)
        if isinstance(node,ast.IfExp):return self.no(node.body if self.no(node.test,env) else node.orelse,env)
        if isinstance(node,(ast.GeneratorExp,ast.ListComp)):return self.comp(node,env)
        if isinstance(node,ast.Call):
            args=[self.no(n,env) for n in node.args]
            if node.keywords:raise ValueError('Argumentos nomeados não permitidos')
            if isinstance(node.func,ast.Name) and node.func.id in FUNCOES:return FUNCOES[node.func.id](*args)
            if isinstance(node.func,ast.Attribute):
                base=self.no(node.func.value,env)
                if node.func.attr=='items' and isinstance(base,dict) and not args:return list(base.items())
                if node.func.attr=='zfill' and isinstance(base,str) and len(args)==1 and 0<=args[0]<=20:return base.zfill(args[0])
            raise ValueError('Função não permitida')
        raise ValueError('Sintaxe não permitida: '+type(node).__name__)

def normalizar(v):
    if isinstance(v,bool):return ('logico',v)
    if isinstance(v,(int,F)):return ('numero',F(v))
    if isinstance(v,str) and re.fullmatch(r'-?\d+(?:\.\d+|/\d+)?',v):return ('numero',F(v))
    if isinstance(v,list):return tuple(normalizar(x) for x in v)
    return ('texto',v)

class Tabela(HTMLParser):
    def __init__(self):
        super().__init__();self.linhas=[];self.atual=[];self.celula=None;self.texto='';self.escopos=[]
    def handle_starttag(self,tag,attrs):
        if tag=='tr':self.atual=[]
        if tag in ('td','th'):
            self.celula=tag;self.texto=''
            if tag=='th':self.escopos.append(dict(attrs).get('scope'))
        if tag in ('script','iframe','img'):raise ValueError('Recurso inesperado em tabela estática')
    def handle_data(self,data):
        if self.celula:self.texto+=data
    def handle_endtag(self,tag):
        if tag in ('td','th'):
            self.atual.append(self.texto);self.celula=None
        if tag=='tr':self.linhas.append(self.atual)

def texto_celula(v):
    if isinstance(v,list):return '; '.join(texto_celula(x) for x in v)
    if isinstance(v,bool):return 'Sim' if v else 'Não'
    if isinstance(v,float):return str(v).replace('.',',')
    if isinstance(v,str) and re.fullmatch(r'-?\d+\.\d+',v):return v.replace('.',',')
    return str(v)

def conferir_sn_svg(q,r,svg):
    """Confere os SVG revisados de SN contra dados e relações da própria questão."""
    ns='{http://www.w3.org/2000/svg}'
    d=q['dados'];g=r['geometria'];modelo=g['modelo'];texts=svg.findall('.//'+ns+'text')
    raiz=svg.get('viewBox').split()
    conferir(raiz[:3]==['0','0','320'] and svg.get('class')=='mfc-sn-svg' and 'height:auto' in r['css'] and 'width:100%' in r['css'],q['id']+': SVG responsivo')
    desc=svg.find(ns+'desc')
    conferir(desc is not None and desc.text==r['acessibilidade'] and svg.get('aria-describedby')==desc.get('id'),q['id']+': descrição SVG')
    for eixo in g['eixos']:
        marcas=[e for e in svg.iter() if e.get('data-eixo')==eixo['nome']]
        esperado=list(range(eixo['minimo'],eixo['maximo']+1,eixo['passo']))
        conferir([int(e.get('data-marca')) for e in marcas]==esperado,q['id']+': marcas da reta')
        for e,v in zip(marcas,esperado):
            x=F(eixo['x_inicio'])+F(v-eixo['minimo'],eixo['maximo']-eixo['minimo'])*(eixo['x_fim']-eixo['x_inicio'])
            conferir(F(e.get('data-x'))==x,q['id']+': espaçamento proporcional')
        for t in texts:
            if t.get('data-rotulo-eixo')==eixo['nome']:
                conferir(t.text==formatar_sn(int(t.get('data-valor'))),q['id']+': rótulo da reta')
    leituras=[int(t.get('data-leitura')) for t in texts if t.get('data-leitura')]
    for t in texts:
        if t.get('data-leitura'):conferir(t.text==formatar_sn(int(t.get('data-leitura'))),q['id']+': leitura exibida')
    if modelo=='painel_centenas':
        conferir(leituras==[d['painel']] and g['eixos'][0]['minimo']==d['painel']-200 and g['eixos'][0]['maximo']==d['painel']+200 and g['eixos'][0]['passo']==100,q['id']+': painel e escala')
    elif modelo=='sequencia_fichas':
        vals=[int(t.get('data-ficha')) for t in texts if t.get('data-ficha')]
        conferir(vals==list(range(d['primeira_ficha'],d['ultima_ficha']+1)),q['id']+': sequência')
        conferir(all(t.text==t.get('data-ficha') for t in texts if t.get('data-ficha')),q['id']+': números nas fichas')
        aviso=next(t for t in texts if t.get('data-canceladas'))
        conferir(int(aviso.get('data-canceladas'))==d['fichas_canceladas'] and aviso.text==str(d['fichas_canceladas'])+' fichas foram canceladas',q['id']+': cancelamentos')
    elif modelo=='painel_abreviado':
        t=next(t for t in texts if t.get('data-milhares'))
        conferir(t.get('data-milhares')==d['valor_em_milhares'] and t.text==str(d['valor_em_milhares']).replace('.',',')+' k',q['id']+': notação abreviada')
        conferir(any(t.text=='k indica mil' for t in texts),q['id']+': legenda')
    elif modelo=='etiqueta_intervalo':
        etiqueta=str(d['centenas'])+'□'+str(d['unidades'])
        conferir(any(t.get('data-etiqueta')==etiqueta and t.text==etiqueta for t in texts),q['id']+': etiqueta')
        conferir(g['eixos'][0]['minimo']==d['limite_inferior'] and g['eixos'][0]['maximo']==d['limite_superior'],q['id']+': limites')
        circulos=svg.findall('.//'+ns+'circle')
        conferir(len(circulos)==2 and [F(c.get('cx')) for c in circulos]==[35,285] and all(c.get('fill')=='white' for c in circulos),q['id']+': extremos abertos')
    elif modelo=='algarismos_posicoes':
        vals=[int(t.get('data-algarismo')) for t in texts if t.get('data-algarismo')]
        conferir(vals==d['algarismos'] and all(t.text==t.get('data-algarismo') for t in texts if t.get('data-algarismo')),q['id']+': algarismos')
        teto=next(t for t in texts if t.get('data-teto'))
        conferir(int(teto.get('data-teto'))==d['teto'] and teto.text=='Identificador menor que '+formatar_sn(d['teto']),q['id']+': teto')
    elif modelo=='troca_ordens':
        dig=list(str(d['numero_antes']))
        for row,expected in [('antes',dig),('depois',[dig[0],'□',dig[2],'□'])]:
            t=[t for t in texts if t.get('data-quadro')==row]
            conferir([t.get('data-posicao') for t in t]==list('MCDU') and [t.text for t in t]==expected,q['id']+': quadro '+row)
        conferir([e.get('data-troca') for e in svg.iter() if e.get('data-troca')]==['C-U','U-C'],q['id']+': troca indicada')
    elif modelo=='duas_escalas':
        conferir(leituras==[d['tela_centena'],d['tela_milhar']],q['id']+': leituras aproximadas')
        a,b=g['eixos']
        conferir(a['minimo']==d['tela_centena']-200 and a['maximo']==d['tela_centena']+200 and a['passo']==100,q['id']+': escala da centena')
        conferir(b['minimo']==d['tela_milhar']-1000 and b['maximo']==d['tela_milhar']+1000 and b['passo']==1000,q['id']+': escala do milhar')
    elif modelo=='folhas_completas':
        esperado=[d['primeira_pagina'],d['primeira_pagina']+1,d['primeira_pagina']+2,d['primeira_pagina']+3,d['ultima_pagina']-1,d['ultima_pagina']]
        pags=[t for t in texts if t.get('data-pagina')]
        conferir([int(t.get('data-pagina')) for t in pags]==esperado and all(t.text==t.get('data-pagina') for t in pags),q['id']+': frente/verso')
        conferir(d['primeira_pagina']%2==1 and d['ultima_pagina']%2==0,q['id']+': trecho de folhas completas')
        conferir([int(t.get('data-folha')) for t in pags]==[0,0,1,1,2,2],q['id']+': pares de páginas')
    elif modelo=='anuncio_escala':
        conferir(leituras==[d['anuncio']] and g['eixos'][0]['minimo']==d['anuncio']-d['unidade_arredondamento'] and g['eixos'][0]['maximo']==d['anuncio']+d['unidade_arredondamento'],q['id']+': anúncio e escala')
        conferir(g['eixos'][0]['passo']==d['unidade_arredondamento']//2,q['id']+': marcas intermediárias')
    elif modelo=='quadros_identificadores':
        conferir([int(t.get('data-identificador')) for t in texts if t.get('data-identificador')]==d['identificadores'],q['id']+': identificadores')
        for n in d['identificadores']:
            vals=[t for t in texts if t.get('data-numero')==str(n)]
            conferir([t.get('data-posicao') for t in vals]==list('MCDU') and [t.text for t in vals]==list(str(n)),q['id']+': ordens alinhadas')
        conferir(any(t.text=='Entre '+formatar_sn(d['limites'][0])+' e '+formatar_sn(d['limites'][1])+', sem os extremos' for t in texts),q['id']+': limites do quadro')
    else:raise ValueError('Modelo SN desconhecido')


def formatar_sn(n):
    return f'{n:,}'.replace(',','.')


def conferir_sn_tabela(q,r):
    if q['id'].endswith('SN-07'):
        esperado=[[k,'de '+formatar_sn(v[0])+' a '+formatar_sn(v[1])] for k,v in q['dados'].items()]
    elif q['id'].endswith('SN-08'):
        esperado=[[v[0],formatar_sn(v[1]),formatar_sn(v[2])] for v in q['dados']['Registros']]
    else:return
    conferir(r['linhas']==esperado,q['id']+': dados e formatação da tabela')


def conferir_on_svg(q,r,svg):
    """Confere dados, agrupamentos e proporções dos esquemas revisados de ON."""
    ns='{http://www.w3.org/2000/svg}';d=q['dados'];g=r['geometria']
    texts=svg.findall('.//'+ns+'text');rects=svg.findall('.//'+ns+'rect')
    conferir(svg.get('viewBox').split()[:3]==['0','0','320'] and svg.get('class')=='mfc-on-svg' and 'height:auto' in r['css'] and 'width:100%' in r['css'],q['id']+': responsividade ON')
    desc=svg.find(ns+'desc')
    conferir(desc is not None and desc.text==r['acessibilidade'] and svg.get('aria-describedby')==desc.get('id'),q['id']+': descrição ON')
    for t in texts:
        if t.get('data-campo'):
            v=d
            for k in t.get('data-campo').split('.'):
                v=v[int(k)] if isinstance(v,list) else v[k]
            conferir(str(v)==t.get('data-valor') and str(v) in t.text,q['id']+': dado exibido ON')
    m=g['modelo']
    if m=='planos_periodo':
        conferir(g['cobertura_dias']==d['dias_de_uso'] and sum(t.get('data-campo')=='plano_diario_reais' for t in texts)==d['dias_de_uso'],q['id']+': cobertura dos planos')
    elif m=='pontos_grupos':
        for evento,quant,pontos in [('acerto',d['acertos'],d['pontos_por_acerto']),('invalida',d['invalidas'],d['penalidade_por_invalida'])]:
            elems=[e for e in svg.iter() if e.get('data-evento')==evento]
            conferir(len(elems)==quant and all(int(e.get('data-pontos'))==pontos for e in elems),q['id']+': grupos de pontos')
    elif m=='tempo_manutencao':
        a=next(e for e in rects if e.get('data-parte')=='manutencao');b=next(e for e in rects if e.get('data-parte')=='producao')
        conferir(F(a.get('width'))/g['largura_total']==F(d['manutencao_minutos'],d['janela_minutos']) and F(a.get('width'))+F(b.get('width'))==g['largura_total'] and F(b.get('x'))==F(a.get('x'))+F(a.get('width')),q['id']+': divisão do tempo')
    elif m=='clubes_intersecao':
        c=svg.findall('.//'+ns+'circle')
        conferir(len(c)==2 and abs(F(c[1].get('cx'))-F(c[0].get('cx')))<F(c[0].get('r'))+F(c[1].get('r')) and d['participam_dos_dois']<=min(d['clube_leitura'],d['clube_xadrez']),q['id']+': interseção')
    elif m=='grade_borda':
        cells=[e for e in rects if e.get('data-linha') is not None]
        conferir({(int(e.get('data-linha')),int(e.get('data-coluna'))) for e in cells}=={(y,x) for y in range(d['linhas']) for x in range(d['colunas'])} and len(cells)==d['linhas']*d['colunas'],q['id']+': grade ON')
        for e in cells:
            y,x=int(e.get('data-linha')),int(e.get('data-coluna'));borda=y in [0,d['linhas']-1] or x in [0,d['colunas']-1]
            conferir(e.get('data-borda')==str(borda).lower() and (e.get('fill')!='white')==borda and F(e.get('x'))==32+32*x and F(e.get('y'))==49+32*y,q['id']+': borda e posição')
    elif m=='pacotes_adesivos':
        for k in ['P','Q']:
            cells=[e for e in rects if e.get('data-pacote')==k]
            conferir([int(e.get('data-adesivo')) for e in cells]==list(range(d['pacote_'+k+'_unidades'])),q['id']+': conteúdo do pacote')
    elif m=='rotas_ponte_desvio':
        conferir(d['rota_A_trechos'][1]==d['trecho_A_substituido'] and any(e.get('data-ponte')=='fechada' for e in svg.iter()) and any(e.get('data-rota')=='desvio' for e in svg.iter()),q['id']+': ponte e desvio')
    elif m=='experimentos_intervalos':
        conferir(sum(t.get('data-campo')=='experimento_min' for t in texts)==3 and sum(t.get('data-campo')=='limpeza_entre_min' for t in texts)==2,q['id']+': padrão de intervalos')
    elif m=='faixas_distributividade':
        for k in [1,2]:
            cells=[e for e in rects if e.get('data-faixa')==str(k)]
            esperado={(y,x) for y in range(d['altura_comum_m']) for x in range(d['largura_faixa_'+str(k)+'_m'])}
            conferir(len(cells)==len(esperado) and {(int(e.get('data-linha')),int(e.get('data-coluna'))) for e in cells}==esperado,q['id']+': faixas')
    else:conferir(m in ['fluxo_copos','canais_fases','ofertas_desconto_frete'],q['id']+': modelo ON conhecido')
    conferir((PASTA/r['arquivo']).read_text().strip()==r['html'],q['id']+': arquivo SVG e banco')


def conferir_md_svg(q,r,svg):
    """Confere unidades, agrupamentos, escalas, ciclos e marcações de MD."""
    ns='{http://www.w3.org/2000/svg}';d=q['dados'];g=r['geometria'];m=g['modelo']
    texts=svg.findall('.//'+ns+'text');rects=svg.findall('.//'+ns+'rect')
    conferir(svg.get('viewBox').split()[:3]==['0','0','320'] and svg.get('class')=='mfc-md-svg' and 'width:100%' in r['css'] and 'height:auto' in r['css'],q['id']+': responsividade MD')
    desc=svg.find(ns+'desc')
    conferir(desc is not None and desc.text==r['acessibilidade'] and svg.get('aria-describedby')==desc.get('id'),q['id']+': descrição MD')
    for t in texts:
        if t.get('data-campo'):
            v=d
            for k in t.get('data-campo').split('.'):
                v=v[int(k)] if isinstance(v,list) else v[k]
            conferir(str(v)==t.get('data-valor') and str(v) in t.text,q['id']+': dados exibidos MD')
    def elems(campo,valor=None):
        return [e for e in svg.iter() if e.get(campo) is not None and (valor is None or e.get(campo)==str(valor))]
    def seq(campo,n,selecionados=None):
        a=elems(campo) if selecionados is None else selecionados
        conferir([int(e.get(campo)) for e in a]==list(range(n)),q['id']+': unidades '+campo)
    if m=='saltos_reta':
        marcas=elems('data-marca');vals=list(range(0,50,d['salto']))
        conferir([int(e.get('data-marca')) for e in marcas]==vals,q['id']+': sequência dos saltos')
        for e,v in zip(marcas,vals):
            conferir(abs(float(e.get('data-x'))-(20+v*280/49))<0.000001,q['id']+': escala dos saltos')
        alvo=elems('data-alvo')
        conferir(len(alvo)==1 and int(alvo[0].get('data-alvo'))==d['casa_final'] and abs(float(alvo[0].get('data-x'))-(20+d['casa_final']*280/49))<0.000001,q['id']+': posição do alvo')
    elif m=='caixas_grupos':
        for k in ['A','B']:
            objetos=elems('data-caixa',k);n=d['objetos_caixa_'+k];seq('data-objeto',n,objetos)
            grupos=elems('data-grupo-caixa',k)
            conferir([int(e.get('data-grupo')) for e in grupos]==list(range(ceil(F(n,d['objetos_por_grupo'])))),q['id']+': contornos dos grupos')
            for i,e in enumerate(objetos):
                cx=80 if k=='A' else 240
                conferir(F(e.get('cx'))==cx-37+i%6%3*27 and F(e.get('cy'))==93+(i//6)*73+(i%6//3)*24,q['id']+': posição nos grupos')
    elif m=='pacotes_limite':
        seq('data-objeto-pacote',d['tamanho_pacote']);seq('data-vaga-pacote',d['maximo_pacotes'])
    elif m=='reserva_carrinhos':
        seq('data-roda-reserva',d['reserva'])
        conferir(len(elems('data-roda-carrinho'))==d['rodas_por_carrinho'],q['id']+': rodas do modelo')
    elif m=='amostras_kits':
        for k in ['A','B']:seq('data-amostra',d['amostras_tipo_'+k],elems('data-tipo',k))
    elif m=='estacas_plantios':
        seq('data-estaca',d['espacos_entre_estacas']+1)
        for e in elems('data-estaca'):
            conferir(F(e.get('data-x'))==g['origem_x']+int(e.get('data-estaca'))*g['passo_x'],q['id']+': estacas igualmente espaçadas')
        conferir([int(e.get('data-plantio')) for e in elems('data-plantio')]==[0,d['espacos_por_planta'],d['espacos_entre_estacas']] and d['espacos_entre_estacas']%d['espacos_por_planta']==0,q['id']+': extremos e padrão de plantio')
    elif m=='sinais_tempo':
        for k in ['A','B']:
            a=elems('data-sinal',k);vals=list(range(d['inicio_'+k],g['limite_minuto']+1,d['intervalo_'+k]))
            conferir([int(e.get('data-minuto')) for e in a]==vals,q['id']+': sequência do sinal '+k)
            for e,v in zip(a,vals):conferir(abs(float(e.get('cx'))-(20+v*280/24))<0.000001,q['id']+': escala temporal')
    elif m=='fitas_comuns':
        for k in ['A','B']:
            a=elems('data-fita',k)
            conferir(len(a)==1 and F(a[0].get('width'))==d['fita_'+k+'_cm']*g['escala_px_por_cm'] and a[0].get('x')=='16',q['id']+': escala da fita')
    elif m=='pecas_retangulo':seq('data-peca',d['pecas'])
    elif m=='grupos_limite':
        for k in ['A','B']:seq('data-objeto',d['grupo_'+k],elems('data-grupo',k))
        a=elems('data-limite-aberto')
        conferir(len(a)==1 and int(a[0].get('data-limite-aberto'))==d['limite_inferior_exclusivo'] and a[0].get('fill')=='white',q['id']+': limite exclusivo')
    elif m=='paginas_marcas':
        paginas=[t for t in texts if t.get('data-pagina')]
        conferir([int(t.get('data-pagina')) for t in paginas]==list(range(d['primeira_pagina'],d['ultima_pagina']+1)) and all(t.text==t.get('data-pagina') for t in paginas),q['id']+': páginas completas')
        for k in ['A','B']:
            conferir([int(e.get('data-pagina')) for e in elems('data-monitor',k)]==[n for n in range(d['primeira_pagina'],d['ultima_pagina']+1) if n%d['passo_'+k]==0],q['id']+': marcações do monitor')
    elif m=='calendario_inspecoes':
        dias=elems('data-dia');seq('data-dia',g['ultimo_dia_exibido']+1,dias)
        for e in dias:
            n=int(e.get('data-dia'))
            conferir(int(e.get('data-coluna'))==n%d['dias_semana'] and int(e.get('data-linha'))==n//d['dias_semana'] and F(e.get('x'))==20+n%7*40 and F(e.get('y'))==122+n//7*42,q['id']+': posição no calendário')
        conferir([int(e.get('data-inspecao')) for e in elems('data-inspecao')]==list(range(0,g['ultimo_dia_exibido']+1,d['intervalo_dias'])),q['id']+': calendário sem reinício')
        labels=elems('data-numero-dia');seq('data-numero-dia',g['ultimo_dia_exibido']+1,labels)
        conferir(all(e.text==e.get('data-numero-dia') for e in labels),q['id']+': números dos dias')
    else:raise ValueError('Modelo MD desconhecido')
    conferir((PASTA/r['arquivo']).read_text().strip()==r['html'],q['id']+': arquivo SVG corresponde ao banco')


def conferir_fr_svg(q,r,svg):
    """Confere frações por áreas, partes iguais, referências e posição na reta."""
    ns='{http://www.w3.org/2000/svg}';d=q['dados'];g=r['geometria'];m=g['modelo']
    texts=svg.findall('.//'+ns+'text')
    conferir(svg.get('viewBox').split()[:3]==['0','0','320'] and svg.get('class')=='mfc-fr-svg' and 'width:100%' in r['css'] and 'height:auto' in r['css'],q['id']+': responsividade FR')
    desc=svg.find(ns+'desc')
    conferir(desc is not None and desc.text==r['acessibilidade'] and svg.get('aria-describedby')==desc.get('id'),q['id']+': descrição FR')
    for t in texts:
        if t.get('data-campo'):
            v=d
            for k in t.get('data-campo').split('.'):
                v=v[int(k)] if isinstance(v,list) else v[k]
            conferir(str(v)==t.get('data-valor') and str(v) in t.text,q['id']+': dados exibidos FR')
    def elems(campo,valor=None):
        return [e for e in svg.iter() if e.get(campo) is not None and (valor is None or e.get(campo)==str(valor))]
    def area(e):return F(e.get('width'))*F(e.get('height'))
    def barra(nome,fracao,partes=None):
        a=elems('data-barra',nome);f=F(fracao);n=partes or f.denominator
        conferir(len(a)==n and [int(e.get('data-parte')) for e in a]==list(range(n)),q['id']+': partição '+nome)
        conferir(len({(e.get('width'),e.get('height'),e.get('y')) for e in a})==1,q['id']+': partes iguais '+nome)
        for i,e in enumerate(a):
            conferir(abs(F(e.get('x'))-F(a[0].get('x'))-i*F(e.get('width')))<F(1,1000000),q['id']+': partes contíguas '+nome)
            conferir(e.get('data-preenchida')==str(i<int(f*n)).lower() and (e.get('fill')=='#aac7dd')==(i<int(f*n)),q['id']+': preenchimento '+nome)
        conferir(F(sum(e.get('data-preenchida')=='true' for e in a),len(a))==f,q['id']+': proporção '+nome)
        return a
    if m=='placas_referencias':
        conferir(g['escala_entre_inteiros']=='comum_por_area' and 'mesma escala de área' in q['enunciado'],q['id']+': inteiros em escala de área')
        for k in ['A','B']:
            a=elems('data-barra',k);f=F(d['fracao_'+k])
            conferir(len(a)==f.denominator and [int(e.get('data-parte')) for e in a]==list(range(f.denominator)) and len({area(e) for e in a})==1,q['id']+': partes iguais da placa')
            conferir(sum(area(e) for e in a)==d['area_placa_'+k+'_cm2']*g['area_px2_por_cm2'],q['id']+': escala real das áreas totais')
            conferir(F(sum(e.get('data-preenchida')=='true' for e in a),len(a))==f and all((e.get('fill')=='#aac7dd')==(e.get('data-preenchida')=='true') for e in a),q['id']+': fração pintada da placa')
            eixo,medida,fixo=('x','width','y') if k=='A' else ('y','height','x')
            conferir(len({e.get(fixo) for e in a})==1 and all(F(e.get(eixo))==F(a[0].get(eixo))+i*F(e.get(medida)) for i,e in enumerate(a)),q['id']+': partições contíguas das placas')
    elif m=='folha_subinteiro':
        a,b,c=[elems('data-regiao',k)[0] for k in ['etiqueta','outra_etiqueta','metade_inteira']]
        total=area(a)+area(b)+area(c)
        conferir(area(a)==area(b) and area(a)/total==F(1,d['primeira_divisao']*d['segunda_divisao_da_metade']) and area(c)/total==F(1,d['primeira_divisao']) and area(c)==area(a)+area(b),q['id']+': três regiões de áreas diferentes')
        conferir(F(a.get('y'))+F(a.get('height'))==F(b.get('y')) and F(a.get('x'))+F(a.get('width'))==F(c.get('x')),q['id']+': divisões da folha')
    elif m=='reservas_bobina':
        a=barra('A',d['reserva_A']);b=barra('B',d['reserva_B'])
        conferir(sum(area(e) for e in a)==sum(area(e) for e in b),q['id']+': mesmo inteiro da bobina')
    elif m=='reta_oitavos':
        a=elems('data-marca');n=d['partes_iguais']
        conferir([F(e.get('data-marca')) for e in a]==[F(i,n) for i in range(n+1)],q['id']+': marcas de oitavos')
        for i,e in enumerate(a):conferir(F(e.get('data-x'))==g['origem_x']+F(i,n)*g['largura_reta'],q['id']+': escala fracionária')
        labels=elems('data-rotulo-marca')
        conferir([int(t.get('data-rotulo-marca')) for t in labels]==list(range(n+1)) and [t.text for t in labels]==['0']+[str(i)+'/'+str(n) for i in range(1,n)]+['1'],q['id']+': rótulos das marcas')
        t=elems('data-pedido')[0]
        conferir(t.get('data-pedido')==d['fracao_pedida'] and F(t.get('data-x'))==g['origem_x']+F(d['fracao_pedida'])*g['largura_reta'],q['id']+': posição do pedido')
    elif m=='cartolina_restante':
        a=elems('data-terco');conferir([int(e.get('data-terco')) for e in a]==list(range(3)) and len({area(e) for e in a})==1 and F(sum(e.get('data-usado')=='true' for e in a),len(a))==F(d['uso_inicial']),q['id']+': uso inicial da cartolina')
    elif m=='estoque_quintos':barra('estoque',d['fracao_catalogada'])
    elif m=='fitas_referencia':
        a=barra('A',d['pedaco_de_A']);b=elems('data-fita-inteira','B')[0]
        conferir(sum(F(e.get('width')) for e in a)==d['fita_A_cm']*g['escala_px_por_cm'] and F(b.get('width'))==d['fita_B_cm']*g['escala_px_por_cm'] and b.get('fill')=='white' and all(e.get('height')==b.get('height') for e in a),q['id']+': escala dos comprimentos')
    elif m=='tempo_propostas':
        nomes=[('debate',d['debate']),('perguntas_minimas',d['perguntas_minimas'])]+[('propostas.'+str(i),v) for i,v in enumerate(d['propostas'])]
        inteiros=[sum(area(e) for e in barra(k,v,12)) for k,v in nomes]
        conferir(len(set(inteiros))==1,q['id']+': mesmo tempo total')
    elif m=='recipientes_reparticao':
        for k in ['A','B']:
            a=elems('data-liquido',k)[0];f=F(d['recipiente_'+k])
            conferir(F(a.get('width'))==g['largura_recipiente'] and F(a.get('height'))==g['altura_recipiente']*f and F(a.get('y'))+F(a.get('height'))==49+g['altura_recipiente'],q['id']+': preenchimento do recipiente')
        conferir(d['recipientes']==2,q['id']+': repartição em dois recipientes')
    elif m=='painel_sobreposicao':
        a=elems('data-regiao');n=g['linhas']*g['colunas']
        conferir([int(e.get('data-regiao')) for e in a]==list(range(n)) and len({area(e) for e in a})==1,q['id']+': regiões de mesma área')
        for e in a:
            i=int(e.get('data-regiao'));row,col=divmod(i,g['colunas'])
            conferir(F(e.get('x'))==40+col*g['largura_regiao'] and F(e.get('y'))==54+row*g['altura_regiao'] and (e.get('fill')=='#aac7dd')==(e.get('data-azul')=='true'),q['id']+': posição e cor do painel')
        for key,test in [('azul',lambda e:e.get('data-azul')=='true'),('textura',lambda e:e.get('data-textura')=='true'),('ambos',lambda e:e.get('data-azul')=='true' and e.get('data-textura')=='true')]:
            conferir(F(sum(test(e) for e in a),n)==F(d[key]),q['id']+': fração de '+key)
        textured=elems('data-sobre-textura')
        conferir([int(e.get('data-sobre-textura')) for e in textured]==[int(e.get('data-regiao')) for e in a if e.get('data-textura')=='true'],q['id']+': textura aplicada')
        for e in textured:
            base=a[int(e.get('data-sobre-textura'))]
            conferir(all(e.get(k)==base.get(k) for k in ['x','y','width','height']) and e.get('fill')=='url(#'+q['id']+'-textura)',q['id']+': sobreposição exata')
    elif m=='relatorios_grupos':
        for k in ['A','B']:
            unidades=elems('data-equipe',k);n=d['total_equipe_'+k];grupos=elems('data-grupo-equipe',k)
            conferir([int(e.get('data-relatorio')) for e in unidades]==list(range(n)) and [int(e.get('data-grupo')) for e in grupos]==list(range(4)) and all(e.get('fill')=='white' for e in unidades),q['id']+': relatórios em grupos iguais')
            for j,e in enumerate(unidades):
                group,pos=divmod(j,n//4);x=29 if k=='A' else 173
                conferir(F(e.get('x'))==x+13+pos%3*32 and F(e.get('y'))==85+group*60+7+pos//3*23,q['id']+': posição dos relatórios')
    elif m=='faixa_pecas':
        a=barra('faixa',d['ja_coberto']);peca=elems('data-peca','modelo')[0]
        conferir(sum(F(e.get('width')) for e in a)==g['largura_faixa'] and F(peca.get('width'))==g['largura_faixa']*F(d['por_peca']) and all(F(e.get('height'))==F(peca.get('height'))==g['altura_faixa'] for e in a),q['id']+': mesma escala de faixa e peça')
    else:raise ValueError('Modelo FR desconhecido')
    conferir((PASTA/r['arquivo']).read_text().strip()==r['html'],q['id']+': arquivo SVG corresponde ao banco')


def conferir_nd_svg(q,r,svg):
    """Confere escritas decimais, medidas em escala, reservas e retas de ND."""
    ns='{http://www.w3.org/2000/svg}';d=q['dados'];g=r['geometria'];m=g['modelo'];texts=svg.findall('.//'+ns+'text')
    conferir(svg.get('viewBox').split()[:3]==['0','0','320'] and svg.get('class')=='mfc-nd-svg' and 'width:100%' in r['css'] and 'height:auto' in r['css'],q['id']+': responsividade ND')
    desc=svg.find(ns+'desc')
    conferir(desc is not None and desc.text==r['acessibilidade'] and svg.get('aria-describedby')==desc.get('id'),q['id']+': descrição ND')
    for t in texts:
        if t.get('data-campo'):
            v=d
            for k in t.get('data-campo').split('.'):
                v=v[int(k)] if isinstance(v,list) else v[k]
            conferir(str(v)==t.get('data-valor') and str(v).replace('.',',') in t.text,q['id']+': dado decimal exibido')
    def elems(campo,valor=None):return [e for e in svg.iter() if e.get(campo) is not None and (valor is None or e.get(campo)==str(valor))]
    def perto(a,b):return abs(F(a)-F(b))<F(1,1000000)
    def escala_reta():
        inicio,fim,passo=F(g['minimo']),F(g['maximo']),F(g['passo']);a=elems('data-marca');n=int((fim-inicio)/passo)
        vals=[inicio+i*passo for i in range(n+1)]
        conferir([F(e.get('data-marca')) for e in a]==vals,q['id']+': marcas decimais')
        for e,v in zip(a,vals):conferir(perto(e.get('data-x'),g['origem_x']+(v-inicio)/(fim-inicio)*g['largura_reta']),q['id']+': posição proporcional na reta')
    if m=='etiquetas_ordens':
        for k in ['A','B']:
            inteiro,frac=d['etiqueta_'+k+'_kg'].split('.');esperado=[inteiro]+list(frac)+['—']*(3-len(frac));t=[t for t in texts if t.get('data-quadro')==k]
            conferir([t.get('data-ordem') for t in t]==['U','d','c','m'] and [t.text for t in t]==esperado,q['id']+': ordens e zeros preservados')
    elif m=='larguras_tolerancia':
        for k in ['A','B']:
            e=elems('data-largura',k)[0]
            conferir(perto(e.get('width'),F(d['largura_'+k+'_m'])*g['escala_px_por_m']) and e.get('x')=='20',q['id']+': escala comparativa das larguras')
    elif m=='jarra_reserva':
        scale=F(g['escala_px_por_ml']);base=F(g['base_y'])
        for campo,key in [('data-conteudo','conteudo_ml'),('data-reserva','reserva_obrigatoria_ml')]:
            e=elems(campo)[0]
            conferir(perto(e.get('height'),d[key]*scale) and perto(F(e.get('y'))+F(e.get('height')),base),q['id']+': nível na jarra')
        conferir(d['reserva_obrigatoria_ml']<=d['conteudo_ml'],q['id']+': reserva dentro do conteúdo')
        a=elems('data-graduacao');conferir([int(e.get('data-graduacao')) for e in a]==list(range(0,d['mililitros_por_litro']+1,200)),q['id']+': graduações em mililitros')
        for e in a:conferir(perto(e.get('data-y'),base-int(e.get('data-graduacao'))*scale),q['id']+': escala da graduação')
    elif m=='reta_referencia':
        escala_reta();e=elems('data-inicio')[0]
        conferir(e.get('data-inicio')==d['medicao'] and perto(e.get('cx'),g['origem_x']+(F(d['medicao'])-F(g['minimo']))/(F(g['maximo'])-F(g['minimo']))*g['largura_reta']),q['id']+': medição inicial na reta')
        conferir(any(F(e.get('data-marca'))==d['referencia'] for e in elems('data-marca')),q['id']+': referência inteira na reta')
    elif m=='termometro_arredonda':
        escala_reta()
        labels=elems('data-rotulo-marca');conferir([F(e.get('data-rotulo-marca')) for e in labels]==[F('23.30')+i*F('0.05') for i in range(5)] and all(F(t.text.replace(',','.'))==F(t.get('data-rotulo-marca')) for t in labels),q['id']+': rótulos do termômetro')
        mostrada=F(d['temperatura_mostrada']);inferior=mostrada-F('0.05');superior=mostrada+F('0.05')
        conferir(arredonda(inferior,F('0.1'))==mostrada and arredonda(superior,F('0.1'))==mostrada+F('0.1'),q['id']+': limite inferior incluído e superior excluído')
        conferir(q.get('criterio_opcao')=='intervalo_superior_exclusivo',q['id']+': critério do intervalo')
        validas=[o['letra'] for o in q['alternativas'] if arredonda(F(o['valor']),F('0.1'))==mostrada]
        conferir(validas==[q['gabarito']],q['id']+': arredondamento independente das quatro alternativas')
    elif m=='taxa_percurso':
        a=elems('data-trecho');conferir([int(e.get('data-trecho')) for e in a]==list(range(3)) and sum(F(e.get('width')) for e in a)==F(d['distancia_km'])*g['escala_px_por_km'] and F(a[0].get('width'))==F(a[1].get('width'))==2*F(a[2].get('width')),q['id']+': percurso com meio quilômetro')
    elif m=='prateleira_caixas':
        e=elems('data-prateleira')[0];scale=g['escala_px_por_m'];conferir(perto(e.get('width'),F(d['prateleira_m'])*scale),q['id']+': largura da prateleira')
        a=elems('data-caixa');conferir([int(e.get('data-caixa')) for e in a]==list(range(len(d['larguras_m']))),q['id']+': três caixas')
        x=F(24)
        for e,v in zip(a,d['larguras_m']):
            conferir(perto(e.get('width'),F(v)*scale) and perto(e.get('x'),x),q['id']+': caixas proporcionais e contíguas');x+=F(v)*scale
    elif m=='fio_orcamento':
        conferir(len([t for t in texts if t.get('data-campo')=='preco_por_metro_reais'])==1 and any(t.text=='1 metro' for t in texts),q['id']+': unidade de referência do fio')
    elif m=='frascos_compra':
        for k in ['A','B']:
            e=elems('data-frasco',k)[0]
            conferir(F(e.get('width'))==g['largura_corpo'] and perto(e.get('height'),F(d['frasco_'+k+'_l'])*g['escala_altura_px_por_l']),q['id']+': capacidades proporcionais')
        n_a=F(d['pedido_l'])/F(d['frasco_A_l']);n_b=F(d['pedido_l'])/F(d['frasco_B_l'])
        conferir(n_a.denominator==1 and n_b.denominator!=1 and Modelo(d).ler(q['modelo_verificacao'])==[n_a,n_a*F(d['frasco_A_reais'])],q['id']+': frascos inteiros e volume exato')
    elif m=='reta_cortes':
        a=elems('data-marca');conferir([e.get('data-marca') for e in a]==g['marcas'],q['id']+': marcas permitidas de corte')
        for i,e in enumerate(a):conferir(F(e.get('data-x'))==g['origem_x']+i*g['passo_x'],q['id']+': espaçamento das marcas')
        vals=[F(v) for v in g['marcas']];conferir(all(b-a==F(d['passo_cm']) for a,b in zip(vals,vals[1:])),q['id']+': passo decimal')
        e=elems('data-pedido')[0];x=g['origem_x']+(F(d['medida_pedida_cm'])-vals[0])/F(d['passo_cm'])*g['passo_x']
        conferir(e.get('data-pedido')==d['medida_pedida_cm'] and F(e.get('data-x'))==x,q['id']+': pedido precisamente localizado')
        labels=elems('data-rotulo-marca');conferir([t.text for t in labels]==[v.replace('.',',') for v in g['marcas']],q['id']+': rótulos de corte')
    elif m=='precos_arredondamento':
        a=[t for t in texts if (t.get('data-campo') or '').startswith('itens_reais.')]
        conferir([t.get('data-valor') for t in a]==d['itens_reais'],q['id']+': três etiquetas de preços')
    elif m=='rolo_tiras':
        a=elems('data-tira');reserva=elems('data-reserva')[0];scale=g['escala_px_por_m'];comprimento=(F(d['rolo_m'])-F(d['sobra_minima_m']))/d['tiras']
        conferir([int(e.get('data-tira')) for e in a]==list(range(d['tiras'])) and all(F(e.get('width'))==comprimento*scale and F(e.get('x'))==20+i*comprimento*scale for i,e in enumerate(a)),q['id']+': tiras iguais em escala')
        conferir(F(reserva.get('width'))==F(d['sobra_minima_m'])*scale and F(reserva.get('x'))==20+d['tiras']*comprimento*scale and sum(F(e.get('width')) for e in a)+F(reserva.get('width'))==F(d['rolo_m'])*scale,q['id']+': reserva mínima e comprimento total')
    else:raise ValueError('Modelo ND desconhecido')
    conferir((PASTA/r['arquivo']).read_text().strip()==r['html'],q['id']+': arquivo SVG corresponde ao banco')


def conferir_svg(q,r):
    svg=ET.fromstring(r['html']);ns='{http://www.w3.org/2000/svg}'
    conferir(svg.tag==ns+'svg' and svg.get('viewBox') and svg.get('role')=='img',q['id']+': SVG raiz')
    titulo=svg.find(ns+'title')
    conferir(titulo is not None and titulo.text and svg.get('aria-labelledby')==titulo.get('id'),q['id']+': SVG acessível')
    conferir(all(e.tag not in [ns+'script',ns+'foreignObject',ns+'image'] for e in svg.iter()),q['id']+': SVG deve ser estático')
    g=r['geometria'];d=q['dados'];rects=svg.findall('.//'+ns+'rect')
    if g['tipo']=='sn_revisao':
        conferir_sn_svg(q,r,svg)
    elif g['tipo']=='on_revisao':
        conferir_on_svg(q,r,svg)
    elif g['tipo']=='md_revisao':
        conferir_md_svg(q,r,svg)
    elif g['tipo']=='fr_revisao':
        conferir_fr_svg(q,r,svg)
    elif g['tipo']=='nd_revisao':
        conferir_nd_svg(q,r,svg)
    elif g['tipo']=='grade':
        conferir(len(rects)==d['linhas']*d['colunas'],q['id']+': grade')
        pares={(int(x.get('data-linha')),int(x.get('data-coluna'))) for x in rects}
        conferir(pares=={(y,x) for y in range(d['linhas']) for x in range(d['colunas'])},q['id']+': células')
        borda=sum(x.get('fill')!='white' for x in rects)
        conferir(borda==2*d['linhas']+2*d['colunas']-4,q['id']+': borda')
    elif g['tipo']=='placas':
        for k in ['A','B']:
            pintado=next(x for x in rects if x.get('data-placa')==k)
            esperado=F(d['area_placa_'+k+'_cm2'])*F(d['fracao_'+k])*g['escala_largura']
            conferir(F(pintado.get('width'))==esperado,q['id']+': área pintada '+k)
    elif g['tipo']=='dobras':
        conferir(len(rects)==2 and F(rects[1].get('width'))/F(rects[0].get('width'))*F(rects[1].get('height'))/F(rects[0].get('height'))==F(1,4),q['id']+': etiqueta/folha')
    elif g['tipo']=='tercos':
        conferir(len(rects)==3 and len({x.get('width') for x in rects})==1 and sum(x.get('fill')!='white' for x in rects)==1,q['id']+': terços')
    elif g['tipo']=='estacas':
        estacas=[x for x in svg.iter() if x.get('data-estaca') is not None]
        conferir(len(estacas)==d['espacos_entre_estacas']+1,q['id']+': estacas')
    elif g['tipo']=='reta_decimal':
        marcas=[x for x in svg.iter() if x.get('data-marca')]
        conferir([F(x.get('data-marca').replace(',','.')) for x in marcas]==[F(v) for v in g['marcas']],q['id']+': marcas')
        ponto=next(x for x in svg.iter() if x.get('data-pedido'))
        x=F(g['origem_x'])+(F(d['medida_pedida_cm'])-F(g['marcas'][0]))/F(d['passo_cm'])*g['passo_x']
        conferir(F(ponto.get('cx'))==x,q['id']+': posição decimal')
    else:raise ValueError('Geometria desconhecida')


def correta(q,valor,resultado):
    criterio=q.get('criterio_opcao','valor_exato')
    if criterio=='texto_exato':return valor==resultado
    if criterio=='intervalo_inclusivo':return F(resultado[0])<=F(valor)<=F(resultado[1])
    if criterio=='intervalo_superior_exclusivo':return F(resultado[0])<=F(valor)<F(resultado[1])
    return normalizar(valor)==normalizar(resultado)

def conferir(ok,mensagem):
    if not ok:raise ValueError(mensagem)

def validar():
    manifesto=json.loads((PASTA/'manifesto.json').read_text())
    regras=manifesto['regras_selecao']
    conferir(manifesto['arquivos']==ARQUIVOS and regras['total_questoes']==30 and sum(regras['por_assunto'].values())==30 and set(regras['por_assunto'].values())=={6} and regras['minimo_questoes_com_visual_relevante']==15,'Manifesto: restrições do sorteio')
    cotas={'SN':{'facil':2,'media':3,'dificil':1},'ON':{'facil':2,'media':2,'dificil':2},'MD':{'facil':1,'media':3,'dificil':2},'FR':{'facil':2,'media':3,'dificil':1},'ND':{'facil':1,'media':3,'dificil':2}}
    conferir(regras['dificuldade_por_assunto']==cotas and regras['dificuldade_total']=={'facil':8,'media':14,'dificil':8} and regras['minimo_visuais_por_assunto']==3,'Manifesto: cotas aprovadas')
    ids=set();titulos=set();enunciados=set();resumo={};letras={l:0 for l in 'ABCD'};revisao=[]
    for file in ARQUIVOS:
        b=json.loads((PASTA/file).read_text());codigo=b['codigo_assunto'];qs=b['questoes']
        conferir(len(qs)==20 and manifesto['quantidade_por_assunto'][codigo]==20 and regras['por_assunto'][codigo]==6,file+': contagem')
        por_nivel={n:{'total':0,'visuais':0} for n in ['facil','media','dificil']};visuais=0
        for n,q in enumerate(qs,1):
            id=q['id'];conferir(id==f'MFC6-B1-I-{codigo}-{n:02}' and id not in ids,id+': identificação');ids.add(id)
            conferir(q['titulo'] not in titulos and q['enunciado'] not in enunciados,id+': repetição editorial');titulos.add(q['titulo']);enunciados.add(q['enunciado'])
            conferir(q['assunto']==codigo and q['assunto_nome']==b['assunto'],id+': assunto')
            conferir(q['enunciado'] and q['resolucao_comentada'] and q['habilidade'],id+': conteúdo incompleto')
            nivel=q['dificuldade']['nivel'];conferir(nivel in por_nivel and q['dificuldade']['justificativa'],id+': dificuldade');por_nivel[nivel]['total']+=1
            conferir(q['sorteio']['nivel']==nivel and q['sorteio']['assunto']==codigo and q['sorteio']['grupo_equivalencia']==id,id+': metadados de sorteio')
            opcoes=q['alternativas'];conferir([o['letra'] for o in opcoes]==list('ABCD'),id+': alternativas')
            conferir(len({o['texto'] for o in opcoes})==4,id+': textos de opções repetidos')
            resultado=Modelo(q['dados']).ler(q['modelo_verificacao'])
            if id=='MFC6-B1-I-ON-19':
                c=q['comparacao_por_compensacao'];d=q['dados'];ref=c['referencia_caixas']*c['referencia_folhas_por_caixa']
                total_a,total_b=[x[0]*x[1] for x in [d['oferta_A'],d['oferta_B']]]
                conferir(ref-total_a==c['retirada_A_folhas'] and ref-total_b==c['retirada_B_folhas'] and c['retirada_B_folhas']-c['retirada_A_folhas']==c['diferenca_folhas']==resultado,id+': compensação')
            validas=[o for o in opcoes if correta(q,o['valor'],resultado)]
            conferir(len(validas)==1,id+': '+str(len(validas))+' respostas válidas; cálculo='+str(resultado))
            conferir(validas[0]['letra']==q['gabarito'],id+': gabarito')
            conferir(validas[0]['erro_comum'] is None and all(o['erro_comum'] for o in opcoes if o!=validas[0]),id+': distratores')
            letras[q['gabarito']]+=1
            visual=q['sorteio']['visual_relevante'];conferir(visual==bool(q['recursos_visuais']),id+': recurso visual')
            for r in q['recursos_visuais']:
                conferir(r['dados']==q['dados'] and r['relevancia'] and r['acessibilidade'],id+': coerência de dados visuais')
                conferir(not re.search(r'\bon\w+\s*=|javascript:|(?:href|src)\s*=\s*[\"\']https?://',r['html'],re.I),id+': recurso externo/ativo')
                if r['tipo']=='tabela_html':
                    t=Tabela();t.feed(r['html'])
                    celula=str if codigo=='SN' else texto_celula
                    esperado=[[celula(h) for h in r['cabecalhos']]]+[[celula(v) for v in row] for row in r['linhas']]
                    conferir(t.linhas==esperado and all(s in ['row','col'] for s in t.escopos),id+': tabela/escopos')
                    if codigo=='SN':conferir_sn_tabela(q,r)
                elif r['tipo']=='svg':
                    conferir_svg(q,r)
                else:raise ValueError(id+': tipo de recurso desconhecido')
            if visual:visuais+=1;por_nivel[nivel]['visuais']+=1
            conferir(q['revisao_pedagogica']['status']=='aprovada' and not q['revisao_pedagogica']['impedimento_identificado'],id+': revisão pedagógica concluída')
            if q['revisao_pedagogica']['impedimento_identificado']:revisao.append(id)
        conferir(visuais>=10 and all(v['visuais']>0 for v in por_nivel.values()),codigo+': distribuição visual')
        conferir(visuais>=3 and len(qs)-visuais>=3,codigo+': inviável escolher 3 visuais + 3 sem apoio')
        resumo[codigo]={'questoes':len(qs),'validadas':len(qs),'visuais':visuais,'por_dificuldade':por_nivel}
    conferir(len(ids)==100 and sum(r['visuais'] for r in resumo.values())>=50,'Total do banco')
    return {'resultado':'validado_matematica_e_estrutura','questoes':100,'validadas':100,'visuais':sum(r['visuais'] for r in resumo.values()),'por_assunto':resumo,'gabaritos':letras,'impedimentos_identificados':revisao,'revisao_pedagogica_final':'Revisão dos 100 itens concluída pelo usuário; status aprovada verificado. O validador matemático não substitui a aprovação humana.','arquivos_sha256':{file:hashlib.sha256((PASTA/file).read_bytes()).hexdigest() for file in ARQUIVOS},'limites':'Modelos conferem respostas e dados visuais estruturados; não certificam por si sós a interpretação pedagógica, originalidade externa ou renderização em navegador.'}

if __name__=='__main__':print(json.dumps(validar(),ensure_ascii=False,indent=2))
