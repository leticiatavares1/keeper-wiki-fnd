<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { BadgeTone } from '$lib/content/types';

	let { tone = 'neutral', children }: { tone?: BadgeTone; children: Snippet } = $props();
</script>

<span class="lp-badge" class:lp-badge-moss={tone === 'moss'} class:lp-badge-candle={tone === 'candle'} class:lp-badge-blood={tone === 'blood'} class:lp-badge-night={tone === 'night'}>
	{@render children()}
</span>
