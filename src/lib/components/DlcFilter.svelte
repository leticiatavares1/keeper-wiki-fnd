<script lang="ts">
	import type { Dlc } from '$lib/api/types';
	import { isSeparateDlc } from '$lib/format';
	import type { DlcFilter } from '$lib/search';

	// Campo "Conteúdo" dos índices: tudo, só o jogo base, ou uma DLC.
	let {
		dlcs,
		value = $bindable(''),
		onchange
	}: { dlcs: Dlc[]; value?: DlcFilter; onchange?: () => void } = $props();

	const separadas = $derived(dlcs.filter(isSeparateDlc));
</script>

<div class="lp-field">
	<label for="conteudo">Conteúdo</label>
	<select id="conteudo" class="lp-select" bind:value {onchange}>
		<option value="">Jogo base e DLCs</option>
		<option value="base">Só o jogo base</option>
		{#each separadas as d (d.id)}<option value={d.id}>{d.nome}</option>{/each}
	</select>
</div>
