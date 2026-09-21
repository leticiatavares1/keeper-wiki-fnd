import { error } from '@sveltejs/kit';
import type { ItemCard } from '$lib/api/types';
import { gameIdsWithData, getContent } from '$lib/content';
import { itemName } from '$lib/format';
import { byName } from '$lib/search';
import { groups, items } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => gameIdsWithData.map((game) => ({ game }));

const tipoVisivel = (tipo: string | null) => (tipo === 'None' ? null : tipo);

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content?.game.apiData) error(404, 'Jogo sem dado extraído');

	const [todos, gruposDeNivel] = await Promise.all([items(true), groups(true)]);

	// Uma entrada por item que o jogador reconhece: os três "Abóbora" são um
	// item só com três níveis de qualidade, e a ficha do grupo é que os mostra.
	// O índice manda só o que a busca usa; o resto está na ficha de cada item.
	const soltos: ItemCard[] = todos
		.filter((i) => !i.grupo)
		.map((i) => ({
			id: i.id,
			pt: i.pt,
			en: i.en,
			tipo: tipoVisivel(i.tipo),
			nao_usado: i.nao_usado,
			icone: i.icone,
			niveis: 0
		}));
	const comNivel: ItemCard[] = gruposDeNivel.map((g) => ({
		id: g.id,
		pt: g.pt,
		en: g.en,
		tipo: tipoVisivel(g.tipo),
		nao_usado: g.nao_usado,
		icone: g.icone,
		niveis: g.niveis
	}));
	const entradas = [...soltos, ...comNivel].sort(byName(itemName));

	const tipos = [...new Set(entradas.map((i) => i.tipo).filter((t): t is string => Boolean(t)))].sort(
		(a, b) => a.localeCompare(b, 'pt-BR')
	);

	return {
		items: entradas,
		tipos,
		usados: entradas.filter((i) => !i.nao_usado).length,
		comNivel: comNivel.filter((g) => !g.nao_usado).length
	};
};
