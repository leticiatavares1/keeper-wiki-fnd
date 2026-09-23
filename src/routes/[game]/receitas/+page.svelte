<script lang="ts">
	import { page } from '$app/state';
	import Badge from '$lib/components/Badge.svelte';
	import Infobox from '$lib/components/Infobox.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Sprite from '$lib/components/Sprite.svelte';
	import { gamePath } from '$lib/content';
	import { date, stationName } from '$lib/format';
	import { filterStations } from '$lib/search';

	let { data } = $props();
	const content = $derived(data.content);

	let query = $state('');
	let internas = $state(false);

	// Bancada que o jogo não nomeia é objeto interno (spawner, arbusto, teste):
	// a página existe, porque a ficha do item aponta para ela, mas a lista a esconde.
	const semNome = (s: { pt: string | null; en: string | null }) => !s.pt && !s.en;
	const base = $derived(internas ? data.stations : data.stations.filter((s) => !semNome(s)));
	const results = $derived(filterStations(base, query));
	const rows: [string, string][] = $derived([
		['Itens', String(data.totals.itens)],
		['Receitas', String(data.totals.receitas)],
		['Bancadas', String(data.totals.bancadas)],
		['Tecnologias', String(data.totals.tecnologias)],
		['Extração', date(data.extractedAt)]
	]);
</script>

<svelte:head>
	<title>Receitas · {content.game.title} · Guarda-covas</title>
	<meta
		name="description"
		content="As {data.totals.receitas} receitas de {content.game
			.title}, separadas pelas {data.totals.bancadas} bancadas que as fabricam."
	/>
</svelte:head>

<div class="lp-page">
	<Sidebar sections={data.nav} current={page.url.pathname} />

	<article class="lp-article lp-panel">
		<header class="wiki-head">
			<h1 class="lp-h1">Receitas</h1>
			<p class="lp-lede">Tudo o que se fabrica começa numa bancada. Ache a sua.</p>
		</header>

		<p>
			Cada bancada tem a sua página, com o que entra e o que sai de cada receita. Procurando um
			ingrediente? Vá pela ficha do <a href={gamePath(content, 'itens')}>item</a>: ela lista o que o
			faz e o que o gasta.
		</p>

		<form class="filtros" role="search" onsubmit={(e) => e.preventDefault()}>
			<div class="lp-field">
				<label for="busca">Bancada</label>
				<input
					id="busca"
					class="lp-input"
					type="search"
					placeholder="Ex.: fogueira, bigorna, alchemy"
					autocomplete="off"
					bind:value={query}
				/>
			</div>
		</form>

		<label class="internas lp-body-sm">
			<input type="checkbox" class="lp-check" bind:checked={internas} />
			Mostrar também as bancadas que o jogo não nomeia
		</label>

		<p class="lp-label" aria-live="polite">
			{results.length === 1 ? '1 bancada' : `${results.length} bancadas`}
		</p>

		{#if results.length === 0}
			<div class="lp-empty">
				<p>Nenhuma bancada com esse nome. Tente parte da palavra, ou o nome em inglês.</p>
				<button type="button" class="lp-btn" onclick={() => (query = '')}>Limpar busca</button>
			</div>
		{:else}
			<ul class="wiki-index">
				{#each results as station (station.id)}
					<li>
						<Sprite icone={station.icone} />
						<div>
							<a href="{gamePath(content, 'receitas')}/{station.id}">{stationName(station)}</a>
							<p>
								{station.receitas === 1 ? '1 receita' : `${station.receitas} receitas`}
								{#if station.en && station.en !== stationName(station)}· {station.en}{/if}
								{#if semNome(station)}<Badge>Sem nome</Badge>{/if}
							</p>
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		<p class="lp-body-sm lp-muted">
			Os nomes vêm da tradução oficial do jogo. A busca aceita também o nome em inglês. Bancada
			que o jogo não nomeia aparece com o código interno dela, e só quando você marca a caixa acima.
		</p>
	</article>

	<Infobox title="Dado do jogo" subtitle="Extraído do próprio Graveyard Keeper" {rows} />
</div>

<style>
	/* Derivado: mesmo padrão do índice de itens — a imagem da bancada na frente
	   do nome, célula do inventário fixa mesmo quando falta ícone (a maioria). */
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
		gap: var(--space-4);
	}
	.internas {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
</style>
