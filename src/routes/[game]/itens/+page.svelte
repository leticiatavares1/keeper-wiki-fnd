<script lang="ts">
	import { page } from '$app/state';
	import Badge from '$lib/components/Badge.svelte';
	import Infobox from '$lib/components/Infobox.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { gamePath } from '$lib/content';
	import { filterItems } from '$lib/search';

	let { data } = $props();
	const content = $derived(data.content);

	const LOTE = 80;
	let query = $state('');
	let tipo = $state('');
	let naoUsados = $state(false);
	let mostrar = $state(LOTE);

	const base = $derived(naoUsados ? data.items : data.items.filter((i) => !i.nao_usado));
	const results = $derived(filterItems(base, query, tipo));
	const visiveis = $derived(results.slice(0, mostrar));
	const rows: [string, string][] = $derived([
		['Itens no jogo', String(data.usados)],
		['Fora de uso', String(data.items.length - data.usados)],
		['Tipos', String(data.tipos.length)]
	]);

	function limpar() {
		query = '';
		tipo = '';
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
			<p class="lp-lede">Ache o item e veja, na ficha dele, o que o faz e o que o gasta.</p>
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
		</form>

		<label class="fora-de-uso lp-body-sm">
			<input
				type="checkbox"
				class="lp-check"
				checked={naoUsados}
				onchange={(e) => {
					naoUsados = e.currentTarget.checked;
					mostrar = LOTE;
				}}
			/>
			Mostrar também os itens que o jogo não usa
		</label>

		<p class="lp-label" aria-live="polite">
			{results.length === 1 ? '1 item' : `${results.length} itens`}
			{#if results.length > visiveis.length}· mostrando {visiveis.length}{/if}
		</p>

		{#if results.length === 0}
			<div class="lp-empty">
				<p>Nenhum item com esse nome. Tente o nome em inglês, ou parte da palavra.</p>
				<button type="button" class="lp-btn" onclick={limpar}>Limpar busca</button>
			</div>
		{:else}
			<ul class="wiki-index">
				{#each visiveis as item (item.id)}
					<li>
						<a href="{gamePath(content, 'itens')}/{item.id}">{item.pt ?? item.en ?? item.id}</a>
						<p>
							{item.tipo ?? 'Sem tipo'}
							{#if item.en && item.en !== item.pt}· {item.en}{/if}
							{#if item.nao_usado}<Badge>Fora de uso</Badge>{/if}
						</p>
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
			Setenta e cinco itens não têm tradução oficial: nesses, a wiki mostra o nome em inglês.
		</p>
	</article>

	<Infobox title="Itens" subtitle="Extraído do próprio Graveyard Keeper" {rows} />
</div>

<style>
	.filtros {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		gap: var(--space-4);
	}
	.fora-de-uso {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	@media (max-width: 720px) {
		.filtros {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
