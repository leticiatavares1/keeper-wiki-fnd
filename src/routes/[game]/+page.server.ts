import { error } from '@sveltejs/kit';
import { availableGameIds, getContent } from '$lib/content';
import { groups, importInfo, items, recipeCount, stations, techs } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => availableGameIds.map((game) => ({ game }));

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content) error(404, 'Jogo não encontrado');
	if (!content.game.apiData) return { totals: null, extractedAt: null };

	const [bancadas, itens, gruposDeNivel, tecnologias, receitas, info] = await Promise.all([
		stations(),
		items(),
		groups(),
		techs(),
		recipeCount(),
		importInfo()
	]);

	return {
		totals: {
			// O mesmo número que a listagem mostra: item com níveis de qualidade
			// conta uma vez, não uma por estrela.
			itens: itens.filter((i) => !i.grupo).length + gruposDeNivel.length,
			receitas,
			bancadas: bancadas.filter((e) => e.receitas > 0).length,
			tecnologias: tecnologias.length
		},
		extractedAt: info.feita_em
	};
};
