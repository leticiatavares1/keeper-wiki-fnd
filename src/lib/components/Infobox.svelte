<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		subtitle,
		rows,
		media
	}: { title: string; subtitle?: string; rows: [string, string][]; media?: Snippet } = $props();
</script>

<section class="lp-infobox" aria-label="Ficha: {title}">
	<h3 class="lp-infobox-title">
		{title}
		{#if subtitle}<span class="lp-infobox-sub">{subtitle}</span>{/if}
	</h3>
	{#if media}<div class="lp-infobox-media">{@render media()}</div>{/if}
	<dl>
		{#each rows as [label, value] (label)}
			<div class="lp-infobox-row"><dt>{label}</dt><dd>{value}</dd></div>
		{/each}
	</dl>
</section>
