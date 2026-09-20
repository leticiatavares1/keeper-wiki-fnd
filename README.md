# Guarda-covas — wiki de fã de Graveyard Keeper

Wiki em português (pt-BR) para quem está começando **Graveyard Keeper**: receitas,
dicas dos primeiros dias e as mecânicas que o jogo não explica direito. O
**Graveyard Keeper 2** já aparece na página inicial como "em breve" e ganha
conteúdo depois do lançamento.

O site é totalmente estático: todas as páginas são pré-renderizadas no build e
servidas por nginx. Nada nele fala com um servidor em runtime.

O dado do jogo — receitas, itens, bancadas e tecnologias — **não é escrito à
mão**: vem da API de leitura em [`../keeper-wiki-bkd`](../keeper-wiki-bkd/), que
serve o que o [`../reveng-graveyard-keeper`](../reveng-graveyard-keeper/) extraiu
do binário do jogo. O build busca esse dado e o congela em HTML, então a API
precisa estar no ar **na hora do build**, e só nela.

## Stack

| Peça | O que é |
| --- | --- |
| SvelteKit 2 + Svelte 5 (runes) | framework e componentes |
| TypeScript | todo o conteúdo é dado tipado |
| `adapter-static` | pré-renderiza o site inteiro em `build/` |
| Vitest | testes de conteúdo, busca e rich text |
| Docker + nginx | imagem de produção |
| API em `../keeper-wiki-bkd` | dado do jogo, buscado no prerender |

## Como rodar

A API precisa estar de pé antes, e o banco antes dela (é o compose do banco que
cria a rede Docker):

```sh
cd ../keeper-wiki-db  && docker compose up -d            # Postgres
cd ../keeper-wiki-bkd && docker compose up -d --build api  # API em :8000
```

```sh
npm install
npm run dev          # http://localhost:5173
```

`API_URL` muda o endereço da API (padrão `http://127.0.0.1:8000`). Sem API no
ar, `npm run dev` e `npm run build` falham dizendo o que subir — de propósito:
é melhor quebrar o build do que publicar número inventado.

Outros comandos:

```sh
npm run check        # svelte-check (tipos)
npm test             # vitest (todos os testes)
npm run build        # gera o site estático em build/ (~1.400 páginas)
npm run preview      # serve o build localmente
```

Com Docker:

```sh
docker compose up -d --build web      # produção (nginx) em http://localhost:8080
docker compose --profile dev up dev   # desenvolvimento em container, :5173
```

## Estrutura

```
src/
├── lib/
│   ├── content/          # os artigos, escritos à mão, como dado tipado
│   │   ├── types.ts      # GameContent, Article, Block…
│   │   ├── index.ts      # registro de jogos + Sidebar (navFor)
│   │   └── gk1/          # Graveyard Keeper: articles.ts
│   ├── api/types.ts      # espelho do JSON da API (campos em pt-BR)
│   ├── server/api.ts     # único lugar que chama a API; só roda no build
│   ├── components/       # Badge, Callout, Recipe, Infobox, Sidebar, Blocks…
│   ├── styles/           # tokens.css e components.css (design system Lápide)
│   ├── format.ts         # dado cru → texto (nome, ×3, 12s, preço)
│   ├── search.ts         # busca sem acento e filtros
│   └── richtext.ts       # parser de links [rótulo](/caminho)
└── routes/
    ├── +page.svelte                     # escolha do jogo
    └── [game]/
        ├── +page.svelte                 # hub do jogo
        ├── [slug]/                      # artigo
        ├── receitas/                    # índice de bancadas
        │   └── [bancada]/               # receitas de uma bancada
        ├── itens/                       # busca de itens
        │   └── [id]/                    # ficha do item
        └── tecnologias/                 # árvore de pesquisa
```

As rotas são genéricas por jogo, então nada supõe que exista só um jogo. Os
`entries()` dizem ao prerender quais páginas gerar, e as páginas que dependem
da API buscam no `+page.server.ts` — que o SvelteKit nunca manda para o
navegador. Só os jogos com `Game.apiData` ganham bancadas, itens e tecnologias:
a API serve o GK1.

## Conteúdo

São duas fontes, e elas não se misturam.

**Dado do jogo vem da API.** Receita, item, bancada, tecnologia, preço, tempo:
tudo sai de `../keeper-wiki-bkd` no build. Nunca escreva um desses números à mão.

