<script lang="ts">
	import type { NavSection } from '$lib/content/types';

	let { sections, current }: { sections: NavSection[]; current: string } = $props();

	// No celular a navegação fica recolhida atrás de um botão (padrão derivado).
	let open = $state(false);
	$effect(() => {
		current;
		open = false;
	});
</script>

<nav class="lp-nav" aria-label="Navegação da wiki">
	<button
		type="button"
		class="lp-btn lp-btn-quiet nav-toggle"
		aria-expanded={open}
		aria-controls="nav-body"
		onclick={() => (open = !open)}
	>
		{open ? 'Fechar navegação' : 'Abrir navegação'}
	</button>
	<div id="nav-body" class="nav-body" class:open>
		{#each sections as section (section.title)}
			<h4>{section.title}</h4>
			<ul>
				{#each section.items as item (item.href)}
					<li>
						<a href={item.href} aria-current={item.href === current ? 'page' : undefined}>{item.label}</a>
					</li>
				{/each}
			</ul>
		{/each}
	</div>
</nav>

<style>
	.nav-toggle {
		display: none;
	}
	@media (max-width: 720px) {
		.lp-nav {
			padding: var(--space-2);
		}
		.nav-toggle {
			display: inline-flex;
			align-items: center;
			width: 100%;
		}
		.nav-body:not(.open) {
			display: none;
		}
		.nav-body.open {
			margin: var(--space-2) calc(-1 * var(--space-2)) 0;
		}
	}
</style>
