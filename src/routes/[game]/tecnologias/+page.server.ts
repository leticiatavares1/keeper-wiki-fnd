import { error } from '@sveltejs/kit';
import { gameIdsWithData, getContent } from '$lib/content';
import { techBranch, techName } from '$lib/format';
import { byName } from '$lib/search';
import { techs } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => gameIdsWithData.map((game) => ({ game }));

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content?.game.apiData) error(404, 'Jogo sem dado extraído');

	const todas = (await techs()).sort(byName(techName));
	const ramos = [...new Set(todas.map(techBranch))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

	return { techs: todas, ramos };
};
