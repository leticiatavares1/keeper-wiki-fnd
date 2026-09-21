<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import Infobox from '$lib/components/Infobox.svelte';
	import Recipe from '$lib/components/Recipe.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Sprite from '$lib/components/Sprite.svelte';
	import { gamePath } from '$lib/content';
	import { itemName, levelAnchor, onUse, price, starLabel } from '$lib/format';

	let { data } = $props();
	const content = $derived(data.content);
	const item = $derived(data.item);
	const nome = $derived(itemName(item));
	// Item com níveis de qualidade: a ficha é uma só, e os níveis são a tabela.
	const niveis = $derived(data.niveis);
	// O que o item faz quando o jogador o usa. Em ferramenta o jogo guarda o
	// custo de energia por golpe no mesmo campo, e aí `pode_usar` é falso: isso
	// é outra coisa, e a ficha não mostra.
	const efeito = $derived(item.pode_usar ? onUse(item.ao_usar) : '');
	const porFormula = $derived(item.pode_usar && item.ao_usar_expr.length > 0);
	const efeitoNoNivel = $derived(niveis.some((n) => n.pode_usar && onUse(n.ao_usar)));

	const LOTE = 20;
	let verProduz = $state(LOTE);
	let verGasta = $state(LOTE);

	// Preço, pilha e qualidade mudam de um nível para o outro: no item com níveis
	// quem mostra é a tabela, e a ficha não escolhe um nível para valer por todos.
	const rows: [string, string][] = $derived(
		([
			['Tipo', item.tipo && item.tipo !== 'None' ? item.tipo : '—'],
			...(niveis.length
				? [['Níveis', String(niveis.length)]]
				: [
						['Preço base', price(item.preco_base)],
						['Pilha', item.pilha ? String(item.pilha) : '—'],
						item.qualidade ? ['Qualidade', price(item.qualidade)] : null
					]),
			item.eficiencia !== null && item.eficiencia !== 1 ? ['Eficiência', price(item.eficiencia)] : null,
			['Desgasta', item.tem_durabilidade ? 'Sim' : 'Não'],
			['Nome em inglês', item.en ?? '—'],
			['Id no jogo', item.id]
		] as ([string, string] | null)[]).filter((r): r is [string, string] => r !== null)
	);
</script>

<svelte:head>
	<title>{nome} · Itens · {content.game.title} · Guarda-covas</title>
	<meta
		name="description"
		content="{nome} em {content.game.title}: {data.produce.length} receitas fazem e {data.consume
			.length} gastam este item."
	/>
</svelte:head>

