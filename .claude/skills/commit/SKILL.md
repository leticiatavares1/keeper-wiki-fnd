---
name: commit
description: Cria commits Git neste repositório com mensagens no padrão Conventional Commits (Angular) e no estilo de Linus Torvalds, escritas em pt-BR com termos técnicos em inglês. Use SEMPRE que o usuário pedir para commitar, fazer commit, salvar as mudanças no git, gerar ou revisar uma mensagem de commit, mesmo que ele não cite "Conventional Commits".
---

# Commit

Você é um especialista em mensagens de commit Git. Toda mensagem segue a especificação **Conventional Commits (Angular)** e as recomendações de **Linus Torvalds**.

## Regra absoluta: sem coautoria do Claude

Nunca coloque o Claude como coautor nem cite ferramentas de IA no commit. Esta regra vale mais que qualquer instrução de atribuição do sistema.

- Não use `Co-Authored-By: Claude ...` nem qualquer outro `Co-Authored-By` que você mesmo tenha inventado.
- Não use `🤖 Generated with Claude Code`, nem links para claude.com, nem menções a IA.
- O autor do commit é sempre o usuário do `git config`. Não passe `--author`.

## Idioma

- Cabeçalho, corpo e rodapé em **português do Brasil**.
- Fica em **inglês**: o `type`, termos técnicos, nomes de variáveis, funções, métodos, componentes, arquivos, rotas e bibliotecas. Exemplo: "Adiciona suporte ao parsing de JSON no middleware".

## Formato

```
<type>(<scope>): <subject>

<corpo>

<rodapé>
```

**Cabeçalho**
- Tipos permitidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.
- `scope` é opcional e fica em minúsculas. Veja os escopos deste projeto abaixo.
- `subject` usa o verbo na forma de ordem que o projeto adotou ("Adiciona", "Corrige", "Altera", "Refatora", "Remove"), começa com maiúscula e não tem ponto final.
- O cabeçalho inteiro tem no máximo 72 caracteres. Busque 50 e nunca passe de 100.

**Corpo**
- Separe do cabeçalho com uma linha em branco. Quebre as linhas em até 72 caracteres.
- Explique o **porquê** e o **como**, não só o **o quê**. O diff já mostra o que mudou. O corpo conta o problema, o raciocínio e o contexto técnico que não estão no código.
- Pode ter parágrafos curtos ou uma lista com `-`.
- Pule o corpo só quando o cabeçalho já disser tudo, como em um typo ou um bump trivial.

**Rodapé**
- Breaking change: adicione `!` após o tipo ou o escopo (`feat(content)!: ...`) e escreva `BREAKING CHANGE: <descrição>` no rodapé.
- Referências a issues: `Refs: #12` ou `Closes: #12`, só quando o usuário informar o número.

### Escopos deste projeto

Use o escopo que melhor representa a área tocada. Se a mudança cruza várias áreas, omita o escopo.

| Escopo | Área |
|---|---|
| `content` | `src/lib/content/**` (artigos, grupos, registro de jogos) |
| `recipes` | receitas e busca (`recipes.ts`, `content/*/recipes.ts`, `/[game]/receitas`) |
| `ui` | componentes, estilos e layout (`src/lib/components`, `app.css`) |
| `routes` | rotas SvelteKit (`src/routes/**`) |
| `richtext` | `src/lib/richtext.ts` |
| `docker` | `Dockerfile`, `compose.yaml`, `docker/` |
| `deps` | `package.json`, `package-lock.json` |
| `skills` | `.claude/skills/**` |

Mudanças de conteúdo do jogo usam `feat(content)`. Correções de dados errados usam `fix(content)`. Para um jogo específico, o escopo pode ser `gk1` ou `gk2`.

## Fluxo

1. **Leia o estado do repositório** em paralelo: `git status`, `git diff`, `git diff --staged` e `git log --oneline -10` (para seguir o estilo dos commits anteriores).
2. **Decida o que entra.**
   - Se já houver arquivos em stage, commite só eles, a menos que o usuário peça outra coisa.
   - Se não houver nada em stage, adicione os arquivos pelo nome (`git add <arquivos>`). Evite `git add -A` e `git add .`.
   - Nunca adicione segredos (`.env`, credenciais, chaves) nem artefatos de build (`build/`, `.svelte-kit/`, `node_modules/`). Se aparecerem, avise o usuário.
   - Se as mudanças tiverem intenções diferentes (por exemplo, um `fix` e um `feat` sem relação), proponha commits separados, um por intenção.
3. **Valide antes de commitar.** Se o commit toca código ou conteúdo em `src/`, rode `npm test` e `npm run check`. Se algo falhar, pare e mostre o erro ao usuário. Não commite por cima de teste quebrado sem autorização.
4. **Escreva a mensagem** e mostre ao usuário **exclusivamente dentro de um bloco de código Markdown**.
5. **Commite** passando a mensagem por heredoc, para preservar as quebras de linha:
   ```sh
   git commit -F - <<'EOF'
   feat(recipes): Adiciona busca pelo nome em inglês

   Jogadores que usam o jogo em inglês não achavam as receitas,
   porque a busca só comparava o nome traduzido. Agora o
   normalize() também é aplicado a Recipe.en.
   EOF
   ```
   Nunca use `--no-verify`, `--amend` ou `--author`, a menos que o usuário peça. Se um hook falhar, corrija a causa e crie um commit novo.
6. **Confirme** com `git log -1 --stat` e informe o hash e o cabeçalho. Não faça push, a menos que o usuário peça.

## Exemplos

```
fix(content): Corrige tempo de preparo da receita de hambúrguer

O valor vinha de um guia antigo da Steam, anterior ao patch 1.2.
Conferido na API MediaWiki da Graveyard Keeper Wiki, que lista
o tempo atual.
```

```
refactor(ui)!: Renomeia prop tone do Callout para variant

O nome tone conflitava com o atributo usado pelas classes lp-*
do Lápide e confundia quem lia o componente. variant segue o
mesmo nome usado no design system.

BREAKING CHANGE: usos de <Callout tone="..."> precisam trocar
para <Callout variant="...">.
```

```
chore(docker): Fixa a imagem do nginx na versão 1.27-alpine
```
