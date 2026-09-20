// Como o dado cru da API vira texto na tela. Regra do Lápide: número sempre em
// `stat`, quantidade com ×, tempo em s/min. O que o jogo guarda como fórmula
// aparece como fórmula — não se arredonda o que não é número.

import type { ItemCard, RecipeCard, Ref, Station, StationRef, Tech, TechRef } from '$lib/api/types';

const nf = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

/** Cores dos pontos de tecnologia, na ordem em que o jogo mostra. */
const CORES: [string, string][] = [
	['r', 'Vermelho'],
	['g', 'Verde'],
	['b', 'Azul'],
	['gratitude_points', 'Gratidão']
];

/** Nem todo item tem tradução oficial: 75 dos 770 caem no nome em inglês. */
export function itemName(item: ItemCard): string {
	return item.pt ?? item.en ?? item.id;
}

export function refName(ref: Ref): string {
	return ref.pt ?? ref.en ?? ref.ref_id;
}

export function stationName(station: Station | StationRef): string {
	return station.pt ?? station.en ?? station.id;
}

export function techName(tech: Tech | TechRef): string {
	return tech.pt ?? tech.en ?? tech.id;
}

/** "×5", "×3–5" na faixa, "×?" quando a quantidade é fórmula do jogo. */
export function qty(ref: Ref): string {
	if (ref.qtd === null) return ref.qtd_expr ? '×?' : '';
	const inicio = nf.format(ref.qtd);
	return ref.qtd_max && ref.qtd_max !== ref.qtd ? `×${inicio}–${nf.format(ref.qtd_max)}` : `×${inicio}`;
}

/** Tempo de fabricação. Vazio quando não há tempo nem fórmula. */
export function time(recipe: RecipeCard): string {
	const s = recipe.tempo_s;
	if (s === null) return recipe.tempo_expr ? 'tempo por fórmula' : '';
	if (s < 60) return `${nf.format(s)}s`;
	const min = Math.floor(s / 60);
	const resto = Math.round(s % 60);
	return resto ? `${min} min ${resto}s` : `${min} min`;
}

/** Energia gasta. Vazio quando a receita não gasta nada. */
export function energy(recipe: RecipeCard): string {
	if (recipe.energia === null) return recipe.energia_expr ? 'energia por fórmula' : '';
	return recipe.energia === 0 ? '' : `${nf.format(recipe.energia)} de energia`;
}

/** Data da extração, em UTC para não virar o dia no fuso de quem compila. */
export function date(iso: string): string {
	return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'UTC' }).format(new Date(iso));
}

export function price(valor: number | null): string {
	return valor === null ? '—' : nf.format(valor);
}

/** Pontos por cor, já com nome: [["Vermelho", 5], ["Azul", 1]].
 *  Cor sem número no binário fica de fora: não se inventa valor. */
export function points(mapa: Record<string, number | null>): [string, number][] {
	const conhecidas = CORES.filter(([chave]) => mapa[chave]).map(
		([chave, nome]) => [nome, mapa[chave]!] as [string, number]
	);
	const resto = Object.entries(mapa).filter(
		([chave, valor]) => valor && !CORES.some(([c]) => c === chave)
	) as [string, number][];
	return [...conhecidas, ...resto];
}

/** Receita de objeto do mundo: "Put" constrói, "Remove" demole. */
export function buildAction(recipe: RecipeCard): string | null {
	if (recipe.origem !== 'construcao') return null;
	return recipe.acao === 'Remove' ? 'Demolição' : 'Construção';
}

/** Cabeçalho da receita: as bancadas e, em construção, o que a receita faz. */
export function recipeHead(recipe: RecipeCard): string {
	const bancadas = recipe.estacoes.map(stationName).join(' · ');
	return [bancadas, buildAction(recipe)].filter(Boolean).join(' · ') || 'Sem bancada';
}

/** Canto direito do cabeçalho: tempo e energia. */
export function recipeDetail(recipe: RecipeCard): string {
	return [time(recipe), energy(recipe)].filter(Boolean).join(' · ');
}

/** Tecnologia sem ramo fica junta no fim, não some. */
export function techBranch(tech: Tech): string {
	return tech.ramo_pt ?? 'Sem ramo';
}
