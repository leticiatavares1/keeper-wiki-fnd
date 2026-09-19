<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head><title>Página não encontrada · Guarda-covas</title></svelte:head>

<div class="erro">
	<div class="lp-empty">
		<h1 class="lp-h1">{page.status === 404 ? 'Página não encontrada' : 'Algo deu errado'}</h1>
		<p>
			{page.status === 404
				? 'Esta página não existe ou mudou de lugar. Volte ao início e procure de novo.'
				: 'A página não carregou. Recarregue e tente outra vez.'}
		</p>
		<a class="lp-btn lp-btn-primary" href="/">Voltar ao início</a>
	</div>
</div>

<style>
	.erro {
		max-width: 720px;
		margin: 0 auto;
		padding: var(--space-8) var(--space-4);
	}
</style>
