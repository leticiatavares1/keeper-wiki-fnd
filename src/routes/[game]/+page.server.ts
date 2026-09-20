import { error } from '@sveltejs/kit';
import { availableGameIds, getContent } from '$lib/content';
import { importInfo, items, recipeCount, stations, techs } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => availableGameIds.map((game) => ({ game }));

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content) error(404, 'Jogo não encontrado');
	if (!content.game.apiData) return { totals: null, extractedAt: null };

	const [bancadas, itens, tecnologias, receitas, info] = await Promise.all([
		stations(),
		items(),
		techs(),
		recipeCount(),
		importInfo()
	]);

	return {
		totals: {
			itens: itens.length,
			receitas,
			bancadas: bancadas.filter((e) => e.receitas > 0).length,
			tecnologias: tecnologias.length
		},
		extractedAt: info.feita_em
	};
};
