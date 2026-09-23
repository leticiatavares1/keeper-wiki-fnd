# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Wiki de fã para o jogo **Graveyard Keeper**, para ajudar jogadores com dúvidas: receitas, dicas para iniciantes e explicações das mecânicas que confundem no começo do jogo. Mais tarde, a wiki também vai cobrir o **Graveyard Keeper 2**, que já aparece como "em breve" na página inicial. Nada de dados, rotas ou componentes deve supor que só existe um jogo.

O conteúdo e a interface são escritos em português (pt-BR). O nome "Guarda-covas" é provisório.

## Stack e comandos

SvelteKit 2 + Svelte 5 (runes) + TypeScript, com `adapter-static`: todas as páginas são pré-renderizadas no build. Em produção, o nginx serve os arquivos em um container Docker.

**O build precisa da API de `../keeper-wiki-bkd` no ar.** O dado do jogo é buscado no prerender, não no navegador: sem API, o build falha de propósito, com a mensagem dizendo o que subir. Os PNG dos ícones dos itens também vêm da API, espelhados para `static/icones/` antes do build. O site gerado continua 100% estático e não fala com a API em runtime.

```sh
cd ../keeper-wiki-db && docker compose up -d        # Postgres (cria a rede)
cd ../keeper-wiki-bkd && docker compose up -d --build api   # API em :8000

npm run icones                       # espelha os ícones da API em static/icones (roda sozinho no dev e no build)
npm run dev                          # servidor de desenvolvimento em :5173
npm run check                        # svelte-check (tipos)
npm test                             # vitest (todos os testes)
npx vitest run src/lib/search.test.ts    # um arquivo de teste
npx vitest run -t "ignora acento"        # testes pelo nome
npm run build                        # gera o site estático em build/ (~1.180 páginas + 706 ícones); no Windows falha, veja abaixo

docker compose up -d --build web     # produção (nginx) em :8080
docker compose --profile dev up dev  # desenvolvimento em container, :5173
```

**No Windows, `npm run build` local falha** com `ENOENT ... mkdir ...\itens\snack:grated_beetroot`: há ids de item com `:`, que o Windows não aceita em nome de pasta. Gere o site pelo Docker (`docker compose up -d --build web`), que builda em Linux.

`API_URL` muda o endereço da API no build (padrão `http://127.0.0.1:8000`). O build do container `web` roda com `network: host` justamente para alcançar a API da máquina.

## Arquitetura

São duas fontes, e elas não se misturam: **artigo é escrito à mão, dado de jogo vem da API.**

### Artigos (escritos à mão)

`src/lib/content/types.ts` define `GameContent`: jogo, grupos e artigos. Cada jogo fica em `src/lib/content/<id>/` (hoje só `gk1/`: `articles.ts` e o `index.ts`).

- `src/lib/content/index.ts` é o registro. `contents` lista os jogos com conteúdo, e `games` lista também os que aparecem como `soon`. Para ativar o GK2, crie `content/gk2/`, adicione-o a `contents` e remova o placeholder `soon`.
- `Game.apiData` diz que o dado extraído daquele jogo está na API. Só esses jogos ganham as páginas de bancada, item e tecnologia — a API serve o GK1, e o GK2 não tem dado nenhum.
- Um artigo é dividido em `sections`, e cada seção em `blocks` (`p`, `list`, `callout`, `recipe`, `table`). O renderizador é `components/Blocks.svelte`. Um bloco `recipe` guarda o **id da receita na API** (`baked_apple`), e o `+page.server.ts` do artigo busca a receita no build. Id errado quebra o build, que é o que tem que acontecer.
- Um texto de bloco aceita links no formato `[rótulo](/caminho)`, e só isso. O parser fica em `src/lib/richtext.ts`. Não existe HTML nem markdown completo.

### Dado do jogo (vem da API no build)

`src/lib/server/api.ts` é o único lugar que fala com a API. Ele vive em `$lib/server` de propósito: o SvelteKit proíbe importar isso do cliente, então não tem como uma página passar a buscar no navegador sem querer. `src/lib/api/types.ts` espelha o JSON da API, com os campos em pt-BR, como eles chegam.

