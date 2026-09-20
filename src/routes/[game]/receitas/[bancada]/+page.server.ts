import { error } from '@sveltejs/kit';
import { gameIdsWithData, getContent } from '$lib/content';
import { byUsefulness } from '$lib/search';
import { stationRecipes, stations, toCard } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = async () => {
	const bancadas = (await stations()).filter((e) => e.receitas > 0);
	return gameIdsWithData.flatMap((game) => bancadas.map((e) => ({ game, bancada: e.id })));
};

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content?.game.apiData) error(404, 'Jogo sem dado extraído');

	const station = (await stations()).find((e) => e.id === params.bancada);
	if (!station || station.receitas === 0) error(404, 'Bancada não encontrada');

	const recipes = (await stationRecipes(station.id)).map(toCard).sort(byUsefulness);

	return { station, recipes };
};
