<script lang="ts">
	import { page } from '$app/state';
	import Badge from '$lib/components/Badge.svelte';
	import Blocks from '$lib/components/Blocks.svelte';
	import Infobox from '$lib/components/Infobox.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { data } = $props();
	const article = $derived(data.article);
</script>

<svelte:head>
	<title>{article.title} · {data.content.game.title} · Guarda-covas</title>
	<meta name="description" content={article.summary} />
</svelte:head>

<div class="lp-page">
	<Sidebar sections={data.nav} current={page.url.pathname} />

	<article class="lp-article lp-panel">
		<header class="wiki-head">
			<h1 class="lp-h1">{article.title}</h1>
			<p class="lp-lede">{article.lede}</p>
			{#if article.badges?.length}
				<div class="wiki-badges">
					{#each article.badges as b (b.label)}<Badge tone={b.tone}>{b.label}</Badge>{/each}
				</div>
			{/if}
		</header>

		{#each article.sections as section (section.heading)}
			<section class="wiki-section">
				<h2 class="lp-h2">{section.heading}</h2>
				<Blocks blocks={section.blocks} recipes={data.recipes} />
			</section>
		{/each}
	</article>

	{#if article.infobox}
		<Infobox title={article.title} subtitle={article.infobox.subtitle} rows={article.infobox.rows} />
	{/if}
</div>