- As listas que quase toda página usa (`/itens`, `/estacoes`, `/tecnologias`) são buscadas **uma vez por build** e memorizadas: são ~1.180 páginas no mesmo processo.
- `toCard()` recorta a receita para o que o card mostra antes de ela virar payload da página. A maior bancada tem 462 receitas.
- `src/lib/format.ts` transforma dado cru em texto (nome, `×3`, `12s`, preço). Onde o jogo usa fórmula em vez de número, a tela diz "por fórmula" — **não se arredonda o que não é número**.
- **Imagem e estrela.** Todo item tem `icone`, o nome do sprite no jogo, e o PNG vem da API (`/icones`). O `scripts/espelha-icones.js` baixa tudo para `static/icones/` no `predev`/`prebuild`; a pasta fica fora do git, porque arte é asset do jogo. Ícone sem PNG — quatro itens em uso não têm sprite no jogo — chega como `null` do `$lib/server/api`, e a tela mostra o vazio em vez de imagem quebrada. A estrela de qualidade é um segundo sprite (`item_star_1..3`), desenhado por cima pelo `components/Sprite.svelte`.
- **O que o item faz ao ser usado** vem em `pode_usar`, `ao_usar` (`{energy: 24, hp: -20}`) e `ao_usar_expr`. É o que responde "para que serve?" na ficha de comida, que não é ingrediente de receita nenhuma. `format.onUse()` escreve o sinal: negativo é perda. Só mostre quando `pode_usar` for true — em ferramenta o mesmo campo guarda o custo de energia por golpe, que é outra coisa.
- **Item com níveis de qualidade é um item só.** As três "Abóbora" (`pumpkin_crop:1/2/3`) são um grupo: a listagem mostra o grupo, e os níveis moram na ficha dele. `Ref.e_grupo` marca a ponta de receita que pede o grupo em vez do nível — são 164 receitas —, e `format.itemPath()` é quem decide o link: o nível vira âncora (`#nivel-2`) na ficha do grupo, que é a única página que existe.
- **DLC vem da API, e a wiki só decide o que é jogo base.** Todo registro (tecnologia, receita, bancada, item, grupo) traz `dlc`: `breaking_dead`, `stranger_sins`, `game_of_crone`, `better_save_soul` ou `null`. O jogo só marca parte das tecnologias; o resto a API deduz (regra no README do `../keeper-wiki-bkd`), e na dúvida fica `null`. `GET /dlcs` lista as quatro com as contagens. Breaking Dead virou atualização gratuita e a wiki a conta como jogo base: essa decisão mora só em `format.dlcOf()`/`isSeparateDlc()` — não compare `dlc` direto na tela. O filtro "Conteúdo" dos índices é `search.matchesDlc()`.
- `src/lib/search.ts` tem a busca sem acento (`normalize`, no mesmo espírito do `gk.normaliza()` do banco) e os filtros de item, receita, bancada e tecnologia. Tudo client-side, sobre o dado já embutido na página.

### Rotas

Todas genéricas por jogo, todas pré-renderizadas; os `entries()` dizem ao prerender o que gerar.

| Rota | O que é |
|---|---|
| `/[game]` | hub do jogo |
| `/[game]/[slug]` | artigo |
| `/[game]/receitas` | índice das bancadas |
| `/[game]/receitas/[bancada]` | as receitas de uma bancada (168 páginas) |
| `/[game]/itens` | busca nos itens |
| `/[game]/itens/[id]` | ficha do item: níveis de qualidade, o que o faz e o que o gasta (998 páginas) |
| `/[game]/tecnologias` | árvore de pesquisa por ramo |
| `/[game]/dlc` | índice das DLCs |
| `/[game]/dlc/[dlc]` | bancadas, itens e tecnologias de uma DLC (`stranger-sins`, `game-of-crone`, `better-save-soul`) |

`[game]/+layout.server.ts` busca as DLCs (`/dlcs`) no build, e `[game]/+layout.ts` junta o conteúdo e monta a Sidebar (`navFor(content, dlcs)`), que ganha a seção DLCs. A barra do site (`routes/+layout.svelte`) lê o mesmo `page.data` para o seletor "Jogo base · DLCs". Nenhum artigo pode usar os slugs de `dataSlugs` (`receitas`, `itens`, `tecnologias`, `dlc`).

A ficha existe para **todo** item, inclusive os marcados como `nao_usado`: oito deles ainda aparecem em receita, e link quebrado derruba o prerender. O índice de itens esconde esses, atrás de uma caixa de seleção. Nível de qualidade não tem ficha própria — quem tem é o grupo —, então `[id]` recebe id de item ou id de grupo, e o `+page.server.ts` decide qual buscar. URL velha de nível (`/gk1/itens/pumpkin_crop:1`) não morre em 404: o `docker/nginx.conf` redireciona para a âncora do nível na ficha do grupo, e serve o HTML com `no-cache` para que uma aba aberta antes do build não clique em página que não existe mais.

