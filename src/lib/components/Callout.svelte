<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { CalloutTone } from '$lib/content/types';

	const labels: Record<CalloutTone, string> = { nota: 'Nota', dica: 'Dica', perigo: 'Perigo' };

	let { tone = 'nota', title, children }: { tone?: CalloutTone; title?: string; children: Snippet } =
		$props();
</script>

<aside class="lp-callout lp-callout-{tone}" role={tone === 'perigo' ? 'alert' : 'note'}>
	<div class="lp-callout-head">{title ?? labels[tone]}</div>
	<div class="lp-callout-body">{@render children()}</div>
</aside>
