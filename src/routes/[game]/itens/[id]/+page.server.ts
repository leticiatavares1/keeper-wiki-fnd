import { error } from '@sveltejs/kit';
import type { Item, ItemRecipes } from '$lib/api/types';
import { gameIdsWithData, getContent } from '$lib/content';
import { byUsefulness } from '$lib/search';
import { group, groupRecipes, groups, item, itemRecipes, items, toCard } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = async () => {
	// Uma ficha por item que o jogador reconhece: os níveis de qualidade não têm
	// página própria, vivem na ficha do grupo. Itens fora de uso entram: oito
	// deles ainda aparecem em receita, e link quebrado derruba o prerender.
	const [todos, gruposDeNivel] = await Promise.all([items(true), groups(true)]);
	const ids = [
		...todos.filter((i) => !i.grupo).map((i) => i.id),
		...gruposDeNivel.map((g) => g.id)
	];
	return gameIdsWithData.flatMap((game) => ids.map((id) => ({ game, id })));
};

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content?.game.apiData) error(404, 'Jogo sem dado extraído');

	const grupo = (await groups(true)).some((g) => g.id === params.id);

	let ficha: Item;
	let niveis: Item[] = [];
	let receitas: ItemRecipes;

	if (grupo) {
		// O grupo não tem preço nem pilha próprios: cada nível tem o seu, e é a
		// tabela de níveis que mostra. O resto da ficha vem do nível mais baixo.
		const [detalhe, dela] = await Promise.all([group(params.id), groupRecipes(params.id)]);
		const base = detalhe.itens[0];
		if (!base) error(404, 'Grupo sem níveis');
		ficha = {
			...base,
			id: detalhe.id,
			pt: detalhe.pt,
			en: detalhe.en,
			icone: detalhe.icone,
			// O grupo não tem estrela: estrela é o que separa um nível do outro.
			estrela: null
		};
		niveis = detalhe.itens;
		receitas = dela;
	} else {
		[ficha, receitas] = await Promise.all([item(params.id), itemRecipes(params.id)]);
	}

	return {
		item: ficha,
		niveis,
		produce: receitas.produzem.map(toCard).sort(byUsefulness),
		consume: receitas.consomem.map(toCard).sort(byUsefulness)
	};
};
