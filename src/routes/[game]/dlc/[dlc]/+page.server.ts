import { error } from '@sveltejs/kit';
import { gameIdsWithData, getContent } from '$lib/content';
import { dlcOf, dlcSlug, isSeparateDlc, itemName, stationName, techName } from '$lib/format';
import { byName } from '$lib/search';
import { dlcs, itemCards, stations, techs } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = async () => {
	const separadas = (await dlcs()).filter(isSeparateDlc);
	return gameIdsWithData.flatMap((game) => separadas.map((d) => ({ game, dlc: dlcSlug(d.id) })));
};

export const load: PageServerLoad = async ({ params }) => {
	if (!getContent(params.game)?.game.apiData) error(404, 'Jogo sem dado extraído');
	const dlc = (await dlcs()).filter(isSeparateDlc).find((d) => dlcSlug(d.id) === params.dlc);
	if (!dlc) error(404, 'DLC não encontrada');

	const [todasBancadas, todosItens, todasTecnologias] = await Promise.all([
		stations(),
		itemCards(),
		techs()
	]);
	const daDlc = (r: Parameters<typeof dlcOf>[0]) => dlcOf(r) === dlc.id;

	// Os mesmos cortes dos índices: bancada sem receita não tem página, e item
	// fora de uso ou sem nome é peça interna.
	return {
		dlc,
		stations: todasBancadas.filter((e) => daDlc(e) && e.receitas > 0).sort(byName(stationName)),
		items: todosItens
			.filter((i) => daDlc(i) && !i.nao_usado && (i.pt || i.en))
			.sort(byName(itemName)),
		techs: todasTecnologias.filter(daDlc).sort(byName(techName))
	};
};
