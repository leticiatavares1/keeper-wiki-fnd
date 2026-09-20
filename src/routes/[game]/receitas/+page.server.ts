import { error } from '@sveltejs/kit';
import { gameIdsWithData, getContent } from '$lib/content';
import { byName } from '$lib/search';
import { importInfo, items, recipeCount, stations, techs } from '$lib/server/api';
import { stationName } from '$lib/format';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => gameIdsWithData.map((game) => ({ game }));

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content?.game.apiData) error(404, 'Jogo sem dado extraído');

	const [todas, itens, tecnologias, receitas, info] = await Promise.all([
		stations(),
		items(),
		techs(),
		recipeCount(),
		importInfo()
	]);

	// Bancada sem receita visível não vira página: não há o que mostrar nela.
	const bancadas = todas.filter((e) => e.receitas > 0).sort(byName(stationName));

	return {
		stations: bancadas,
		totals: {
			itens: itens.length,
			receitas,
			bancadas: bancadas.length,
			tecnologias: tecnologias.length
		},
		extractedAt: info.feita_em
	};
};
