<script lang="ts">
	import { page } from '$app/state';
	import type { RecipeCard, Ref } from '$lib/api/types';
	import { points, qty, recipeDetail, recipeHead, refName } from '$lib/format';

	let { recipe }: { recipe: RecipeCard } = $props();

	type Slot = { id: string | null; nome: string; qtd: string };

	const slot = (ref: Ref): Slot => ({
		id: ref.e_item ? ref.ref_id : null,
		nome: refName(ref),
		qtd: qty(ref)
	});

	const game = $derived(page.params.game);
	// Em construção, o objeto é uma das pontas: demolir consome o que está de pé
	// ("Remove"), construir produz o que se ergue ("Put").
	const objeto = $derived(recipe.objeto_pt ?? recipe.objeto_en);
	const objetoSlot: Slot[] = $derived(objeto ? [{ id: null, nome: objeto, qtd: '' }] : []);
	const entra: Slot[] = $derived(
		recipe.entradas.length
			? recipe.entradas.map(slot)
			: recipe.acao === 'Remove'
				? objetoSlot
				: []
	);
	const sai: Slot[] = $derived(
		recipe.saidas.length ? recipe.saidas.map(slot) : recipe.acao === 'Put' ? objetoSlot : []
	);
	// Derivado: rodapé de nota da receita, no mesmo espírito do cabeçalho.
	const notas = $derived(
		[
			recipe.entradas_da_estacao.length &&
				`A bancada gasta ${recipe.entradas_da_estacao.map((r) => `${refName(r)} ${qty(r)}`).join(', ')}`,
			points(recipe.pontos_tecnologia).length &&
				`Rende ${points(recipe.pontos_tecnologia)
					.map(([cor, n]) => `${cor} ×${n}`)
					.join(', ')}`,
			recipe.precisa_desbloquear && 'Precisa de pesquisa'
		].filter((n): n is string => Boolean(n))
	);
</script>

<figure class="lp-recipe">
	<figcaption class="lp-recipe-head">
		<span>{recipeHead(recipe)}</span>
		<span>{recipeDetail(recipe)}</span>
	</figcaption>
	<div class="lp-recipe-flow">
		{#each entra as s, i (s.nome + i)}
			{#if i > 0}<span class="lp-op" aria-hidden="true">+</span>{/if}
			<span class="lp-slot">
				{#if s.id}<a href="/{game}/itens/{s.id}">{s.nome}</a>{:else}{s.nome}{/if}
				{#if s.qtd}<b>{s.qtd}</b>{/if}
			</span>
		{/each}
		{#if sai.length}<span class="lp-op" aria-label="produz">→</span>{/if}
		{#each sai as s, i (s.nome + i)}
			{#if i > 0}<span class="lp-op" aria-hidden="true">+</span>{/if}
			<span class="lp-slot lp-slot-result">
				{#if s.id}<a href="/{game}/itens/{s.id}">{s.nome}</a>{:else}{s.nome}{/if}
				{#if s.qtd}<b>{s.qtd}</b>{/if}
			</span>
		{/each}
	</div>
	{#if notas.length}
		<p class="recipe-note lp-body-sm lp-muted">{notas.join(' · ')}</p>
	{/if}
</figure>

<style>
	figure {
		margin: 0;
	}
	.recipe-note {
		margin: 0;
		padding: var(--space-2) var(--space-3);
		border-top: 1px solid var(--line);
	}
</style>
