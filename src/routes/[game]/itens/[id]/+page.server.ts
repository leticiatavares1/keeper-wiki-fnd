import { error } from '@sveltejs/kit';
import { gameIdsWithData, getContent } from '$lib/content';
import { byUsefulness } from '$lib/search';
import { item, itemRecipes, items, toCard } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = async () => {
	// Inclusive os itens fora de uso: oito deles ainda aparecem em receita, e a
	// ficha precisa existir para o link do card não quebrar o prerender.
	const todos = await items(true);
	return gameIdsWithData.flatMap((game) => todos.map((i) => ({ game, id: i.id })));
};

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content?.game.apiData) error(404, 'Jogo sem dado extraído');

	const [dados, receitas] = await Promise.all([item(params.id), itemRecipes(params.id)]);

	return {
		item: dados,
		produce: receitas.produzem.map(toCard).sort(byUsefulness),
		consume: receitas.consomem.map(toCard).sort(byUsefulness)
	};
};
