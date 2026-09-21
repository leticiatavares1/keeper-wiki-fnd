<script lang="ts">
	import { page } from '$app/state';
	import type { RecipeCard, Ref } from '$lib/api/types';
	import { itemPath, points, qty, recipeDetail, recipeHead, refName } from '$lib/format';
	import Sprite from './Sprite.svelte';

	let { recipe }: { recipe: RecipeCard } = $props();

	type Slot = {
		href: string | null;
		nome: string;
		qtd: string;
		icone: string | null;
		estrela: number | null;
	};

	// O card só aparece dentro de /[game]: o parâmetro existe sempre.
	const game = $derived(page.params.game ?? '');
	// Grupo de níveis também tem ficha: 164 receitas pedem "Abóbora" sem dizer o
	// nível, e antes essas pontas ficavam sem link nenhum.
	const slot = (ref: Ref): Slot => ({
		href: ref.e_item || ref.e_grupo ? itemPath(game, ref) : null,
		nome: refName(ref),
		qtd: qty(ref),
		icone: ref.icone,
		estrela: ref.estrela
	});
	// Em construção, o objeto é uma das pontas: demolir consome o que está de pé
	// ("Remove"), construir produz o que se ergue ("Put").
	const objeto = $derived(recipe.objeto_pt ?? recipe.objeto_en);
	const objetoSlot: Slot[] = $derived(
		objeto ? [{ href: null, nome: objeto, qtd: '', icone: null, estrela: null }] : []
	);
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
				{#if s.icone || s.estrela}<Sprite icone={s.icone} estrela={s.estrela} />{/if}
				<span class="rotulo">
					{#if s.href}<a href={s.href}>{s.nome}</a>{:else}{s.nome}{/if}
					{#if s.qtd}<b>{s.qtd}</b>{/if}
				</span>
			</span>
		{/each}
		{#if sai.length}<span class="lp-op" aria-label="produz">→</span>{/if}
		{#each sai as s, i (s.nome + i)}
			{#if i > 0}<span class="lp-op" aria-hidden="true">+</span>{/if}
			<span class="lp-slot lp-slot-result">
				{#if s.icone || s.estrela}<Sprite icone={s.icone} estrela={s.estrela} />{/if}
				<span class="rotulo">
					{#if s.href}<a href={s.href}>{s.nome}</a>{:else}{s.nome}{/if}
					{#if s.qtd}<b>{s.qtd}</b>{/if}
				</span>
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
	/* Derivado: o slot do design system alinha texto pela base; com o sprite na
	   frente, ele vira uma célula de inventário — imagem e rótulo pelo centro. */
	.lp-slot {
		align-items: center;
		gap: var(--space-2);
	}
	.rotulo {
		display: inline-flex;
		align-items: baseline;
		gap: var(--space-1);
	}
	.recipe-note {
		margin: 0;
		padding: var(--space-2) var(--space-3);
		border-top: 1px solid var(--line);
	}
</style>
