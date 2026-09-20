<script lang="ts">
	import { page } from '$app/state';
	import Infobox from '$lib/components/Infobox.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { gamePath } from '$lib/content';
	import { date } from '$lib/format';

	let { data } = $props();
	const content = $derived(data.content);
	const totals = $derived(data.totals);
	const byGroup = $derived(
		content.groups.map((group) => ({
			group,
			articles: content.articles.filter((a) => a.group === group)
		}))
	);
	const rows: [string, string][] = $derived([
		['Estúdio', 'Lazy Bear Games'],
		['Lançamento', '2018'],
		['Artigos', String(content.articles.length)],
		...(totals
			? ([
					['Itens', String(totals.itens)],
					['Receitas', String(totals.receitas)],
					['Bancadas', String(totals.bancadas)],
					['Tecnologias', String(totals.tecnologias)]
				] as [string, string][])
			: [])
	]);
</script>

<svelte:head>
	<title>{content.game.title} · Guarda-covas</title>
	<meta name="description" content={content.game.blurb} />
</svelte:head>

<div class="lp-page">
	<Sidebar sections={data.nav} current={page.url.pathname} />

	<article class="lp-article lp-panel">
		<header class="wiki-head">
			<h1 class="lp-h1">{content.game.title}</h1>
			<p class="lp-lede">
				Você herdou um cemitério, uma igreja em ruínas e um burro que entrega cadáveres. Comece pelo
				guia dos primeiros dias.
			</p>
		</header>

		<section class="wiki-section">
			<h2 class="lp-h2">Por onde começar</h2>
			<p>
				Novo no jogo? Leia na ordem: <a href={gamePath(content, 'primeiros-dias')}>primeiros dias</a>,
				<a href={gamePath(content, 'semana')}>dias da semana</a> e
				<a href={gamePath(content, 'corpos-e-autopsia')}>corpos e autópsia</a>.
			</p>
		</section>

		{#if totals}
			<section class="wiki-section">
				<h2 class="lp-h2">O dado do jogo</h2>
				<p>
					Receitas, itens e tecnologias saem do próprio jogo, não de anotação de jogador. Procure
					pela bancada, pelo item ou pela pesquisa.
				</p>
				<ul class="wiki-index">
					<li>
						<a href={gamePath(content, 'receitas')}>Receitas por bancada</a>
						<p>{totals.receitas} receitas em {totals.bancadas} bancadas, com o que entra e o que sai.</p>
					</li>
					<li>
						<a href={gamePath(content, 'itens')}>Itens</a>
						<p>{totals.itens} itens: preço, pilha e todas as receitas que fazem e que gastam cada um.</p>
					</li>
					<li>
						<a href={gamePath(content, 'tecnologias')}>Tecnologias</a>
						<p>{totals.tecnologias} pesquisas, com custo em pontos e o que cada uma libera.</p>
					</li>
				</ul>
			</section>
		{/if}

		{#each byGroup as { group, articles } (group)}
			<section class="wiki-section">
				<h2 class="lp-h2">{group}</h2>
				<ul class="wiki-index">
					{#each articles as article (article.slug)}
						<li>
							<a href={gamePath(content, article.slug)}>{article.title}</a>
							<p>{article.summary}</p>
						</li>
					{/each}
				</ul>
			</section>
		{/each}

		{#if data.extractedAt}
			<p class="lp-body-sm lp-muted">
				Dado extraído do jogo em {date(data.extractedAt)}.
			</p>
		{/if}
	</article>

	<Infobox title={content.game.title} subtitle="Simulação de cemitério medieval" {rows} />
</div>
