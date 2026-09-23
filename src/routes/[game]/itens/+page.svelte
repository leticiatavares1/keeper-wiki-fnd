<script lang="ts">
	import { page } from '$app/state';
	import Badge from '$lib/components/Badge.svelte';
	import DlcBadge from '$lib/components/DlcBadge.svelte';
	import DlcFilter from '$lib/components/DlcFilter.svelte';
	import Infobox from '$lib/components/Infobox.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Sprite from '$lib/components/Sprite.svelte';
	import { gamePath } from '$lib/content';
	import { filterItems, type DlcFilter as Filtro } from '$lib/search';

	let { data } = $props();
	const content = $derived(data.content);

	const LOTE = 80;
	let query = $state('');
	let tipo = $state('');
	let internos = $state(false);
	let dlc = $state<Filtro>('');
	let mostrar = $state(LOTE);

	// Item que o jogo não usa, ou não nomeia, é peça interna: a ficha existe,
	// porque receita aponta para ele, mas a lista só o mostra se pedirem.
	const semNome = (i: { pt: string | null; en: string | null }) => !i.pt && !i.en;
	const base = $derived(internos ? data.items : data.items.filter((i) => !i.nao_usado && !semNome(i)));
	const results = $derived(filterItems(base, query, tipo, dlc));
	const visiveis = $derived(results.slice(0, mostrar));
	const rows: [string, string][] = $derived([
		['Itens no jogo', String(data.usados)],
		['Com níveis', String(data.comNivel)],
		['Fora de uso', String(data.items.filter((i) => i.nao_usado).length)],
		['Sem nome', String(data.items.filter(semNome).length)],
		['Tipos', String(data.tipos.length)]
	]);

	function limpar() {
		query = '';
		tipo = '';
		dlc = '';
		mostrar = LOTE;
	}
</script>

<svelte:head>
	<title>Itens · {content.game.title} · Guarda-covas</title>
	<meta
		name="description"
		content="Os {data.usados} itens de {content.game.title}: preço, pilha e as receitas que fazem e que gastam cada um."
	/>
</svelte:head>

<div class="lp-page">
	<Sidebar sections={data.nav} current={page.url.pathname} />

	<article class="lp-article lp-panel">
		<header class="wiki-head">
			<h1 class="lp-h1">Itens</h1>
			<p class="lp-lede">
				Ache o item e veja, na ficha dele, o que o faz e o que o gasta. Item que vem em níveis de
				qualidade aparece uma vez só: os níveis estão na ficha.
			</p>
		</header>

		<form class="filtros" role="search" onsubmit={(e) => e.preventDefault()}>
			<div class="lp-field">
				<label for="busca">Nome do item</label>
				<input
					id="busca"
					class="lp-input"
					type="search"
					placeholder="Ex.: pregos, tábua, nails"
					autocomplete="off"
					value={query}
					oninput={(e) => {
						query = e.currentTarget.value;
						mostrar = LOTE;
					}}
				/>
			</div>
			<div class="lp-field">
				<label for="tipo">Tipo</label>
				<select
					id="tipo"
					class="lp-select"
					value={tipo}
					onchange={(e) => {
						tipo = e.currentTarget.value;
						mostrar = LOTE;
					}}
				>
					<option value="">Todos</option>
					{#each data.tipos as t (t)}<option value={t}>{t}</option>{/each}
				</select>
			</div>
			{#if data.dlcs.length}
				<DlcFilter dlcs={data.dlcs} bind:value={dlc} onchange={() => (mostrar = LOTE)} />
			{/if}
		</form>

		<label class="fora-de-uso lp-body-sm">
			<input
				type="checkbox"
				class="lp-check"
				checked={internos}
				onchange={(e) => {
					internos = e.currentTarget.checked;
					mostrar = LOTE;
				}}
			/>
			Mostrar também os itens que o jogo não usa ou não nomeia
		</label>

		<p class="lp-label" aria-live="polite">
			{results.length === 1 ? '1 item' : `${results.length} itens`}
			{#if results.length > visiveis.length}· mostrando {visiveis.length}{/if}
		</p>

		{#if results.length === 0}
			<div class="lp-empty">
				<p>Nenhum item com esse nome nesses filtros. Tente o nome em inglês, parte da palavra, ou limpe os filtros.</p>
				<button type="button" class="lp-btn" onclick={limpar}>Limpar busca</button>
			</div>
		{:else}
			<ul class="wiki-index">
				{#each visiveis as item (item.id)}
					<li>
						<Sprite icone={item.icone} />
						<div>
							<a href="{gamePath(content, 'itens')}/{item.id}">{item.pt ?? item.en ?? item.id}</a>
							<p>
								{item.tipo ?? 'Sem tipo'}
								{#if item.en && item.en !== item.pt}· {item.en}{/if}
								{#if item.niveis}· {item.niveis} níveis de qualidade{/if}
								<DlcBadge registro={item} dlcs={data.dlcs} />
								{#if item.nao_usado}<Badge>Fora de uso</Badge>{/if}
								{#if semNome(item)}<Badge>Sem nome</Badge>{/if}
							</p>
						</div>
					</li>
				{/each}
			</ul>
			{#if results.length > visiveis.length}
				<p>
					<button type="button" class="lp-btn lp-btn-primary" onclick={() => (mostrar += LOTE)}>
						Mostrar mais {Math.min(LOTE, results.length - visiveis.length)}
					</button>
				</p>
			{/if}
		{/if}

		<p class="lp-body-sm lp-muted">
			Os nomes vêm da tradução oficial do jogo. Item que o jogo não nomeia aparece com o código
			interno dele, e só quando você marca a caixa acima.
		</p>
	</article>

	<Infobox title="Itens" subtitle="Extraído do próprio Graveyard Keeper" {rows} />
</div>

<style>
	/* Derivado: o índice de artigos ganha a imagem do item na frente do nome. */
	.wiki-index li {
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: var(--space-3);
	}
	.wiki-index li div {
		display: grid;
		gap: var(--space-1);
	}
	.filtros {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--space-4);
	}
	/* A busca ocupa a linha; os filtros dividem a de baixo. */
	.filtros > :first-child {
		grid-column: 1 / -1;
	}
	@media (max-width: 720px) {
		.filtros {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	.fora-de-uso {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
</style>
