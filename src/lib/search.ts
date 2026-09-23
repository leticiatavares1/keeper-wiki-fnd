import type { DlcId, ItemCard, RecipeCard, Station, Tech } from '$lib/api/types';
import { dlcOf, itemName, refName, stationName, techBranch, techName } from './format';

/** Filtro de conteúdo: '' é tudo, 'base' é o jogo base (com Breaking Dead,
 *  que a wiki conta como base), e o id de uma DLC é só ela. */
export type DlcFilter = '' | 'base' | DlcId;

export function matchesDlc(registro: { dlc: DlcId | null }, filtro: DlcFilter): boolean {
	if (!filtro) return true;
	const dlc = dlcOf(registro);
	return filtro === 'base' ? dlc === null : dlc === filtro;
}

/** Minúsculas e sem acento, para a busca aceitar "maca" ou "Maçã".
 *  Mesmo espírito do gk.normaliza() do banco. */
export function normalize(s: string): string {
	return s
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.trim();
}

function matches(query: string, haystack: (string | null)[]): boolean {
	const q = normalize(query);
	if (!q) return true;
	return haystack.some((h) => h && normalize(h).includes(q));
}

/** Busca por nome em português, em inglês ou pelo id do jogo. */
export function filterItems<T extends ItemCard>(
	items: T[],
	query: string,
	tipo = '',
	dlc: DlcFilter = ''
): T[] {
	return items.filter(
		(i) => (!tipo || i.tipo === tipo) && matchesDlc(i, dlc) && matches(query, [i.pt, i.en, i.id])
	);
}

/** Busca pelo que sai, pelo que entra, pela bancada e pelo id. */
export function filterRecipes<T extends RecipeCard>(recipes: T[], query: string): T[] {
	return recipes.filter((r) =>
		matches(query, [
			r.id,
			...r.saidas.map(refName),
			...r.entradas.map(refName),
			...r.estacoes.map(stationName)
		])
	);
}

export function filterStations(stations: Station[], query: string, dlc: DlcFilter = ''): Station[] {
	return stations.filter((e) => matchesDlc(e, dlc) && matches(query, [e.pt, e.en, e.id]));
}

/** Busca pelo nome da tecnologia e pelo que ela libera. */
export function filterTechs(techs: Tech[], query: string, branch = '', dlc: DlcFilter = ''): Tech[] {
	return techs.filter(
		(t) =>
			(!branch || techBranch(t) === branch) &&
			matchesDlc(t, dlc) &&
			matches(query, [t.pt, t.en, t.id, ...t.libera_receitas.map(techName)])
	);
}

/** Agrupa mantendo a ordem de primeira aparição de cada chave. */
export function groupBy<T>(itens: T[], chave: (item: T) => string): { key: string; items: T[] }[] {
	const grupos = new Map<string, T[]>();
	for (const item of itens) {
		const k = chave(item);
		grupos.set(k, [...(grupos.get(k) ?? []), item]);
	}
	return [...grupos].map(([key, items]) => ({ key, items }));
}

/** Ordena pelo nome que o jogador vê, em pt-BR. */
export function byName<T>(nome: (item: T) => string) {
	return (a: T, b: T) => nome(a).localeCompare(nome(b), 'pt-BR');
}

/** Ordem de leitura de uma lista de receitas: primeiro fabricar, depois
 *  construir, e por último demolir — dentro de cada grupo, pelo nome. */
export function byUsefulness(a: RecipeCard, b: RecipeCard): number {
	const posto = (r: RecipeCard) => (r.origem !== 'construcao' ? 0 : r.acao === 'Remove' ? 2 : 1);
	return posto(a) - posto(b) || recipeLabel(a).localeCompare(recipeLabel(b), 'pt-BR');
}

/** Nome que representa a receita numa lista: a primeira saída. */
export function recipeLabel(recipe: RecipeCard): string {
	const saida = recipe.saidas[0];
	if (saida) return refName(saida);
	return recipe.objeto_pt ?? recipe.objeto_en ?? recipe.id;
}
