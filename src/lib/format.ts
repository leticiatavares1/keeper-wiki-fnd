// Como o dado cru da API vira texto na tela. Regra do Lápide: número sempre em
// `stat`, quantidade com ×, tempo em s/min. O que o jogo guarda como fórmula
// aparece como fórmula — não se arredonda o que não é número.

import type { Item, RecipeCard, Ref, Station, StationRef, Tech, TechRef } from '$lib/api/types';

const nf = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

/** Cores dos pontos de tecnologia, na ordem em que o jogo mostra. */
const CORES: [string, string][] = [
	['r', 'Vermelho'],
	['g', 'Verde'],
	['b', 'Azul'],
	['gratitude_points', 'Gratidão']
];

/** As três estrelas de qualidade do jogo, na ordem em que o jogador as sobe. */
const ESTRELAS = ['bronze', 'prata', 'ouro'];

/** Recursos que um item devolve ao ser usado, na ordem em que a ficha mostra. */
const RECURSOS: [string, string][] = [
	['energy', 'energia'],
	['hp', 'saúde'],
	['r', 'ponto vermelho'],
	['g', 'ponto verde'],
	['b', 'ponto azul']
];

/** Nem todo item tem tradução oficial: 75 dos 770 caem no nome em inglês.
 *  Serve para o item, para o recorte da listagem e para o grupo de níveis. */
export function itemName(item: Pick<Item, 'id' | 'pt' | 'en'>): string {
	return item.pt ?? item.en ?? item.id;
}

/** O PNG do sprite, espelhado da API para `static/icones` no build. */
export function spritePath(icone: string): string {
	return `/icones/${icone}.png`;
}

/** "Estrela de prata". O jogo não nomeia o nível; a cor do sprite é que diz. */
export function starLabel(estrela: number): string {
	return `Estrela de ${ESTRELAS[estrela - 1] ?? estrela}`;
}

/** Para onde o nome de um item leva. Nível de qualidade não tem página própria:
 *  os três "Abóbora" são uma ficha só, e o nível é uma âncora dentro dela. */
export function itemPath(game: string, ref: Pick<Ref, 'ref_id' | 'grupo' | 'estrela'>): string {
	const ficha = `/${game}/itens/${ref.grupo ?? ref.ref_id}`;
	return ref.grupo && ref.estrela ? `${ficha}#${levelAnchor(ref.estrela)}` : ficha;
}

/** Âncora do nível dentro da ficha do grupo. */
export function levelAnchor(estrela: number | null): string {
	return `nivel-${estrela ?? 0}`;
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

/** "+24 de energia · −20 de saúde" — o que o item faz quando o jogador o usa.
 *  Negativo é perda: infusão dá energia e cobra saúde. Recurso que o jogo tem e
 *  a wiki não conhece entra com a chave crua, em vez de sumir. */
export function onUse(mapa: Record<string, number>): string {
	const conhecidos = RECURSOS.filter(([chave]) => mapa[chave]);
	const resto = Object.keys(mapa)
		.filter((chave) => mapa[chave] && !RECURSOS.some(([c]) => c === chave))
		.map((chave) => [chave, chave] as [string, string]);
	return [...conhecidos, ...resto]
		.map(([chave, nome]) => `${mapa[chave] > 0 ? '+' : '−'}${nf.format(Math.abs(mapa[chave]))} de ${nome}`)
		.join(' · ');
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
