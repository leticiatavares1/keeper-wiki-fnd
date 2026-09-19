<script lang="ts">
	import { page } from '$app/state';
	import Infobox from '$lib/components/Infobox.svelte';
	import Recipe from '$lib/components/Recipe.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { filterRecipes, groupByCategory } from '$lib/recipes';

	let { data } = $props();
	const content = $derived(data.content);

	let query = $state('');
	let station = $state('');

	const stations = $derived([...new Set(content.recipes.map((r) => r.station))].sort());
	const results = $derived(filterRecipes(content.recipes, query, station));
	const groups = $derived(groupByCategory(results));
	const perStation = $derived(
		stations.map(
			(s) => [s, `×${content.recipes.filter((r) => r.station === s).length}`] as [string, string]
		)
	);

	function clear() {
		query = '';
		station = '';
	}
</script>

<svelte:head>
	<title>Receitas · {content.game.title} · Guarda-covas</title>
	<meta name="description" content="Receitas de {content.game.title}: ingredientes, quantidades e bancada." />
</svelte:head>

<div class="lp-page">
	<Sidebar sections={data.nav} current={page.url.pathname} />

	<article class="lp-article lp-panel">
		<header class="wiki-head">
			<h1 class="lp-h1">Receitas</h1>
			<p class="lp-lede">Tudo o que se fabrica começa numa bancada. Ache a sua.</p>
		</header>

		<form class="filtros" role="search" onsubmit={(e) => e.preventDefault()}>
			<div class="lp-field">
				<label for="busca">Item ou ingrediente</label>
				<input
					id="busca"
					class="lp-input"
					type="search"
					placeholder="Ex.: pregos, tábua, nails"
					autocomplete="off"
					bind:value={query}
				/>
			</div>
			<div class="lp-field">
				<label for="bancada">Bancada</label>
				<select id="bancada" class="lp-select" bind:value={station}>
					<option value="">Todas</option>
					{#each stations as s (s)}<option value={s}>{s}</option>{/each}
				</select>
			</div>
		</form>

		<p class="lp-label" aria-live="polite">
			{results.length === 1 ? '1 receita' : `${results.length} receitas`}
		</p>

		{#if results.length === 0}
			<div class="lp-empty">
				<p>Nenhuma receita com esse nome nessa bancada. Limpe a busca e tente outro termo.</p>
				<button type="button" class="lp-btn lp-btn-quiet" onclick={clear}>Limpar busca</button>
			</div>
		{:else}
			{#each groups as g (g.category)}
				<section class="wiki-section">
					<h2 class="lp-h2">{g.category}</h2>
					<div class="wiki-stack">
						{#each g.recipes as recipe (recipe.id)}<Recipe {recipe} />{/each}
					</div>
				</section>
			{/each}
		{/if}

		<p class="lp-body-sm lp-muted">
			Os nomes em português são tradução desta wiki. A busca aceita também o nome em inglês.
		</p>
	</article>

	<div class="bancadas">
		<Infobox title="Bancadas" subtitle="Receitas por bancada" rows={perStation} />
	</div>
</div>

<style>
	.filtros {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		gap: var(--space-4);
	}
	/* Wrapper transparente: a Infobox continua ocupando a coluna da direita do .lp-page. */
	.bancadas {
		display: contents;
	}
	.bancadas :global(.lp-infobox) {
		grid-column: 3;
		grid-row: 1;
	}
	@media (max-width: 1100px) {
		.bancadas :global(.lp-infobox) {
			grid-column: 2;
			width: 100%;
		}
	}
	/* No celular a ficha repete o filtro de bancada e empurra as receitas para baixo. */
	@media (max-width: 720px) {
		.filtros {
			grid-template-columns: minmax(0, 1fr);
		}
		.bancadas {
			display: none;
		}
	}
</style>
