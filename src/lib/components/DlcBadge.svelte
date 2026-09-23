<script lang="ts">
	import type { Dlc, DlcId } from '$lib/api/types';
	import { dlcOf } from '$lib/format';
	import Badge from './Badge.svelte';

	// Selo com o nome da DLC. Jogo base (e Breaking Dead, que a wiki conta como
	// base) não ganha selo: o selo marca a exceção, não a regra.
	let { registro, dlcs }: { registro: { dlc: DlcId | null }; dlcs: Dlc[] } = $props();

	const id = $derived(dlcOf(registro));
	const nome = $derived(id ? (dlcs.find((d) => d.id === id)?.nome ?? id) : null);
</script>

{#if nome}<Badge tone="night">{nome}</Badge>{/if}
