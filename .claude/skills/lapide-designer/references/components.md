# Componentes Lápide

Classes em `components.css`. Cada componente tem o markup HTML puro (use em qualquer stack) e a API React do bundle oficial (`window.Lapide`), quando existir.

---

## Oficiais

### Button
Botão quadrado, com moldura de 2px e sombra dura que some ao pressionar.

```html
<button type="button" class="lp-btn lp-btn-primary">Salvar artigo</button>
<button type="button" class="lp-btn lp-btn-quiet">Pré-visualizar</button>
<button type="button" class="lp-btn lp-btn-danger">Apagar página</button>
```
React: `<Button variant="primary|quiet|danger" onClick>…</Button>` (padrão `quiet`).

- Texto curto, verbo no imperativo.
- `primary` (musgo): a ação principal, **no máximo um por painel**.
- `quiet`: ações secundárias.
- `danger`: só ações destrutivas (apagar, reverter).
- Botão só com ícone exige `aria-label`.

### Badge
Selo curto em Silkscreen maiúsculo para categorias, estados e tipos.

```html
<span class="lp-badge lp-badge-moss">Obtido</span>
<span class="lp-badge lp-badge-candle">Raro</span>
<span class="lp-badge lp-badge-blood">Perigoso</span>
<span class="lp-badge lp-badge-night">Noite</span>
<span class="lp-badge">Padrão</span>
```
React: `<Badge tone="neutral|moss|candle|blood|night">…</Badge>`.

- 1–2 palavras. `moss` = categoria/obtido; `candle` = raro/destaque; `blood` = perigoso/removido; `night` = tempo/dia; neutro = padrão.
- No máximo três selos por título.

### Callout
Aviso no corpo do conteúdo, com faixa de rótulo em cima (nunca borda lateral colorida).

```html
<aside class="lp-callout lp-callout-nota" role="note">
  <div class="lp-callout-head">Nota</div>
  <div class="lp-callout-body">A vela queima por um dia inteiro no jogo.</div>
</aside>
<aside class="lp-callout lp-callout-dica" role="note">…Dica…</aside>
<aside class="lp-callout lp-callout-perigo" role="alert">…Perigo…</aside>
```
React: `<Callout tone="nota|dica|perigo" title?>…</Callout>`.

- 1–3 frases. `nota` (vela) = contexto; `dica` (musgo) = atalho; `perigo` (sangue) = perda irreversível.
- **Máximo dois por página/artigo.**

### Infobox
Ficha lateral de item, personagem ou local. 280px à direita; no topo, largura total, em telas estreitas.

```html
<section class="lp-infobox">
  <h3 class="lp-infobox-title">Vela de cera
    <span class="lp-infobox-sub">Item de iluminação</span></h3>
  <div class="lp-infobox-media"><img class="lp-sprite" src="vela.png" width="64" height="64" alt=""></div>
  <dl>
    <div class="lp-infobox-row"><dt>Tipo</dt><dd>Iluminação</dd></div>
    <div class="lp-infobox-row"><dt>Preço</dt><dd>12 bronze</dd></div>
    <div class="lp-infobox-row"><dt>Qualidade</dt><dd>
      <span class="lp-pips" role="img" aria-label="Qualidade 3 de 5">
        <span class="lp-pip lp-pip-on"></span><span class="lp-pip lp-pip-on"></span><span class="lp-pip lp-pip-on"></span><span class="lp-pip"></span><span class="lp-pip"></span>
      </span></dd></div>
  </dl>
</section>
```
React: `<Infobox title subtitle? media? rows={[[rótulo, valor]]} quality? qualityMax? />`.

- Rótulos curtos, sem dois-pontos. Valores numéricos com unidade.
- `media`: sprite em pixel art, escala inteira.

### Recipe
Receita em linha: ingredientes, seta e resultado destacado em vela.

```html
<figure class="lp-recipe" style="margin:0">
  <figcaption class="lp-recipe-head"><span>Bancada de velas</span><span>12s</span></figcaption>
  <div class="lp-recipe-flow">
    <span class="lp-slot">Cera de abelha <b>×2</b></span>
    <span class="lp-op" aria-hidden="true">+</span>
    <span class="lp-slot">Pavio <b>×1</b></span>
    <span class="lp-op" aria-label="produz">→</span>
    <span class="lp-slot lp-slot-result">Vela de cera <b>×2</b></span>
  </div>
</figure>
```
React: `<Recipe station time? ingredients={[{name, qty}]} result={{name, qty}} />`.

- Uma receita por bloco; várias = vários `Recipe` empilhados com `space-3`. Nunca em tabela solta.

### Sidebar
Navegação lateral agrupada em seções com rótulo em Silkscreen.

```html
<nav class="lp-nav" aria-label="Navegação da wiki">
  <h4>Itens</h4>
  <ul>
    <li><a href="#" aria-current="page">Vela de cera</a></li>
    <li><a href="#">Pavio</a></li>
  </ul>
</nav>
```
React: `<Sidebar label? sections={[{title, items:[{label, href, active}]}]} />`.

- Só a página atual com `aria-current="page"` (vira bloco musgo).
- Até seis itens por seção; mais que isso, crie página índice.

---

## Derivados (não oficiais)

Extrapolados das regras do brand book para UI que o sistema ainda não cobre. Ao usar, avise que são derivados; se virarem padrão, proponha adicioná-los ao design system.

| Padrão | Classes | Regra de origem |
|---|---|---|
| Painel | `.lp-panel`, `.lp-panel-float`, `.lp-panel-head` | Painéis em `surface-100`, moldura `line-strong`, padding `space-4`; flutuante com `shadow-pixel` |
| Tipografia | `.lp-display` `.lp-h1` `.lp-h2` `.lp-lede` `.lp-body-sm` `.lp-label` `.lp-stat` | Escala de `tokens.json` |
| Campo | `.lp-field` > `label` + `.lp-input`/`.lp-select`/`.lp-textarea`, `.lp-field-error`, `[aria-invalid]` | Campos em `surface-200`, moldura 2px, rótulo em `label` |
| Tabela | `.lp-table`, `td.num` | Cabeçalho em `label`, células `body-sm`, divisórias `line` 1px |
| Abas | `.lp-tabs` > `.lp-tab[aria-selected]` | Aba ativa funde-se ao painel `surface-100` |
| Diálogo | `<dialog class="lp-dialog">` + `.lp-dialog-body` + `.lp-dialog-actions` | Painel flutuante; ações à direita, primária por último |
| Vazio | `.lp-empty` | Moldura tracejada, texto `ink-muted`, uma frase + uma ação |
| Carregando | `.lp-loading` > 3×`span` | Blocos em degrau (`steps()`), respeita `prefers-reduced-motion` |
| Sprite | `.lp-sprite` | `image-rendering: pixelated`, escala inteira |
| Página wiki | `.lp-page` > `.lp-nav` + `.lp-article` + `.lp-infobox` | 220 · ≤720 · 280; Infobox sobe ao topo no estreito |