**Artigo é escrito à mão**, e nada de markup: um artigo é um objeto com `slug`,
`title`, `group`, `summary`, selos opcionais, uma infobox opcional e uma lista de
`sections`. Cada seção tem `blocks`, que podem ser `p`, `list`, `callout`,
`recipe` ou `table`. Um bloco `recipe` guarda só o **id da receita na API**
(`baked_apple`), e a página busca a receita no build — o artigo não repete
ingrediente nem quantidade.

Texto de bloco aceita links no formato `[rótulo](/caminho)` e nada mais: sem
HTML, sem markdown completo. O parser está em `src/lib/richtext.ts`.

### Adicionar um artigo

1. Edite `src/lib/content/gk1/articles.ts`.
2. O `group` do artigo precisa estar em `groups` no `gk1/index.ts` para ele
   aparecer na Sidebar.
3. Para citar uma receita, pegue o id na API:
   `curl -s '127.0.0.1:8000/receitas?busca=maca' | jq '.dados[].id'`.
4. Rode `npm test` e `npm run build`.

### Adicionar um jogo

1. Crie `src/lib/content/<id>/` com `articles.ts` e um `index.ts` que exporte o
   `GameContent`.
2. Registre em `src/lib/content/index.ts`: adicione a `contents` e tire o
   placeholder `soon`.
3. Só marque `apiData: true` se a API servir o dado daquele jogo. Hoje ela serve
   o Graveyard Keeper.

### Testes de conteúdo

`src/lib/content/content.test.ts` roda sobre todos os jogos e falha se:

- um link interno apontar para uma rota que não existe;
- houver slugs repetidos, ou um artigo usar um slug reservado (`receitas`,
  `itens`, `tecnologias`);
- um artigo estiver num grupo que não existe em `groups`;
- um artigo tiver mais de 2 callouts ou 3 selos;
- uma seção da Sidebar tiver mais de 6 itens.

O id de receita de um bloco não é conferido no teste, e sim no build: ele busca
a receita na API e quebra se ela não existir.

### Regras de escrita

- **Nenhum fato do jogo sem fonte.** O que está na API vem do binário do jogo. O
  que não está — dicas, prioridades, explicação de mecânica — foi conferido na
  [Graveyard Keeper Wiki](https://graveyardkeeper.fandom.com) (via API
  MediaWiki), com apoio de guias do GameRant, do TheGamer e da Steam.
- Nome de item e de bancada é a tradução oficial do jogo, que vem da API. Onde
  ela não existe (75 itens e 28 bancadas), a tela mostra o nome em inglês e, na
  falta dele, o id do jogo. A busca aceita os três.

## Interface

A UI segue o design system **Lápide** (pixel art medieval: madeira escura,
pergaminho, musgo e luz de vela), mantido na skill do projeto
`.claude/skills/lapide-designer`.

- `src/lib/styles/tokens.css` e `components.css` são **cópias** das referências
  da skill. Não edite as cópias: mude a skill e copie de novo. Estilos do site
  vão em `app.css` ou no `<style>` do componente, sempre com `var(--…)`.
- Os componentes em `src/lib/components/` só envolvem as classes oficiais `lp-*`.
- Dois temas: **Noite** (padrão) e **Pergaminho** (`data-theme="pergaminho"`). O
  script inline em `src/app.html` aplica o tema salvo em `localStorage` antes do
  primeiro paint.
- Toda UI precisa funcionar nos dois temas e em 360px, 720px e ≥1100px.

## Deploy

O `Dockerfile` tem dois estágios: `node:22-alpine` roda `npm ci && npm run
build`, e `nginx:1.29-alpine` serve o `build/` com a config em
`docker/nginx.conf`. O container expõe a porta 80; o `compose.yaml` publica em
8080.

Como o build busca a API, o estágio de build precisa alcançá-la: o `compose.yaml`
usa `network: host` no `web`, e o endereço vem do build arg `API_URL` (padrão
`http://127.0.0.1:8000`). Para apontar para outra máquina:

```sh
docker compose build --build-arg API_URL=http://10.0.0.5:8000 web
```

A imagem final não tem API nem Node: é nginx com arquivos.

## Convenções

Commits em Conventional Commits (Angular), escritos em pt-BR com os termos
técnicos em inglês.