<div class="lp-page">
	<Sidebar sections={data.nav} current={gamePath(content, 'itens')} />

	<article class="lp-article lp-panel">
		<header class="wiki-head">
			<h1 class="lp-h1">{nome}</h1>
			<p class="lp-lede">
				{item.descricao_pt ?? item.descricao_en ?? 'Onde este item é feito e onde ele é gasto.'}
			</p>
			{#if item.tipos_de_produto.length || item.nao_usado}
				<div class="wiki-badges">
					{#each item.tipos_de_produto.slice(0, 3) as t (t)}<Badge tone="moss">{t}</Badge>{/each}
					{#if item.nao_usado}<Badge>Fora de uso</Badge>{/if}
				</div>
			{/if}
		</header>

		<p class="lp-body-sm">
			<a href={gamePath(content, 'itens')}>← Todos os itens</a>
		</p>

		{#if !niveis.length && (efeito || porFormula)}
			<section class="wiki-section">
				<h2 class="lp-h2">Ao usar</h2>
				{#if efeito}
					<p>Use do inventário: <b class="efeito">{efeito}</b>.</p>
				{/if}
				{#if porFormula}
					<p class="lp-body-sm lp-muted">
						Some a isso o que o jogo guarda como fórmula, e não como número: depende de perk e de
						buff, então não cabe aqui como valor fixo.
					</p>
				{/if}
			</section>
		{/if}

		{#if niveis.length}
			<section class="wiki-section">
				<h2 class="lp-h2">Níveis de qualidade</h2>
				<p class="lp-body-sm lp-muted">
					O jogo faz este item em {niveis.length} níveis de qualidade, e a estrela no canto do ícone
					é o que separa um do outro. O que muda de um nível para o outro está na tabela.
				</p>
				<!-- Região que rola precisa receber foco, senão quem usa teclado não
				     alcança o que está fora da tela (WCAG 2.1.1). A regra do Svelte não
				     conhece a exceção de `role="region"` rolável. -->
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<div class="rolagem" role="region" aria-label="Níveis de qualidade" tabindex="0">
					<table class="lp-table">
						<thead>
							<tr>
								<th scope="col">Nível</th>
								{#if efeitoNoNivel}<th scope="col">Ao usar</th>{/if}
								<th scope="col">Preço base</th>
								<th scope="col">Pilha</th>
							</tr>
						</thead>
						<tbody>
							{#each niveis as nivel (nivel.id)}
								<tr id={levelAnchor(nivel.estrela)}>
									<td class="nivel">
										<Sprite icone={nivel.icone} estrela={nivel.estrela} mudo />
										<span>
											{itemName(nivel)}
											<small class="lp-muted"
												>{nivel.estrela ? starLabel(nivel.estrela) : 'Sem estrela'}</small
											>
										</span>
									</td>
									{#if efeitoNoNivel}
										<td class="efeito">{(nivel.pode_usar && onUse(nivel.ao_usar)) || '—'}</td>
									{/if}
									<td class="num">{price(nivel.preco_base)}</td>
									<td class="num">{nivel.pilha ?? '—'}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				{#if porFormula}
					<p class="lp-body-sm lp-muted">
						Some ao efeito de uso o que o jogo guarda como fórmula, e não como número: depende de
						perk e de buff, então não cabe na tabela como valor fixo.
					</p>
				{/if}
			</section>
		{/if}

		<section class="wiki-section">
			<h2 class="lp-h2">Como conseguir</h2>
			{#if data.produce.length === 0}
				<p>Nenhuma receita do jogo produz este item.</p>
			{:else}
				<div class="wiki-stack">
					{#each data.produce.slice(0, verProduz) as recipe (recipe.id)}<Recipe {recipe} />{/each}
				</div>
				{#if data.produce.length > verProduz}
					<p>
						<button type="button" class="lp-btn" onclick={() => (verProduz += LOTE)}>
							Mostrar mais {Math.min(LOTE, data.produce.length - verProduz)}
						</button>
					</p>
				{/if}
			{/if}
		</section>

		<section class="wiki-section">
			<h2 class="lp-h2">Usado em</h2>
			{#if data.consume.length === 0}
				<p>
					Nenhuma receita do jogo gasta este item.{#if efeito || efeitoNoNivel}
						Ele é para usar, não para virar outra coisa.{/if}
				</p>
			{:else}
				<p class="lp-label">
					{data.consume.length === 1 ? '1 receita' : `${data.consume.length} receitas`}
				</p>
				<div class="wiki-stack">
					{#each data.consume.slice(0, verGasta) as recipe (recipe.id)}<Recipe {recipe} />{/each}
				</div>
				{#if data.consume.length > verGasta}
					<p>
						<button type="button" class="lp-btn" onclick={() => (verGasta += LOTE)}>
							Mostrar mais {Math.min(LOTE, data.consume.length - verGasta)}
						</button>
					</p>
				{/if}
			{/if}
		</section>
	</article>

	<Infobox title={nome} subtitle={niveis.length ? 'Item com níveis' : 'Item'} {rows}>
		{#snippet media()}
			<Sprite icone={item.icone} estrela={item.estrela} grande />
		{/snippet}
	</Infobox>
</div>

<style>
	/* Derivado: com a coluna "Ao usar" a tabela não cabe em 360px. Quem rola é a
	   tabela, não a página — o resto da leitura fica no lugar. */
	.rolagem {
		overflow-x: auto;
	}
	/* Número em `stat`, como a quantidade do card de receita. O efeito é texto
	   com número dentro, então fica à esquerda: alinhar à direita como preço e
	   pilha embaralharia a leitura da coluna. */
	.efeito {
		font-family: var(--font-label);
		font-size: 13px;
		font-weight: 700;
		color: var(--candle-text);
	}
	/* Derivado: a primeira coluna da tabela vira célula de inventário — sprite,
	   estrela e nome do nível lado a lado. */
	.lp-table td.nivel {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.lp-table td.nivel small {
		display: block;
		font-family: var(--font-label);
		font-size: 11px;
		line-height: 16px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
</style>
