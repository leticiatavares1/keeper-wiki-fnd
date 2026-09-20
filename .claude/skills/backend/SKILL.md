---
name: backend
description: Delega ao `../keeper-wiki-bkd/` toda funcionalidade de backend que a wiki precisar, abrindo um agent que implementa lá. Use SEMPRE que a página, o componente ou o prerender precisar de um dado, rota, filtro, campo, ordenação ou paginação que a API ainda não serve — mesmo que o usuário não cite "backend", "API" ou "endpoint", e mesmo que a mudança pareça de uma linha.
---

# Backend por agente

A wiki é só o front. Todo dado do jogo vem da API em `../keeper-wiki-bkd/`, que é **outro repositório git**. Quando faltar alguma coisa lá, você não conserta na mão: você escreve o contrato e abre um **agent** que implementa no repositório certo.

## Regra absoluta: não edite o backend a partir daqui

Nesta sessão você está no `keeper-wiki-fnd`. Ler o `../keeper-wiki-bkd/` pode (README, CLAUDE.md, rotas, `app/consultas.py`). Escrever, não.

- Nada de `Edit`/`Write` em arquivo de `../keeper-wiki-bkd/`.
- Nada de commit, branch ou `git` nenhum lá de dentro.
- A única forma de mudar o backend é o agent desta skill.

Motivo: são repositórios com histórico, CLAUDE.md, skills e testes próprios. Mudança feita de fora entra sem o contexto do projeto e sem o commit no padrão dele.

**Nunca invente o dado no front para contornar a falta.** Sem rota, sem mock, sem JSON copiado à mão, sem número chutado no `src/lib/content/`. A regra de conteúdo do projeto — não escrever fato do jogo sem fonte — vale aqui inteira.

## Quando abrir o agent

Abra sempre que o front precisar de algo que a API não entrega hoje:

- rota nova (`GET /alquimia`, `GET /itens/{id}/onde-conseguir`);
- campo novo numa resposta que já existe;
- filtro, busca, ordenação ou paginação novos numa listagem;
- formato de resposta diferente do que o prerender consegue consumir;
- `limite` insuficiente, `total` errado, dado duplicado na resposta;
- performance do build (uma rota que devolveria em uma chamada o que hoje são 200);
- qualquer coisa que exija mexer em `app/`, `db/` ou `scripts/` do backend.

Não abra para: dúvida sobre o dado (isso é consulta ao banco), leitura do schema, ou mudança que é só no front.

## Antes de abrir: três checagens

1. **A rota já existe?** Consulte a tabela de rotas do `../keeper-wiki-bkd/README.md` e, se a API estiver de pé, `curl -s 127.0.0.1:8000/openapi.json | jq '.paths | keys'`. Metade dos pedidos morre aqui.
2. **O dado existe no banco?** Se existe, é trabalho do backend. Consulte com a skill `banco` do `../keeper-wiki-bkd/` (`.claude/skills/banco/SKILL.md`) ou com `../keeper-wiki-bkd/scripts/consulta.sh "select ..."`, que é somente leitura.
3. **O dado existe na extração?** Se o campo não está nem no banco nem em `../reveng-graveyard-keeper/out/data/wiki/*.json`, **o trabalho é no `reveng-graveyard-keeper`, não no backend** — a extração mora lá. Pare, diga isso ao usuário e pergunte antes de seguir. O backend não inventa dado no meio do caminho.

## Escreva o contrato antes do código

O agent implementa o que você pedir, então o pedido é a parte que importa. Defina, sempre:

- **Rota e método** — `GET` e só `GET`. A API não escreve.
- **Parâmetros** — nome (em pt-BR), tipo, se é opcional, valor padrão.
- **Resposta** — o JSON que o front espera, campo a campo, com nome em pt-BR. Listagem segue o formato da casa: `{total, limite, offset, dados}`.
- **Quem consome** — qual rota/página do front, e que ela é pré-renderizada no build.
- **Filtros de conteúdo** — se o dado é para o jogador, `nao_usado` e `oculta` ficam de fora.
- **Volume esperado** — quantas linhas, para o agent saber se precisa de índice.

