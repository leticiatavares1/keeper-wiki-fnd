# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Wiki de fã para o jogo **Graveyard Keeper**, para ajudar jogadores com dúvidas: receitas, dicas para iniciantes e explicações das mecânicas que confundem no começo do jogo. Mais tarde, a wiki também vai cobrir o **Graveyard Keeper 2**, que já aparece como "em breve" na página inicial. Nada de dados, rotas ou componentes deve supor que só existe um jogo.

O conteúdo e a interface são escritos em português (pt-BR). O nome "Guarda-covas" é provisório.

## Stack e comandos

SvelteKit 2 + Svelte 5 (runes) + TypeScript, com `adapter-static`: todas as páginas são pré-renderizadas no build. Em produção, o nginx serve os arquivos em um container Docker.

```sh
npm run dev                          # servidor de desenvolvimento em :5173
npm run check                        # svelte-check (tipos)
npm test                             # vitest (todos os testes)
npx vitest run src/lib/recipes.test.ts   # um arquivo de teste
npx vitest run -t "ignora acento"        # testes pelo nome
npm run build                        # gera o site estático em build/

docker compose up -d --build web     # produção (nginx) em :8080
docker compose --profile dev up dev  # desenvolvimento em container, :5173
```

## Arquitetura

**Todo conteúdo é dado tipado, não markup.** `src/lib/content/types.ts` define `GameContent`, que tem jogo, grupos, artigos e receitas. Cada jogo fica em `src/lib/content/<id>/` (hoje só `gk1/`: `articles.ts`, `recipes.ts` e o `index.ts` que junta os dois).

- `src/lib/content/index.ts` é o registro. `contents` lista os jogos com conteúdo, e `games` lista também os que aparecem como `soon`. Para ativar o GK2, crie `content/gk2/`, adicione-o a `contents` e remova o placeholder `soon`.
- Um artigo é dividido em `sections`, e cada seção em `blocks` (`p`, `list`, `callout`, `recipe`, `table`). O renderizador é `components/Blocks.svelte`. Um bloco `recipe` referencia a receita pelo `id`, sem duplicar os dados.
- Um texto de bloco aceita links no formato `[rótulo](/caminho)`, e só isso. O parser fica em `src/lib/richtext.ts`. Não existe HTML nem markdown completo.
- As rotas são genéricas por jogo: `/[game]` (hub), `/[game]/[slug]` (artigo) e `/[game]/receitas` (busca). `[game]/+layout.ts` carrega o conteúdo e a Sidebar (`navFor`). Os `entries()` nos `+page.ts` dizem ao prerender quais páginas gerar. Nenhum artigo pode ter o slug `receitas`.
- `src/lib/content/content.test.ts` valida o conteúdo de todos os jogos:
  - links internos apontam para rotas que existem;
  - os `id` de receita referenciados existem;
  - slugs são únicos;
  - cada artigo tem no máximo 2 callouts e 3 selos;
  - cada seção da Sidebar tem até 6 itens.

  Rode `npm test` depois de editar qualquer conteúdo.

### Regras de conteúdo

- **Não escreva fato do jogo sem fonte.** Os números atuais foram conferidos na Graveyard Keeper Wiki (graveyardkeeper.fandom.com). O site bloqueia fetch direto (402), mas a API MediaWiki funciona. Também foram usados guias do GameRant, do TheGamer e da Steam.
- Os nomes de itens em português são tradução desta wiki. `Recipe.en` guarda o nome oficial em inglês, e a busca aceita esse nome.

## Interface: sempre use a skill `lapide-designer`

Toda interface (página, componente, layout, estado de UI ou microcopy) deve ser criada ou revisada com a skill do projeto `.claude/skills/lapide-designer`, que aplica o design system **Lápide** (pixel art medieval). Carregue a skill antes de escrever qualquer UI, mesmo que a mudança pareça pequena.

- `src/lib/styles/tokens.css` e `components.css` são cópias de `references/` da skill. Não edite essas cópias: atualize a skill e copie de novo. Estilos do site vão em `app.css` ou no `<style>` do componente, sempre com `var(--…)`.
- Os componentes Svelte em `src/lib/components/` (`Badge`, `Callout`, `Recipe`, `Infobox`, `Sidebar`) só envolvem as classes oficiais `lp-*`.
- Padrões derivados, que não existem no design system, estão marcados com o comentário "derivado". São eles:
  - a barra do site;
  - o índice de artigos (`.wiki-index`);
  - a Sidebar recolhível no celular;
  - `Recipe.note` no cabeçalho da receita.
- Há dois temas: **Noite** (padrão) e **Pergaminho** (`data-theme="pergaminho"`). O script inline em `src/app.html` aplica o tema salvo em `localStorage` antes do primeiro paint. Toda UI precisa funcionar nos dois temas e em 360px, 720px e ≥1100px.

## Commits

Use a skill do projeto `.claude/skills/commit` para qualquer commit: Conventional Commits (Angular) em pt-BR, com os termos técnicos em inglês. **Nunca coloque o Claude como coautor nem cite IA na mensagem** (sem `Co-Authored-By: Claude`, sem "Generated with Claude Code").
