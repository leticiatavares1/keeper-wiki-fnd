import type { Recipe } from '$lib/content/types';

/** Minúsculas e sem acento, para a busca aceitar "maca" ou "Maçã". */
export function normalize(s: string): string {
	return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

/** Filtra por texto (resultado, ingrediente, nome em inglês, bancada) e por bancada exata. */
export function filterRecipes(recipes: Recipe[], query: string, station = ''): Recipe[] {
	const q = normalize(query);
	return recipes.filter((r) => {
		if (station && r.station !== station) return false;
		if (!q) return true;
		const haystack = [r.result.name, r.en ?? '', r.station, ...r.ingredients.map((i) => i.name)];
		return haystack.some((h) => normalize(h).includes(q));
	});
}

/** Agrupa mantendo a ordem de primeira aparição de cada categoria. */
export function groupByCategory(recipes: Recipe[]): { category: string; recipes: Recipe[] }[] {
	const groups = new Map<string, Recipe[]>();
	for (const r of recipes) groups.set(r.category, [...(groups.get(r.category) ?? []), r]);
	return [...groups].map(([category, recipes]) => ({ category, recipes }));
}