## O pedido

Abra **um agent por demanda** (`subagent_type: "general-purpose"`), com um prompt neste molde:

```
Trabalhe no repositório /home/caiop/programing/leticia/keeper-wiki-bkd (outro
repo git; não toque em nada fora dele).

Antes de escrever código, leia README.md e CLAUDE.md desse repositório e siga as
regras deles. Para qualquer dúvida sobre o dado, carregue a skill do projeto
.claude/skills/banco/SKILL.md e consulte o banco com scripts/consulta.sh — não
chute valor nem leia os JSON do reveng na mão.

Contexto: quem vai consumir é a wiki em ../keeper-wiki-fnd, que usa adapter-static
e busca a API **no build** (prerender), não no navegador.

O que é para fazer:
<contrato: rota, método GET, parâmetros, formato exato da resposta, filtros>

Restrições:
- A API é somente leitura. Só GET.
- Todo SQL em app/consultas.py, parametrizado com $n. Filtro opcional é
  "$n IS NULL OR ...", nunca concatenação de string.
- Referência de receita não tem FK contra gk.item: LEFT JOIN, sempre.
- Filtre nao_usado e oculta no que o jogador vê.
- Se mexer no schema, db/ + app/consultas.py mudam junto e scripts/importa.py
  roda de novo (têm que sair 1.157 itens, 2.634 receitas, 187 tecnologias).

Verificação, obrigatória antes de dizer que terminou:
- suba `docker compose --profile dev up -d dev` (o banco de ../keeper-wiki-db
  precisa estar no ar antes) e chame a rota de verdade com curl;
- cole no relatório a resposta real de pelo menos uma chamada, incluindo um caso
  de borda (busca vazia, id inexistente, filtro combinado).

Não commite: deixe as mudanças no working tree e liste os arquivos tocados.

No relatório final, devolva: o contrato final da rota (caminho, parâmetros, JSON
de resposta com tipos), o exemplo de curl que funciona, os arquivos mudados, e
qualquer coisa que você teve que decidir por conta própria.
```

Ajuste o molde ao caso, mas não corte: as restrições, a verificação com `curl` e o contrato de volta são o que faz o resultado ser usável no front.

Rode agents em paralelo só quando as demandas forem independentes (rotas diferentes, arquivos diferentes). Dois agents no mesmo `app/consultas.py` se atropelam — nesse caso, um pedido só.

## Depois que o agent volta

1. **Confira o contrato**, não a promessa. Chame a rota você mesmo: `curl -s '127.0.0.1:8000/<rota>' | jq`. Se a resposta não bate com o relatório, volte a falar com o mesmo agent (`SendMessage`) em vez de abrir outro.
2. **Consuma no prerender**, no `+page.ts`/`+layout.ts`, com o `fetch` do `load`. O site é estático: nada de buscar no navegador. Se alguma página precisar buscar em runtime, isso muda o que tem que estar de pé em produção (`CORS_ORIGENS`) — fale com o usuário antes.
3. **Rode `npm test` e `npm run check`** no front depois de ligar o dado.
4. **Commits são dois, em repositórios diferentes.** O do front sai daqui com a skill `commit`. O do backend só sai com o usuário mandando, e é ele quem decide se commita lá — avise que ficou mudança não commitada em `../keeper-wiki-bkd/`.
5. **Diga o que foi feito no backend** na sua resposta: rota criada, arquivos tocados, se o schema mudou. O usuário precisa saber que o outro repositório mexeu.

## Se travar

- **Agent diz que o dado não existe:** é `reveng-graveyard-keeper`. Leve para o usuário; não contorne no front.
- **Banco fora do ar:** `cd ../keeper-wiki-db && docker compose up -d` primeiro — é o compose dele que cria a rede `keeper-wiki`.
- **Mudança de schema grande, ou alguém pedindo rota de escrita:** isso é decisão de produto, não detalhe de implementação. Pergunte antes de abrir o agent.
