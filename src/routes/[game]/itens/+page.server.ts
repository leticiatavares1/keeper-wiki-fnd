import { error } from '@sveltejs/kit';
import { gameIdsWithData, getContent } from '$lib/content';
import { itemName } from '$lib/format';
import { byName } from '$lib/search';
import { itemCards } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => gameIdsWithData.map((game) => ({ game }));

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content?.game.apiData) error(404, 'Jogo sem dado extraído');

	const entradas = [...(await itemCards())].sort(byName(itemName));
	const tipos = [...new Set(entradas.map((i) => i.tipo).filter((t): t is string => Boolean(t)))].sort(
		(a, b) => a.localeCompare(b, 'pt-BR')
	);

	return {
		items: entradas,
		tipos,
		// O que a lista mostra sem a caixa marcada: nem fora de uso, nem sem nome.
		usados: entradas.filter((i) => !i.nao_usado && (i.pt || i.en)).length,
		comNivel: entradas.filter((i) => i.niveis && !i.nao_usado && (i.pt || i.en)).length
	};
};
