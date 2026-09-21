<script lang="ts">
	// Imagem do item, em pixel art, do tamanho em que o jogo a desenha: sem
	// esticar, sem arredondar canto, `image-rendering: pixelated` (`.lp-sprite`).
	// A estrela de qualidade é um segundo sprite por cima, como no inventário.
	import { spritePath, starLabel } from '$lib/format';

	let {
		icone,
		estrela = null,
		grande = false,
		mudo = false
	}: {
		icone: string | null;
		estrela?: number | null;
		grande?: boolean;
		/** Quando o nível já está escrito ao lado, a estrela não se repete no leitor de tela. */
		mudo?: boolean;
	} = $props();
</script>

<span class="moldura" class:grande aria-hidden={icone || estrela ? undefined : 'true'}>
	{#if icone}
		<img class="lp-sprite" src={spritePath(icone)} alt="" loading="lazy" decoding="async" />
	{/if}
	{#if estrela}
		<!-- A estrela diz o nível, que o nome não diz: só é decorativa quando a
		     tela escreve o nível do lado. -->
		<img
			class="lp-sprite estrela"
			src={spritePath(`item_star_${estrela}`)}
			alt={mudo ? '' : starLabel(estrela)}
			loading="lazy"
			decoding="async"
		/>
	{/if}
</span>

<style>
	/* Derivado: o design system tem o sprite (.lp-sprite), não a moldura que o
	   segura. A moldura é a célula de inventário do jogo, 32px: quase todo
	   sprite cabe nela em escala 1:1. O tamanho é fixo para a lista não dançar
	   quando falta arte — quatro itens em uso não têm sprite no jogo. */
	.moldura {
		position: relative;
		display: grid;
		place-items: center;
		flex: none;
		width: 32px;
		height: 32px;
	}
	.moldura img {
		max-width: 32px;
		max-height: 32px;
	}
	.estrela {
		position: absolute;
		top: 0;
		right: 0;
	}
	/* Na ficha, o mesmo sprite em escala inteira ×2, que é o que a arte pede. */
	.grande {
		width: 112px;
		height: 112px;
	}
	.grande img {
		max-width: 56px;
		max-height: 56px;
		transform: scale(2);
	}
	.grande .estrela {
		transform-origin: top right;
	}
</style>
