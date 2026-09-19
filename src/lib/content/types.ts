// Modelo de conteúdo da wiki. Todo conteúdo é dado tipado, separado por jogo
// (src/lib/content/<jogo>/), e renderizado pelos componentes Lápide.

export type GameId = 'gk1' | 'gk2';

export interface Game {
	id: GameId;
	title: string;
	short: string;
	/** Frase curta para o card na página inicial. */
	blurb: string;
	/** Jogo sem conteúdo ainda: aparece como "em breve" e não gera rotas. */
	soon?: boolean;
}

export interface Ingredient {
	name: string;
	qty: number;
}

export interface Recipe {
	id: string;
	station: string;
	/** Tempo de fabricação, já com unidade: "12s", "1 min". */
	time?: string;
	ingredients: Ingredient[];
	result: Ingredient;
	/** Agrupa a receita na página de receitas. */
	category: string;
	/** Nome oficial do resultado em inglês; entra na busca. */
	en?: string;
	/** Detalhe curto no cabeçalho: pontos de tecnologia, combustível. */
	note?: string;
}

export type CalloutTone = 'nota' | 'dica' | 'perigo';

/**
 * Blocos de um artigo. Texto aceita links em markdown mínimo: [rótulo](/caminho).
 */
export type Block =
	| { type: 'p'; text: string }
	| { type: 'list'; items: string[]; ordered?: boolean }
	| { type: 'callout'; tone: CalloutTone; title?: string; text: string }
	| { type: 'recipe'; id: string }
	| { type: 'table'; head: string[]; rows: string[][]; numeric?: number[] };

export interface Section {
	heading: string;
	blocks: Block[];
}

export type BadgeTone = 'neutral' | 'moss' | 'candle' | 'blood' | 'night';

export interface Article {
	slug: string;
	title: string;
	/** Grupo da Sidebar em que o artigo aparece. */
	group: string;
	/** Resumo de uma linha para índices e meta description. */
	summary: string;
	lede: string;
	badges?: { label: string; tone: BadgeTone }[];
	infobox?: {
		subtitle?: string;
		rows: [string, string][];
	};
	sections: Section[];
}

export interface GameContent {
	game: Game;
	/** Ordem dos grupos na Sidebar. */
	groups: string[];
	articles: Article[];
	recipes: Recipe[];
}

export interface NavSection {
	title: string;
	items: { label: string; href: string }[];
}
