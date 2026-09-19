<script lang="ts">
	import type { Recipe } from '$lib/content/types';

	let { recipe }: { recipe: Recipe } = $props();
</script>

<figure class="lp-recipe">
	<figcaption class="lp-recipe-head">
		<span>{recipe.station}</span>
		{#if recipe.time || recipe.note}
			<span>{[recipe.time, recipe.note].filter(Boolean).join(' · ')}</span>
		{/if}
	</figcaption>
	<div class="lp-recipe-flow">
		{#each recipe.ingredients as ing, i (ing.name)}
			{#if i > 0}<span class="lp-op" aria-hidden="true">+</span>{/if}
			<span class="lp-slot">{ing.name} <b>×{ing.qty}</b></span>
		{/each}
		<span class="lp-op" aria-label="produz">→</span>
		<span class="lp-slot lp-slot-result">{recipe.result.name} <b>×{recipe.result.qty}</b></span>
	</div>
</figure>

<style>
	figure {
		margin: 0;
	}
</style>
