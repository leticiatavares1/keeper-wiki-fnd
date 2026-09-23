<script lang="ts">
	import { page } from '$app/state';
	import Infobox from '$lib/components/Infobox.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Sprite from '$lib/components/Sprite.svelte';
	import { gamePath } from '$lib/content';
	import { itemName, stationName, techBranch, techName } from '$lib/format';

	let { data } = $props();
	const content = $derived(data.content);
	const dlc = $derived(data.dlc);
	const rows: [string, string][] = $derived([
		['Bancadas', String(data.stations.length)],
		['Receitas', String(dlc.receitas)],
		['Itens', String(data.items.length)],
		['Tecnologias', String(data.techs.length)]
	]);
</script>

<svelte:head>
	<title>{dlc.nome} · {content.game.title} · Guarda-covas</title>
	<meta
		name="description"
		content="O que a DLC {dlc.nome} traz a {content.game.title}: bancadas, itens e tecnologias."
	/>
</svelte:head>

<div class="lp-page">
	<Sidebar sections={data.nav} current={page.url.pathname} />

	<article class="lp-article lp-panel">
		<header class="wiki-head">
			<h1 class="lp-h1">{dlc.nome}</h1>
			<p class="lp-lede">
				Tudo o que a DLC põe no jogo, num lugar só. As receitas estão na página de cada bancada.
			</p>
		</header>

		<section class="wiki-section">
			<h2 class="lp-h2">Bancadas</h2>
			{#if data.stations.length === 0}
				<p class="lp-empty">Esta DLC não traz bancada nova.</p>
			{:else}
				<ul class="wiki-index com-imagem">
					{#each data.stations as station (station.id)}
						<li>
							<Sprite icone={station.icone} />
							<div>
								<a href="{gamePath(content, 'receitas')}/{station.id}">{stationName(station)}</a>
								<p>{station.receitas === 1 ? '1 receita' : `${station.receitas} receitas`}</p>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</section>

		<section class="wiki-section">
			<h2 class="lp-h2">Itens</h2>
			{#if data.items.length === 0}
				<p class="lp-empty">Nenhum item só desta DLC.</p>
			{:else}
				<ul class="wiki-index com-imagem">
					{#each data.items as item (item.id)}
						<li>
							<Sprite icone={item.icone} />
							<div>
								<a href="{gamePath(content, 'itens')}/{item.id}">{itemName(item)}</a>
								<p>
									{item.tipo ?? 'Sem tipo'}
									{#if item.niveis}· {item.niveis} níveis de qualidade{/if}
								</p>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</section>

		<section class="wiki-section">
			<h2 class="lp-h2">Tecnologias</h2>
			{#if data.techs.length === 0}
				<p class="lp-empty">Esta DLC não traz tecnologia nova.</p>
			{:else}
				<ul class="wiki-index tech-list">
					{#each data.techs as tech (tech.id)}
						<li>
							<h3>{techName(tech)}</h3>
							<p>{techBranch(tech)}</p>
						</li>
					{/each}
				</ul>
				<p>
					O custo e o que cada uma libera estão em <a
						href="{gamePath(content, 'tecnologias')}">tecnologias</a
					>.
				</p>
			{/if}
		</section>

		<p class="lp-body-sm lp-muted">
			Item que o jogo base também faz ou gasta fica no jogo base, e não aparece aqui. Filtre por
			esta DLC em <a href={gamePath(content, 'receitas')}>receitas</a>,
			<a href={gamePath(content, 'itens')}>itens</a> e
			<a href={gamePath(content, 'tecnologias')}>tecnologias</a> para ver o mesmo corte junto da busca.
		</p>
	</article>

	<Infobox title={dlc.nome} subtitle="DLC de {content.game.title}" {rows} />
</div>

<style>
	/* Derivado: mesmo padrão dos índices de bancada e item — imagem na frente. */
	.com-imagem li {
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: var(--space-3);
	}
	.com-imagem li div {
		display: grid;
		gap: var(--space-1);
	}
	/* Derivado: item de índice sem link, como na página de tecnologias. */
	.tech-list h3 {
		font-family: var(--font-pixel);
		font-size: 17px;
		line-height: 22px;
		font-weight: 500;
	}
</style>
