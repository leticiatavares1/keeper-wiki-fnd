<script lang="ts">
	import type { RecipeCard } from '$lib/api/types';
	import type { Block } from '$lib/content/types';
	import Callout from './Callout.svelte';
	import Recipe from './Recipe.svelte';
	import RichText from './RichText.svelte';

	// As receitas vêm da API, buscadas no build pelo load da página.
	let { blocks, recipes }: { blocks: Block[]; recipes: Record<string, RecipeCard> } = $props();
</script>

{#each blocks as block, i (i)}
	{#if block.type === 'p'}
		<p><RichText text={block.text} /></p>
	{:else if block.type === 'list'}
		<svelte:element this={block.ordered ? 'ol' : 'ul'} class="wiki-list">
			{#each block.items as item, j (j)}<li><RichText text={item} /></li>{/each}
		</svelte:element>
	{:else if block.type === 'callout'}
		<Callout tone={block.tone} title={block.title}><RichText text={block.text} /></Callout>
	{:else if block.type === 'recipe'}
		{@const recipe = recipes[block.id]}
		{#if recipe}<Recipe {recipe} />{/if}
	{:else if block.type === 'table'}
		<div class="wiki-table-wrap">
			<table class="lp-table">
				<thead><tr>{#each block.head as h (h)}<th scope="col">{h}</th>{/each}</tr></thead>
				<tbody>
					{#each block.rows as row, r (r)}
						<tr>
							{#each row as cell, c (c)}
								<td class:num={block.numeric?.includes(c)}><RichText text={cell} /></td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
{/each}
