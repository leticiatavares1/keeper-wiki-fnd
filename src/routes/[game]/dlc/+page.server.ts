import { error } from '@sveltejs/kit';
import { gameIdsWithData, getContent } from '$lib/content';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => gameIdsWithData.map((game) => ({ game }));

// As DLCs já chegam pelo layout do jogo; a página só precisa existir.
export const load: PageServerLoad = ({ params }) => {
	if (!getContent(params.game)?.game.apiData) error(404, 'Jogo sem dado extraído');
};
