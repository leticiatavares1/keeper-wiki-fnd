<script lang="ts">
	import { parseRichText } from '$lib/richtext';

	let { text }: { text: string } = $props();
	const segments = $derived(parseRichText(text));
</script>

{#each segments as s, i (i)}{#if s.href}<a href={s.href}>{s.text}</a>{:else}{s.text}{/if}{/each}
