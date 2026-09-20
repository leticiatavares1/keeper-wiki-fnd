<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import Infobox from '$lib/components/Infobox.svelte';
	import Recipe from '$lib/components/Recipe.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { gamePath } from '$lib/content';
	import { itemName, price } from '$lib/format';

	let { data } = $props();
	const content = $derived(data.content);
	const item = $derived(data.item);
	const nome = $derived(itemName(item));

	const LOTE = 20;
	let verProduz = $state(LOTE);
	let verGasta = $state(LOTE);

	const rows: [string, string][] = $derived(
		[
			['Tipo', item.tipo && item.tipo !== 'None' ? item.tipo : '—'],
			['Preço base', price(item.preco_base)],
			['Pilha', item.pilha ? String(item.pilha) : '—'],
			item.qualidade ? ['Qualidade', price(item.qualidade)] : null,
			item.eficiencia !== null && item.eficiencia !== 1 ? ['Eficiência', price(item.eficiencia)] : null,
			['Desgasta', item.tem_durabilidade ? 'Sim' : 'Não'],
			['Nome em inglês', item.en ?? '—'],
			['Id no jogo', item.id]
		].filter((r): r is [string, string] => r !== null)
	);
</script>

<svelte:head>
	<title>{nome} · Itens · {content.game.title} · Guarda-covas</title>
	<meta
		name="description"
		content="{nome} em {content.game.title}: {data.produce.length} receitas fazem e {data.consume
			.length} gastam este item."
	/>
</svelte:head>

<div class="lp-page">
	<Sidebar sections={data.nav} current={gamePath(content, 'itens')} />

	<article class="lp-article lp-panel">
		<header class="wiki-head">
			<h1 class="lp-h1">{nome}</h1>
			<p class="lp-lede">
				{item.descricao_pt ?? item.descricao_en ?? 'Onde este item é feito e onde ele é gasto.'}
			</p>
			{#if item.tipos_de_produto.length || item.nao_usado}
				<div class="wiki-badges">
					{#each item.tipos_de_produto.slice(0, 3) as t (t)}<Badge tone="moss">{t}</Badge>{/each}
					{#if item.nao_usado}<Badge>Fora de uso</Badge>{/if}
				</div>
			{/if}
		</header>

		<p class="lp-body-sm">
			<a href={gamePath(content, 'itens')}>← Todos os itens</a>
		</p>

		<section class="wiki-section">
			<h2 class="lp-h2">Como conseguir</h2>
			{#if data.produce.length === 0}
				<p>Nenhuma receita do jogo produz este item.</p>
			{:else}
				<div class="wiki-stack">
					{#each data.produce.slice(0, verProduz) as recipe (recipe.id)}<Recipe {recipe} />{/each}
				</div>
				{#if data.produce.length > verProduz}
					<p>
						<button type="button" class="lp-btn" onclick={() => (verProduz += LOTE)}>
							Mostrar mais {Math.min(LOTE, data.produce.length - verProduz)}
						</button>
					</p>
				{/if}
			{/if}
		</section>

		<section class="wiki-section">
			<h2 class="lp-h2">Usado em</h2>
			{#if data.consume.length === 0}
				<p>Nenhuma receita do jogo gasta este item.</p>
			{:else}
				<p class="lp-label">
					{data.consume.length === 1 ? '1 receita' : `${data.consume.length} receitas`}
				</p>
				<div class="wiki-stack">
					{#each data.consume.slice(0, verGasta) as recipe (recipe.id)}<Recipe {recipe} />{/each}
				</div>
				{#if data.consume.length > verGasta}
					<p>
						<button type="button" class="lp-btn" onclick={() => (verGasta += LOTE)}>
							Mostrar mais {Math.min(LOTE, data.consume.length - verGasta)}
						</button>
					</p>
				{/if}
			{/if}
		</section>
	</article>

	<Infobox title={nome} subtitle="Item" {rows} />
</div>
