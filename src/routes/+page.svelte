<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import { games } from '$lib/content';
</script>

<svelte:head>
	<title>Guarda-covas · wiki de Graveyard Keeper</title>
	<meta name="description" content="Receitas, dicas para iniciantes e mecânicas de Graveyard Keeper, em português." />
</svelte:head>

<div class="home">
	<header class="home-head">
		<h1 class="lp-display">Guarda-covas</h1>
		<p class="lp-lede">
			Receitas, dicas e as mecânicas que o jogo prefere não explicar. Escolha o seu cemitério.
		</p>
	</header>

	<ul class="home-games">
		{#each games as game (game.id)}
			<li class="lp-panel lp-panel-float">
				<h2 class="lp-panel-head">{game.title}</h2>
				{#if game.soon}
					<div class="home-badges"><Badge tone="night">Em breve</Badge></div>
				{/if}
				<p>{game.blurb}</p>
				{#if !game.soon}
					<a class="lp-btn lp-btn-primary" href="/{game.id}">Abrir a wiki</a>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	.home {
		max-width: 960px;
		margin: 0 auto;
		padding: var(--space-8);
		display: grid;
		gap: var(--space-8);
	}
	.home-head {
		display: grid;
		gap: var(--space-3);
		max-width: 720px;
	}
	.home-games {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-6);
		align-items: start;
	}
	.home-games li {
		display: grid;
		gap: var(--space-4);
		justify-items: start;
	}
	.home-games h2 {
		justify-self: stretch;
	}
	.home-badges {
		display: flex;
		gap: var(--space-2);
	}
	@media (max-width: 720px) {
		.home {
			padding: var(--space-4);
			gap: var(--space-6);
		}
	}
</style>
