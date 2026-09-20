<script lang="ts">
	import { page } from '$app/state';
	import Infobox from '$lib/components/Infobox.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { gamePath } from '$lib/content';
	import { points, techBranch, techName } from '$lib/format';
	import { filterTechs, groupBy } from '$lib/search';

	let { data } = $props();
	const content = $derived(data.content);

	let query = $state('');
	let ramo = $state('');

	const results = $derived(filterTechs(data.techs, query, ramo));
	const grupos = $derived(groupBy(results, techBranch));
	const rows: [string, string][] = $derived([
		['Tecnologias', String(data.techs.length)],
		['Ramos', String(data.ramos.length)],
		['Vermelho', 'Ofício'],
		['Verde', 'Natureza'],
		['Azul', 'Espírito']
	]);

	/** Receita liberada sem nome no jogo entra como contagem, não como id cru. */
	function libera(tech: (typeof data.techs)[number]) {
		const nomes = tech.libera_receitas.filter((r) => r.pt || r.en).map(techName);
		const semNome = tech.libera_receitas.length - nomes.length;
		const partes = [...nomes];
		if (semNome) partes.push(semNome === 1 ? '1 receita sem nome' : `${semNome} receitas sem nome`);
		if (tech.libera_perks.length)
			partes.push(
				tech.libera_perks.length === 1 ? '1 vantagem' : `${tech.libera_perks.length} vantagens`
			);
		return partes.join(', ');
	}
</script>

<svelte:head>
	<title>Tecnologias · {content.game.title} · Guarda-covas</title>
	<meta
		name="description"
		content="As {data.techs.length} tecnologias de {content.game.title}: custo em pontos, pré-requisitos e o que cada uma libera."
	/>
</svelte:head>

<div class="lp-page">
	<Sidebar sections={data.nav} current={page.url.pathname} />

	<article class="lp-article lp-panel">
		<header class="wiki-head">
			<h1 class="lp-h1">Tecnologias</h1>
			<p class="lp-lede">A árvore inteira: o que cada pesquisa cobra e o que ela destranca.</p>
		</header>

		<p>
			O custo vem em pontos de <a href={gamePath(content, 'pontos-de-tecnologia')}>três cores</a>.
			Uma tecnologia pode cobrar mais de uma.
		</p>

		<form class="filtros" role="search" onsubmit={(e) => e.preventDefault()}>
			<div class="lp-field">
				<label for="busca">Tecnologia</label>
				<input
					id="busca"
					class="lp-input"
					type="search"
					placeholder="Ex.: alquimia, forja, embalming"
					autocomplete="off"
					bind:value={query}
				/>
			</div>
			<div class="lp-field">
				<label for="ramo">Ramo</label>
				<select id="ramo" class="lp-select" bind:value={ramo}>
					<option value="">Todos</option>
					{#each data.ramos as r (r)}<option value={r}>{r}</option>{/each}
				</select>
			</div>
		</form>

		<p class="lp-label" aria-live="polite">
			{results.length === 1 ? '1 tecnologia' : `${results.length} tecnologias`}
		</p>

		{#if results.length === 0}
			<div class="lp-empty">
				<p>Nenhuma tecnologia com esse nome nesse ramo. Limpe o filtro e tente de novo.</p>
				<button
					type="button"
					class="lp-btn"
					onclick={() => {
						query = '';
						ramo = '';
					}}>Limpar busca</button
				>
			</div>
		{:else}
			{#each grupos as grupo (grupo.key)}
				<section class="wiki-section">
					<h2 class="lp-h2">{grupo.key}</h2>
					<ul class="wiki-index tech-list">
						{#each grupo.items as tech (tech.id)}
							<li>
								<h3>{techName(tech)}</h3>
								<p class="tech-custo">
									<span class="lp-stat"
										>{points(tech.custo)
											.map(([cor, n]) => `${cor} ×${n}`)
											.join(' · ') || 'Sem custo'}</span
									>
								</p>
								{#if tech.requer.length}
									<p>Precisa de {tech.requer.map(techName).join(', ')}.</p>
								{/if}
								{#if libera(tech)}<p class="lp-muted">Libera {libera(tech)}.</p>{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		{/if}

		<p class="lp-body-sm lp-muted">
			Algumas receitas liberadas não têm nome no jogo: o binário aponta para elas sem um item de
			saída. Elas entram na contagem, e não como um código sem sentido.
		</p>
	</article>

	<Infobox title="Árvore de pesquisa" subtitle="Custo em pontos" {rows} />
</div>

<style>
	.filtros {
		display: grid;
		grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		gap: var(--space-4);
	}
	/* Derivado: item de índice sem link, para tecnologia, que não tem página
	   própria. O título usa a mesma medida do link de .wiki-index. */
	.tech-list h3 {
		font-family: var(--font-pixel);
		font-size: 17px;
		line-height: 22px;
		font-weight: 500;
	}
	/* .wiki-index deixa todo parágrafo apagado; aqui só a linha do que libera é. */
	.tech-list p {
		color: var(--ink);
	}
	.tech-list p.lp-muted {
		color: var(--ink-muted);
	}
	.tech-custo .lp-stat {
		color: var(--candle-text);
	}
	@media (max-width: 720px) {
		.filtros {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
