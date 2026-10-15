# MatemáticaFC — inspeção da reconstrução do 7º ano no Windows

Esta branch contém os 29 arquivos da versão validada, duas documentações de
inspeção e o README original da main. Não inclui ZIPs, a interface antiga,
o simulado do 6º ano, dependências de desenvolvimento ou resultados pessoais.
A revisão pedagógica definitiva permanece pendente. Não é publicação do simulado.

## 1. Obter o conjunto completo

Requer Git e Python 3 instalados a partir das fontes oficiais. Não requer Node,
Playwright, npm, cadastro no simulado ou acesso ao servidor do Codex.
Com todas as proteções do Windows ativas, abra o Terminal ou PowerShell na
pasta em que deseja guardar uma cópia NOVA e execute:

```powershell
git clone --single-branch --branch inspecao-reconstrucao-7ano https://github.com/matematicafc/matematicafc-site.git matematicafc-inspecao-7ano
cd matematicafc-inspecao-7ano
git branch --show-current
```

A branch informada deve ser `inspecao-reconstrucao-7ano`.
Não baixe só a pasta `reconstrucao`: ela depende do banco, motor, configuração e
utilidade incluídos nesta branch. Não mova arquivos nem misture cópias antigas.
Não use Download ZIP para este procedimento.

**Se o Defender bloquear a obtenção ou remover algum arquivo, interrompa.**
Não desative proteções, crie exclusões, restaure arquivos bloqueados ou force o
download. Usar Git é apenas a forma de obter os arquivos versionados; não é um
método para superar o bloqueio do antivírus. A detecção anterior
`Trojan:Script/Ulthar.A!ml` permanece sem causa confirmada e a reconstrução ainda
não foi aprovada pelo Microsoft Defender.

## 2. Conferir antes de abrir

Execute uma verificação da pasta com o Microsoft Defender. Se necessário, use
Segurança do Windows → Proteção contra vírus e ameaças → Opções de verificação
→ Verificação personalizada, selecionando a pasta da cópia.

Os hashes SHA-256 e tamanhos dos 29 arquivos estão em
`7-ano/bloco-1/reconstrucao/manifesto-inspecao.json`.
Para verificar todos no PowerShell, estando na raiz da cópia:

```powershell
$mfcManifesto = Get-Content -Raw -Encoding UTF8 '7-ano/bloco-1/reconstrucao/manifesto-inspecao.json' | ConvertFrom-Json
foreach ($mfcArquivo in $mfcManifesto.arquivos) {
    $mfcHash = (Get-FileHash -LiteralPath $mfcArquivo.caminho -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($mfcHash -ne $mfcArquivo.sha256) { throw "Arquivo ausente ou divergente: $($mfcArquivo.caminho)" }
}
Write-Host 'Os 29 arquivos correspondem ao manifesto.'
```

Hash correspondente comprova identidade com esta versão, não ausência de ameaças.
Se faltar arquivo ou houver divergência/alerta, não prossiga para a execução.

## 3. Iniciar o servidor neste notebook

Após as verificações, na MESMA pasta raiz da cópia:

```powershell
py -3 --version
py -3 -m http.server 8000 --bind 127.0.0.1
```

Se Python estiver disponível somente pelo comando `python`, use
`python -m http.server 8000 --bind 127.0.0.1`.
Mantenha o terminal aberto. O servidor escuta apenas neste computador.
Não exige execução como administrador nem configuração de acesso público.
Se a porta 8000 estiver ocupada, use 8001 no comando e no endereço abaixo.

Abra no Edge ou Chrome deste mesmo notebook:

```text
http://127.0.0.1:8000/7-ano/bloco-1/reconstrucao/interface/
```

Esse endereço só passa a funcionar depois que o comando for executado no seu
notebook. Não é o localhost do Codex nem um endereço público.
Não abra o HTML com duplo clique (`file://`). Para encerrar, pressione Ctrl+C
no terminal. Fechar/recarregar a página encerra a tentativa atual.

## 4. Roteiro de avaliação

1. Confira favicon, identificação do 7º ano e aviso de revisão pedagógica pendente.
2. Comece sem nome ou use um nome explicitamente fictício.
3. Responda algumas questões, navegue e confira a preservação das respostas.
4. Examine SVGs e tabelas, inclusive em janela estreita e com texto ampliado.
5. Teste Tab, Shift+Tab, Enter, Espaço, setas nas alternativas e foco visível.
6. Abra a confirmação de finalização, cancele e confira o retorno do foco.
7. Finalize com questões em branco e confira acertos, erros e não respondidas.
8. Confira os cinco conteúdos com seis questões, o gabarito e as resoluções.
9. Baixe o PDF e examine a impressão, observando nome fictício, data,
   correspondência das alternativas/resoluções e integridade dos desenhos.
10. Inicie nova aplicação e confira respostas zeradas.

As tentativas têm 30 questões, 6 por conteúdo, dificuldade 8/14/8 e pelo menos
3 visuais por conteúdo. A única biblioteca de PDF é jsPDF 4.2.1, local.
Os dados do estudante permanecem no navegador; não há envio de resultados.

## Evidências e limites

Os 29 arquivos foram comparados byte por byte com a cópia mínima testada.
A validação anterior executou 51 testes e 10.000 sorteios sem violações.
Esses testes foram realizados em Linux/Chromium, não constituem aprovação do
Defender, teste humano com leitor de tela ou teste de impressora física.
Há verificações humanas de contraste pendentes e o PDF não possui marcação
estrutural (tagged PDF), limitação já existente.

Nenhuma proteção deve ser ignorada com base nos resultados funcionais.
Qualquer nova detecção deve ser registrada com nome, caminho, ação e data e versão
das definições do Defender para análise oficial da Microsoft.
A aprovação definitiva e a publicação continuam pendentes.
