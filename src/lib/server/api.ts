// Cliente da API de leitura em ../keeper-wiki-bkd.
//
// O site é estático: tudo aqui roda no build (prerender), nunca no navegador —
// daí o arquivo viver em $lib/server, que o SvelteKit proíbe importar do lado
// do cliente. Se a API estiver fora do ar o build falha, e é para falhar mesmo:
// número de jogo inventado no front é pior que build quebrado.

import { env } from '$env/dynamic/private';
import type {
	Group,
	GroupDetail,
	ImportInfo,
	Item,
	ItemRecipes,
	List,
	Recipe,
	RecipeCard,
	Ref,
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

// ── Arte ────────────────────────────────────────────────────────────────────
// O nome do sprite vem do jogo; o PNG, da API. Nem todo nome tem arte: 127
// itens fora de uso e 4 em uso (Hidromel, Pulmões) não têm sprite com o nome
// que o jogo monta — no jogo também não têm. O ícone desses é apagado aqui,
// uma vez só, para a tela mostrar o vazio em vez de uma imagem quebrada.

/** Nomes de ícone que a API tem para servir. */
function art(): Promise<Set<string>> {
	return once('icones', async () => new Set((await get<List<string>>('/icones')).dados));
}

function withArt<T extends { icone: string | null }>(alvo: T, arte: Set<string>): T {
	return alvo.icone && arte.has(alvo.icone) ? alvo : { ...alvo, icone: null };
}

/** Mesma checagem, para ícone citado em artigo escrito à mão (não vem da API,
 *  mas o PNG sim: continua valendo "não mostra imagem quebrada"). */
export async function checkIcones(nomes: (string | null)[]): Promise<(string | null)[]> {
	const arte = await art();
	return nomes.map((n) => (n && arte.has(n) ? n : null));
}

async function itemArt<T extends { icone: string | null }>(alvo: T): Promise<T> {
	return withArt(alvo, await art());
}

/** Mesma limpeza nas pontas de uma receita: entradas, saídas, estações e o
 *  objeto de construção. `ramo_icone` de tecnologia não passa por aqui — são
 *  8 sprites fixos (`i_tbranch_1..8`), não um nome extraído por instância, e
 *  os oito já foram conferidos contra `resources.assets`. */
async function recipeArt(r: Recipe): Promise<Recipe> {
	const arte = await art();
	const refs = (lista: Ref[]) => lista.map((ref) => withArt(ref, arte));
	return {
		...r,
		entradas: refs(r.entradas),
		entradas_da_estacao: refs(r.entradas_da_estacao),
		saidas: refs(r.saidas),
		estacoes: r.estacoes.map((e) => withArt(e, arte)),
		objeto_icone: r.objeto_icone && arte.has(r.objeto_icone) ? r.objeto_icone : null
	};
}

/** De qual extração veio o dado que está no ar. */
export function importInfo(): Promise<ImportInfo> {
	return once('meta', () => get<ImportInfo>('/meta'));
}

/** Bancadas, fornos e mesas de construção, com quantas receitas cada uma tem. */
export function stations(): Promise<Station[]> {
	return once('estacoes', async () => {
		const todas = await get<Station[]>('/estacoes');
		const arte = await art();
		return todas.map((e) => withArt(e, arte));
	});
}

/** A wiki gera página para todo item, inclusive os marcados como não usados:
 *  oito deles ainda aparecem em receita, e link quebrado derruba o prerender. */
export function items(incluirNaoUsados = false): Promise<Item[]> {
	return once(`itens:${incluirNaoUsados}`, async () => {
		const todos = await getAll<Item>('/itens', {
			incluir_nao_usados: incluirNaoUsados || undefined
		});
		const arte = await art();
		return todos.map((i) => withArt(i, arte));
	});
}

/** Os 83 itens que existem em mais de um nível de qualidade. A listagem de
 *  itens mostra o grupo no lugar dos níveis: "Abóbora" uma vez, não três. */
export function groups(incluirNaoUsados = false): Promise<Group[]> {
	return once(`grupos:${incluirNaoUsados}`, async () => {
		const todos = await getAll<Group>('/grupos', {
			incluir_nao_usados: incluirNaoUsados || undefined
		});
		const arte = await art();
		return todos.map((g) => withArt(g, arte));
	});
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
		objeto_en: r.objeto_en,
		objeto_icone: r.objeto_icone
	};
}

/** Quantas receitas o jogador vê (a lista já filtra as ocultas). */
export function recipeCount(): Promise<number> {
	return once('receitas:total', async () => (await get<List<Recipe>>('/receitas', { limite: 1 })).total);
}

export async function item(id: string): Promise<Item> {
	return itemArt(await get<Item>(`/itens/${encodeURIComponent(id)}`));
}

export async function group(id: string): Promise<GroupDetail> {
	const g = await get<GroupDetail>(`/grupos/${encodeURIComponent(id)}`);
	const arte = await art();
	return { ...withArt(g, arte), itens: g.itens.map((i) => withArt(i, arte)) };
}

export async function itemRecipes(id: string): Promise<ItemRecipes> {
	return recipesArt(await get<ItemRecipes>(`/itens/${encodeURIComponent(id)}/receitas`));
}

/** As receitas do grupo inteiro: as que pedem um nível e as que pedem o grupo. */
export async function groupRecipes(id: string): Promise<ItemRecipes> {
	return recipesArt(await get<ItemRecipes>(`/grupos/${encodeURIComponent(id)}/receitas`));
}

async function recipesArt(r: ItemRecipes): Promise<ItemRecipes> {
	return {
		produzem: await Promise.all(r.produzem.map(recipeArt)),
		consomem: await Promise.all(r.consomem.map(recipeArt))
	};
}

export async function stationRecipes(estacao: string): Promise<Recipe[]> {
	return Promise.all((await getAll<Recipe>('/receitas', { estacao })).map(recipeArt));
}

export async function recipe(id: string): Promise<Recipe> {
	return recipeArt(await get<Recipe>(`/receitas/${encodeURIComponent(id)}`));
}
