<script lang="ts">
	import { page } from '$app/state';
	import Infobox from '$lib/components/Infobox.svelte';
	import Recipe from '$lib/components/Recipe.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { gamePath } from '$lib/content';
	import { stationName } from '$lib/format';
	import { filterRecipes } from '$lib/search';

	let { data } = $props();
	const content = $derived(data.content);
	const nome = $derived(stationName(data.station));

	const LOTE = 60;
	let query = $state('');
	let mostrar = $state(LOTE);

	const results = $derived(filterRecipes(data.recipes, query));
	const visiveis = $derived(results.slice(0, mostrar));
	const rows: [string, string][] = $derived([
		['Receitas', String(data.recipes.length)],
		['Nome em inglês', data.station.en ?? '—'],
		['Id no jogo', data.station.id]
	]);

	// Buscar de novo recomeça a lista: senão a busca some atrás do "mostrar mais".
	function buscar(valor: string) {
		query = valor;
		mostrar = LOTE;
	}
</script>

<svelte:head>
	<title>{nome} · Receitas · {content.game.title} · Guarda-covas</title>
	<meta
		name="description"
		content="As {data.recipes.length} receitas da bancada {nome} em {content.game.title}: o que entra, o que sai e quanto custa."
	/>
</svelte:head>

<div class="lp-page">
	<Sidebar sections={data.nav} current={gamePath(content, 'receitas')} />

	<article class="lp-article lp-panel">
		<header class="wiki-head">
			<h1 class="lp-h1">{nome}</h1>
			<p class="lp-lede">
				{data.recipes.length === 1
					? 'Uma receita sai desta bancada.'
					: `${data.recipes.length} receitas saem desta bancada.`}
			</p>
		</header>

		<p class="lp-body-sm">
			<a href={gamePath(content, 'receitas')}>← Todas as bancadas</a>
		</p>

		<form class="filtros" role="search" onsubmit={(e) => e.preventDefault()}>
			<div class="lp-field">
				<label for="busca">Item ou ingrediente</label>
				<input
					id="busca"
					class="lp-input"
					type="search"
					placeholder="Ex.: pregos, tábua, nails"
					autocomplete="off"
					value={query}
					oninput={(e) => buscar(e.currentTarget.value)}
				/>
			</div>
		</form>

		<p class="lp-label" aria-live="polite">
			{results.length === 1 ? '1 receita' : `${results.length} receitas`}
			{#if results.length > visiveis.length}· mostrando {visiveis.length}{/if}
		</p>

		{#if results.length === 0}
			<div class="lp-empty">
				<p>Nenhuma receita com esse nome nesta bancada. Limpe a busca e tente outro termo.</p>
				<button type="button" class="lp-btn" onclick={() => buscar('')}>Limpar busca</button>
			</div>
		{:else}
			<div class="wiki-stack">
				{#each visiveis as recipe (recipe.id)}<Recipe {recipe} />{/each}
			</div>
			{#if results.length > visiveis.length}
				<p>
					<button type="button" class="lp-btn lp-btn-primary" onclick={() => (mostrar += LOTE)}>
						Mostrar mais {Math.min(LOTE, results.length - visiveis.length)}
					</button>
				</p>
			{/if}
		{/if}

		<p class="lp-body-sm lp-muted">
			Quantidade, tempo e energia saem do jogo. Onde o jogo usa fórmula, a receita diz "por fórmula"
			em vez de um número inventado.
		</p>
	</article>

	<Infobox title={nome} subtitle="Bancada" {rows} />
</div>

<style>
	.filtros {
		display: grid;
		gap: var(--space-4);
	}
</style>
