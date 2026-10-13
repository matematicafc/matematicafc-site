# Integração com o Blogger

## HTML, CSS e JavaScript

- Desenvolver uma página HTML local para validação; documentar quais trechos poderão ser incorporados à postagem ou ao gadget.
- Usar um contêiner exclusivo por recurso e prefixos como `mfc-` para classes. Restringir seletores CSS ao contêiner, evitando regras globais que afetem o tema.
- Isolar variáveis e funções JavaScript. Evitar globais e permitir a presença de mais de um recurso na mesma página.
- Não depender de acesso ao servidor do Blogger, de backend próprio ou de caminhos relativos ao repositório no conteúdo publicado.
- Usar HTTPS para arquivos externos. Documentar onde cada arquivo será hospedado e sua URL antes da integração.
- Carregar scripts apenas quando necessários e inicializar depois que o contêiner estiver disponível. Evitar carregar a mesma biblioteca várias vezes.
- Evitar dependência de fontes, bibliotecas ou imagens grandes para funções simples.
- Validar em rascunho autorizado: o tema e o editor do Blogger podem interferir no HTML, nos estilos ou na execução dos scripts.

## MathJax e valores monetários

Usar MathJax apenas em recursos que precisem de notação matemática além do HTML.
Preferir os delimitadores explícitos `\(...\)` para fórmulas em linha e
`\[...\]` para fórmulas destacadas. **Não habilitar `$...$` como delimitador**:
o símbolo de moeda em `R$ 25,00` deve permanecer texto comum.

Antes de integrar, conferir se o tema já carrega MathJax e quais delimitadores
estão configurados. Quando o carregamento for responsabilidade do recurso,
definir a configuração antes de carregar a biblioteca e registrar sua versão.
Não substituir silenciosamente a configuração existente do site; documentar
qualquer incompatibilidade encontrada.

Após alterações dinâmicas, atualizar somente a notação matemática do contêiner
afetado usando a API da versão adotada. Na validação, conferir fórmulas em linha,
fórmulas destacadas, valores em reais e várias ocorrências de `R$` na mesma página.
Oferecer explicações textuais compreensíveis e verificar a leitura assistiva.

## Publicação

O repositório não publica no Blogger automaticamente. Preparar instruções
manuais por recurso, com trechos necessários, dependências e verificações de
integração. Criar ou alterar postagens, gadgets e configurações do tema exige
autorização explícita. A implementação local não comprova integração no site.
