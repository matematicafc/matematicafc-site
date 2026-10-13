# Desenvolvimento e organização

## Convenções

- Usar nomes de pastas e arquivos em minúsculas, sem espaços ou acentos e com hífens: `fracoes-equivalentes`.
- Organizar cada recurso dentro da área correspondente, em uma pasta própria.
- Manter arquivos exclusivos de um recurso junto dele. Mover para `compartilhado/` somente o que tiver reutilização real.
- Priorizar recursos pequenos e autônomos, sem framework ou etapa de build obrigatórios.
- Adicionar dependências apenas quando houver justificativa; documentar versão, origem e forma de carregamento.

## Estrutura sugerida para um recurso futuro

```text
<area>/<nome-do-recurso>/
├── README.md
├── index.html
├── estilos.css
├── script.js
└── imagens/          # somente quando necessário
```

Essa estrutura é uma convenção, não um recurso criado nesta etapa. Para o IFRN,
o caminho será `simulados-if/ifrn/<nome-do-recurso>/`.

O README de cada recurso deverá registrar público, objetivos, pré-requisitos,
conteúdos, comportamento esperado, referências, direitos de uso de imagens,
instruções de execução local, testes realizados e procedimento de incorporação
no Blogger. Separar claramente o que foi validado do que continua pendente.

## Fluxo de trabalho

1. Definir o objetivo pedagógico e os critérios de aceitação.
2. Elaborar e revisar questões originais, respostas, explicações e ilustrações.
3. Implementar HTML semântico, CSS responsivo e JavaScript com feedback acessível.
4. Validar localmente o comportamento com respostas corretas, incorretas e ausentes.
5. Verificar os critérios de qualidade e preparar as instruções para o Blogger.
6. Mediante autorização, validar a integração em um rascunho do Blogger antes da publicação manual.

Não incluir chaves, credenciais ou dados pessoais em arquivos do projeto.
Funcionalidades que exigirem serviços externos devem ter suas necessidades
documentadas antes da implementação.
