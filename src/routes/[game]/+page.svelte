<script lang="ts">
	import { page } from '$app/state';
	import Infobox from '$lib/components/Infobox.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { gamePath } from '$lib/content';

	let { data } = $props();
	const content = $derived(data.content);
	const byGroup = $derived(
		content.groups.map((group) => ({
			group,
			articles: content.articles.filter((a) => a.group === group)
		}))
	);
	const stations = $derived(new Set(content.recipes.map((r) => r.station)).size);
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
				<a href={gamePath(content, 'corpos-e-autopsia')}>corpos e autópsia</a>. Procurando o que fabricar?
				Abra as <a href={gamePath(content, 'receitas')}>receitas</a>.
			</p>
		</section>

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
	</article>

	<Infobox
		title={content.game.title}
		subtitle="Simulação de cemitério medieval"
		rows={[
			['Estúdio', 'Lazy Bear Games'],
			['Editora', 'tinyBuild'],
			['Lançamento', '2018'],
			['Artigos', String(content.articles.length)],
			['Receitas', `${content.recipes.length} em ${stations} bancadas`]
		]}
	/>
</div>
