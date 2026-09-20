import { error } from '@sveltejs/kit';
import { gameIdsWithData, getContent } from '$lib/content';
import { itemName } from '$lib/format';
import { byName } from '$lib/search';
import { items } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => gameIdsWithData.map((game) => ({ game }));

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content?.game.apiData) error(404, 'Jogo sem dado extraído');

	// O índice manda só o que a busca usa: o resto está na ficha de cada item.
	const todos = (await items(true)).sort(byName(itemName)).map((i) => ({
		id: i.id,
		pt: i.pt,
		en: i.en,
		tipo: i.tipo === 'None' ? null : i.tipo,
		nao_usado: i.nao_usado
	}));

	const tipos = [...new Set(todos.map((i) => i.tipo).filter((t): t is string => Boolean(t)))].sort(
		(a, b) => a.localeCompare(b, 'pt-BR')
	);

	return { items: todos, tipos, usados: todos.filter((i) => !i.nao_usado).length };
};
