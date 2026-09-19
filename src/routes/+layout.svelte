<script lang="ts">
	import '$lib/styles/tokens.css';
	import '$lib/styles/components.css';
	import '$lib/styles/app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children } = $props();
</script>

<a class="skip-link lp-btn lp-btn-quiet" href="#conteudo">Pular para o conteúdo</a>

<header class="site-bar">
	<a class="site-brand" href="/">Guarda-covas <span>· wiki</span></a>
	<ThemeToggle />
</header>

<main id="conteudo">
	{@render children()}
</main>

<footer class="site-foot">
	Wiki de fã, sem ligação com a Lazy Bear Games ou a tinyBuild. Dados conferidos na
	<a href="https://graveyardkeeper.fandom.com" rel="noopener">Graveyard Keeper Wiki</a>.
</footer>
