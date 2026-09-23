<script lang="ts">
	import '$lib/styles/tokens.css';
	import '$lib/styles/components.css';
	import '$lib/styles/app.css';
	import { page } from '$app/state';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { gamePath } from '$lib/content';
	import type { GameContent } from '$lib/content/types';
	import type { Dlc } from '$lib/api/types';
	import { isSeparateDlc } from '$lib/format';

	let { children } = $props();

	// Dentro de um jogo com DLC, a barra separa o jogo base das DLCs. Fora dele
	// (início, erro), a barra fica só com a marca.
	const content = $derived(page.data.content as GameContent | undefined);
	const comDlc = $derived(((page.data.dlcs as Dlc[] | undefined) ?? []).some(isSeparateDlc));
	const dlcBase = $derived(content ? gamePath(content, 'dlc') : '');
	const naDlc = $derived(
		Boolean(dlcBase) && (page.url.pathname === dlcBase || page.url.pathname.startsWith(`${dlcBase}/`))
	);
</script>

<a class="skip-link lp-btn lp-btn-quiet" href="#conteudo">Pular para o conteúdo</a>

<header class="site-bar">
	<a class="site-brand" href="/">Guarda-covas <span>· wiki</span></a>
	{#if content && comDlc}
		<nav class="site-tabs" aria-label="Jogo base e DLCs">
			<a href={gamePath(content)} aria-current={naDlc ? undefined : 'true'}>Jogo base</a>
			<a href={dlcBase} aria-current={naDlc ? 'true' : undefined}>DLCs</a>
		</nav>
	{/if}
	<ThemeToggle />
</header>

<main id="conteudo">
	{@render children()}
</main>

<footer class="site-foot">
	Wiki de fã, sem ligação com a Lazy Bear Games ou a tinyBuild. Dados conferidos na
	<a href="https://graveyardkeeper.fandom.com" rel="noopener">Graveyard Keeper Wiki</a>.
</footer>
