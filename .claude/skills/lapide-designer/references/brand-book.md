Um sistema para wikis de jogo com cara de cemitério medieval em pixel art: madeira escura, pergaminho, musgo e luz de vela. Tudo é quadrado, tudo tem moldura, nada brilha além da vela.

## Tom e conteúdo

- Escreva como um manual de ofício antigo: frases curtas, verbos no imperativo. "Coloque a cera na bancada." Não "Você pode colocar…".
- Trate o leitor por "você", nunca por "nós".
- Títulos de artigo no singular e com inicial maiúscula só na primeira palavra: "Vela de cera", "Bancada de marcenaria".
- Humor seco é bem-vindo em uma linha de `lede`. Nunca no corpo técnico.
- Sem emoji. Símbolos só os do próprio texto: `×3`, `→`, `·`.
- Números sempre em `stat`: quantidades com `×`, tempo em `s`/`min`, moeda com a abreviação do jogo.

## Cor

- Tema padrão é **Noite**. **Pergaminho** é o tema claro, para leitura longa e impressão.
- Página em `surface-000`; painéis em `surface-100`; o que sobe dentro de um painel em `surface-200`.
- Texto em `ink`; metadados em `ink-muted`. Nunca texto em `line`.
- `moss` é a marca: botão primário, item ativo da navegação, links (`moss-text`).
- `candle` é o acento: qualidade, ouro, destaque de receita. No máximo um elemento `candle` forte por painel.
- `blood` só significa perigo ou ação destrutiva. `night` só informação neutra (tempo, dias, mapa).
- Todo fundo colorido cheio leva seu `on-*` como texto. Selos e notas usam o par `*-soft` + `*-text`.

## Tipografia

- `display`, `h1`, `h2` em Pixelify Sans (família `pixel`). Só títulos — nunca parágrafos.
- Corpo em Alegreya (`serif`): `body` no artigo, `body-sm` em tabelas, `lede` no primeiro parágrafo.
- Rótulos, selos e cabeçalhos de tabela em Silkscreen (`label`), sempre MAIÚSCULAS.
- Números e quantidades em `stat`.

## Forma, espaço e profundidade

- Raio `radius-0` em tudo. `radius-1` só em selos e pips de qualidade.
- Toda superfície delimitada tem moldura `border-frame` em `line-strong`. Divisórias internas em `line`, 1px.
- Profundidade é sombra dura: `shadow-pixel` em painéis flutuantes, `shadow-press` em botões. Sem desfoque, sem gradiente.
- Grid de 4px (`space-1`). Painéis com `space-4` de padding; seções separadas por `space-6`; margem da página `space-8`.
- Foco: contorno sólido de 2px em `focus`, deslocado 2px. Nunca remova.

## Layout de uma página de wiki

- Três zonas: `Sidebar` à esquerda (220px), artigo no centro (até 720px), `Infobox` à direita (280px) ou no topo em telas estreitas.
- O artigo abre com `h1`, um `lede`, e as seções em `h2`: Descrição, Como obter, Usado em, Curiosidades.
- Receitas vão em `Recipe`, uma por bloco, nunca em tabela solta.
- Avisos em `Callout`; no máximo dois por artigo.

## Iconografia

- Nenhum ícone é fornecido ainda. Use sprites de pixel art em 16×16 ou 32×32, escalados em múltiplos inteiros com `image-rendering: pixelated`.
- Nunca use pacotes de ícones vetoriais arredondados (Material, Feather): quebram o grid de pixel.
- Não reproduza sprites, logotipos ou personagens de jogos existentes; use arte própria ou licenciada.
