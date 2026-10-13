# MatemáticaFC — recursos educacionais para o site

Repositório de desenvolvimento e aperfeiçoamento dos recursos do
[MatemáticaFC](https://www.matematicafc.com), publicado no **Blogger**.
Todo o conteúdo pedagógico deve ser escrito em português do Brasil.
Este projeto é independente do aplicativo MatemáticaFC.

## Áreas do projeto

| Pasta | Finalidade |
| --- | --- |
| [atividades-interativas/](atividades-interativas/README.md) | Exercícios de Matemática do Ensino Fundamental e Médio, com correção automática e explicações. |
| [simulados-enem/](simulados-enem/README.md) | Questões originais no estilo ENEM, navegação, acompanhamento de respostas e gabarito comentado. |
| [simulados-if/ifrn/](simulados-if/ifrn/README.md) | Simulados originais para o IFRN, fundamentados nos editais e provas de referência. |
| [melhorias-postagens/](melhorias-postagens/README.md) | Gráficos, animações, explicações matemáticas, recursos visuais e melhorias de layout. |
| [compartilhado/](compartilhado/README.md) | Estilos, scripts e imagens reutilizáveis, quando houver necessidade real. |
| [docs/](docs/README.md) | Orientações de desenvolvimento, integração e revisão. |

## Princípios

- Usar HTML, CSS e JavaScript, com prioridade para a compatibilidade com o Blogger.
- Atender computadores, tablets e celulares, com acessibilidade e carregamento rápido.
- Favorecer clareza pedagógica, situações-problema e feedback explicativo.
- Usar MathJax somente quando necessário, sem interpretar valores como `R$ 25,00` como fórmulas.
- Desenvolver, revisar e testar os materiais antes de qualquer publicação.
- Nos simulados, seguir as [regras pedagógicas e de boletins](docs/simulados.md): pelo menos 50% de questões com recursos visuais relevantes, nome opcional, resultados locais no navegador, PDF e compartilhamento voluntário.
- Publicar no Blogger apenas mediante autorização explícita; não há publicação automática.

## Estado atual

O projeto contém estrutura, documentação e o
[banco do Simulado do 6º ano — Bloco 1](atividades-interativas/simulados/6-ano/bloco-1/banco/README.md),
com 100 questões adaptadas e validadas, sem pendências no banco.
Ainda não há interface de atividade ou simulado. O banco inclui um validador de
conteúdo em Python 3, sem dependências externas; seu comando está documentado
junto aos arquivos. Não é necessário instalar pacotes para consultar ou editar
os materiais.

## Como começar

1. Preencher o [planejamento da primeira atividade](docs/primeira-atividade.md).
2. Seguir as [convenções de desenvolvimento](docs/desenvolvimento.md) para criar a pasta do recurso.
3. Implementar e revisar conforme as [orientações para o Blogger](docs/blogger.md)
   e os [critérios de qualidade](docs/criterios-qualidade.md).

Os procedimentos de execução e testes serão documentados junto ao primeiro
recurso, conforme suas necessidades.
