// Cliente da API de leitura em ../keeper-wiki-bkd.
//
// O site é estático: tudo aqui roda no build (prerender), nunca no navegador —
// daí o arquivo viver em $lib/server, que o SvelteKit proíbe importar do lado
// do cliente. Se a API estiver fora do ar o build falha, e é para falhar mesmo:
// número de jogo inventado no front é pior que build quebrado.

import { env } from '$env/dynamic/private';
import type {
	ImportInfo,
	Item,
	ItemRecipes,
	List,
	Recipe,
	RecipeCard,
	Station,
	Tech
} from '$lib/api/types';

const BASE = (env.API_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '');

/** Teto da listagem na API. */
const LIMITE = 500;

type Params = Record<string, string | number | boolean | undefined>;

function url(path: string, params: Params = {}): string {
	const u = new URL(BASE + path);
	for (const [k, v] of Object.entries(params)) if (v !== undefined) u.searchParams.set(k, String(v));
	return u.toString();
}

async function get<T>(path: string, params: Params = {}): Promise<T> {
	const alvo = url(path, params);
	let resposta: Response;
	try {
		resposta = await fetch(alvo);
	} catch (causa) {
		throw new Error(
			`A API não respondeu em ${BASE}. Suba o banco e a API antes do build:\n` +
				'  cd ../keeper-wiki-db && docker compose up -d\n' +
				'  cd ../keeper-wiki-bkd && docker compose up -d --build api',
			{ cause: causa }
		);
	}
	if (!resposta.ok) throw new Error(`A API devolveu ${resposta.status} em ${alvo}`);
	return (await resposta.json()) as T;
}

/** Percorre uma listagem paginada até o fim. */
async function getAll<T>(path: string, params: Params = {}): Promise<T[]> {
	const dados: T[] = [];
	let total = Infinity;
	while (dados.length < total) {
		const pagina = await get<List<T>>(path, { ...params, limite: LIMITE, offset: dados.length });
		total = pagina.total;
		if (pagina.dados.length === 0) break;
		dados.push(...pagina.dados);
	}
	return dados;
}

// O build gera centenas de páginas no mesmo processo. As listas que quase toda
// página precisa são buscadas uma vez só.
const memo = new Map<string, Promise<unknown>>();
function once<T>(chave: string, buscar: () => Promise<T>): Promise<T> {
	if (!memo.has(chave)) memo.set(chave, buscar());
	return memo.get(chave) as Promise<T>;
}

/** De qual extração veio o dado que está no ar. */
export function importInfo(): Promise<ImportInfo> {
	return once('meta', () => get<ImportInfo>('/meta'));
}

/** Bancadas, fornos e mesas de construção, com quantas receitas cada uma tem. */
export function stations(): Promise<Station[]> {
	return once('estacoes', () => get<Station[]>('/estacoes'));
}

/** A wiki gera página para todo item, inclusive os marcados como não usados:
 *  oito deles ainda aparecem em receita, e link quebrado derruba o prerender. */
export function items(incluirNaoUsados = false): Promise<Item[]> {
	return once(`itens:${incluirNaoUsados}`, () =>
		getAll<Item>('/itens', { incluir_nao_usados: incluirNaoUsados || undefined })
	);
}

export function techs(): Promise<Tech[]> {
	return once('tecnologias', () => getAll<Tech>('/tecnologias'));
}

/** Recorta a receita para o que o card mostra, antes de ela virar payload. */
export function toCard(r: Recipe): RecipeCard {
	return {
		id: r.id,
		origem: r.origem,
		estacoes: r.estacoes,
		entradas: r.entradas,
		entradas_da_estacao: r.entradas_da_estacao,
		saidas: r.saidas,
		tempo_s: r.tempo_s,
		tempo_expr: r.tempo_expr,
		energia: r.energia,
		energia_expr: r.energia_expr,
		precisa_desbloquear: r.precisa_desbloquear,
		pontos_tecnologia: r.pontos_tecnologia,
		acao: r.acao,
		objeto_pt: r.objeto_pt,
		objeto_en: r.objeto_en
	};
}

/** Quantas receitas o jogador vê (a lista já filtra as ocultas). */
export function recipeCount(): Promise<number> {
	return once('receitas:total', async () => (await get<List<Recipe>>('/receitas', { limite: 1 })).total);
}

export function item(id: string): Promise<Item> {
	return get<Item>(`/itens/${encodeURIComponent(id)}`);
}

export function itemRecipes(id: string): Promise<ItemRecipes> {
	return get<ItemRecipes>(`/itens/${encodeURIComponent(id)}/receitas`);
}

export function stationRecipes(estacao: string): Promise<Recipe[]> {
	return getAll<Recipe>('/receitas', { estacao });
}

export function recipe(id: string): Promise<Recipe> {
	return get<Recipe>(`/receitas/${encodeURIComponent(id)}`);
}
