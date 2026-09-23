<script lang="ts">
	import { page } from '$app/state';
	import Infobox from '$lib/components/Infobox.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { dlcPath, gamePath } from '$lib/content';
	import { isSeparateDlc } from '$lib/format';

	let { data } = $props();
	const content = $derived(data.content);
	const separadas = $derived(data.dlcs.filter(isSeparateDlc));
	const plural = (n: number, um: string, varios: string) => (n === 1 ? `1 ${um}` : `${n} ${varios}`);
	const rows: [string, string][] = $derived(
		separadas.map((d) => [d.nome, plural(d.receitas, 'receita', 'receitas')] as [string, string])
	);
</script>

<svelte:head>
	<title>DLCs · {content.game.title} · Guarda-covas</title>
	<meta
		name="description"
		content="O que cada DLC de {content.game.title} traz: bancadas, itens e tecnologias."
	/>
</svelte:head>

<div class="lp-page">
	<Sidebar sections={data.nav} current={page.url.pathname} />

	<article class="lp-article lp-panel">
		<header class="wiki-head">
			<h1 class="lp-h1">DLCs</h1>
			<p class="lp-lede">
				O cemitério cresce com cada DLC. Veja o que cada uma põe no jogo, separado do que vem na caixa.
			</p>
		</header>

		{#if separadas.length === 0}
			<div class="lp-empty">
				<p>Nenhuma DLC com dado extraído deste jogo.</p>
				<a class="lp-btn" href={gamePath(content)}>Voltar ao jogo base</a>
			</div>
		{:else}
			<ul class="wiki-index">
				{#each separadas as d (d.id)}
					<li>
						<a href={dlcPath(content, d)}>{d.nome}</a>
						<p>
							{plural(d.estacoes, 'bancada', 'bancadas')} · {plural(d.itens, 'item', 'itens')} ·
							{plural(d.tecnologias, 'tecnologia', 'tecnologias')} · {plural(
								d.receitas,
								'receita',
								'receitas'
							)}
						</p>
					</li>
				{/each}
			</ul>
		{/if}

		<p class="lp-body-sm lp-muted">
			O jogo só marca a DLC em parte das tecnologias. O resto a wiki deduz do próprio dado: a
			bancada pela mesa de construção da zona da DLC, a receita pela tecnologia que a libera e pela
			bancada onde é feita, e o item quando só receita da DLC o faz e nenhuma receita de fora o gasta.
			Na dúvida, fica no jogo base. Breaking Dead, a dos zumbis, virou atualização gratuita e conta
			como jogo base.
		</p>
	</article>

	<Infobox title="DLCs" subtitle="Receitas de cada uma" {rows} />
</div>