`src/lib/content/content.test.ts` valida o conteúdo de todos os jogos:
  - links internos apontam para rotas que existem;
  - slugs são únicos e nenhum usa slug reservado;
  - cada artigo tem no máximo 2 callouts e 3 selos;
  - cada seção da Sidebar tem até 6 itens;
  - a seção DLCs da Sidebar lista as DLCs separadas e deixa Breaking Dead de fora.

  Rode `npm test` depois de editar qualquer conteúdo. O id de receita de um bloco não é conferido aqui — quem confere é o build, que busca a receita na API.

### Regras de conteúdo

- **Número de jogo vem da API, não do teclado.** Receita, item, tecnologia, preço, tempo: tudo sai de `../keeper-wiki-bkd`, que serve o dado extraído do binário pelo `../reveng-graveyard-keeper`. Nunca escreva um desses números à mão no `src/lib/content/`, nem "só para o exemplo".
- O que **não** está na API — dica, ordem de prioridade, explicação de mecânica, tabela de energia de comida — continua sendo artigo escrito à mão, e aí vale a regra antiga: **não escreva fato do jogo sem fonte**. As fontes usadas foram a Graveyard Keeper Wiki (graveyardkeeper.fandom.com, pela API MediaWiki: o site bloqueia fetch direto com 402) e guias do GameRant, do TheGamer e da Steam.
- **Imagem de item também vem da API.** Nada de baixar sprite à mão para dentro de `static/`, nem apontar `<img>` para fora do site. Faltou arte? É extração, no `../reveng-graveyard-keeper`.
- Os nomes de item e bancada são a **tradução oficial do jogo**, que vem da API. Onde ela não existe (24 itens, todos bônus de sermão `b_*`, e 66 bancadas, quase todas objetos internos como spawner e arbusto), a tela cai no id do jogo, e os índices de itens e de bancadas escondem esses nomes atrás de uma caixa de seleção. A ficha e a página continuam existindo, porque receita aponta para elas. Não invente tradução.

## Interface: sempre use a skill `lapide-designer`

Toda interface (página, componente, layout, estado de UI ou microcopy) deve ser criada ou revisada com a skill do projeto `.claude/skills/lapide-designer`, que aplica o design system **Lápide** (pixel art medieval). Carregue a skill antes de escrever qualquer UI, mesmo que a mudança pareça pequena.

- `src/lib/styles/tokens.css` e `components.css` são cópias de `references/` da skill. Não edite essas cópias: atualize a skill e copie de novo. Estilos do site vão em `app.css` ou no `<style>` do componente, sempre com `var(--…)`.
- Os componentes Svelte em `src/lib/components/` (`Badge`, `Callout`, `Recipe`, `Infobox`, `Sidebar`) só envolvem as classes oficiais `lp-*`.
- Padrões derivados, que não existem no design system, estão marcados com o comentário "derivado". São eles:
  - a barra do site, com o seletor "Jogo base · DLCs" (`.site-tabs`);
  - o índice de artigos (`.wiki-index`);
  - a Sidebar recolhível no celular;
  - a nota no rodapé do card de receita (combustível da bancada, pontos, pesquisa);
  - o item de índice sem link (`.tech-list`), para tecnologia, que não tem página própria.
- Há dois temas: **Noite** (padrão) e **Pergaminho** (`data-theme="pergaminho"`). O script inline em `src/app.html` aplica o tema salvo em `localStorage` antes do primeiro paint. Toda UI precisa funcionar nos dois temas e em 360px, 720px e ≥1100px.

## Backend: sempre use a skill `backend`

O dado do jogo vem da API em `../keeper-wiki-bkd/`, que é outro repositório. Quando faltar rota, campo, filtro ou formato de resposta, carregue a skill do projeto `.claude/skills/backend`: ela abre um agent que implementa lá. **Nunca edite o `../keeper-wiki-bkd/` a partir daqui, e nunca invente o dado no front para contornar a falta.**

## Commits

Use a skill do projeto `.claude/skills/commit` para qualquer commit: Conventional Commits (Angular) em pt-BR, com os termos técnicos em inglês. **Nunca coloque o Claude como coautor nem cite IA na mensagem** (sem `Co-Authored-By: Claude`, sem "Generated with Claude Code").
