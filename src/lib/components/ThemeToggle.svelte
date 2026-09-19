<script lang="ts">
	import { onMount } from 'svelte';

	type Theme = 'noite' | 'pergaminho';
	let theme = $state<Theme>('noite');

	onMount(() => {
		const explicit = document.documentElement.dataset.theme;
		if (explicit === 'noite' || explicit === 'pergaminho') theme = explicit;
		else theme = matchMedia('(prefers-color-scheme: light)').matches ? 'pergaminho' : 'noite';
	});

	function toggle() {
		theme = theme === 'noite' ? 'pergaminho' : 'noite';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('tema', theme);
		} catch {
			// Sem armazenamento: o tema vale só nesta visita.
		}
	}
</script>

<button type="button" class="lp-btn lp-btn-quiet" onclick={toggle} aria-pressed={theme === 'pergaminho'}>
	{theme === 'noite' ? 'Tema pergaminho' : 'Tema noite'}
</button>
