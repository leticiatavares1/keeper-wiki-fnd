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
	/**
	 * Jogo cujo dado extraído do binário está na API de ../keeper-wiki-bkd.
	 * Liga as páginas de bancadas, itens e tecnologias, que são geradas no build
	 * a partir dela. Sem isso, o jogo tem só os artigos escritos à mão.
	 */
	apiData?: boolean;
}

export type CalloutTone = 'nota' | 'dica' | 'perigo';

/**
 * Blocos de um artigo. Texto aceita links em markdown mínimo: [rótulo](/caminho).
 * Um bloco `recipe` guarda o id da receita na API (`baked_apple`), e o dado dela
 * é buscado no build — a wiki não repete número de jogo à mão.
 */
export type Block =
	| { type: 'p'; text: string }
	| { type: 'list'; items: string[]; ordered?: boolean }
	| { type: 'callout'; tone: CalloutTone; title?: string; text: string }
	| { type: 'recipe'; id: string }
	| {
			type: 'table';
			head: string[];
			rows: string[][];
			numeric?: number[];
			/**
			 * Ícone antes da célula, numa coluna só (ex.: o símbolo do dia da
			 * semana). `nomes` tem um item por linha, na mesma ordem de `rows`;
			 * `null` quando a linha não tem ícone. O nome do sprite é conferido
			 * contra `/icones` no build, como qualquer outro ícone — não é dado
			 * da API, mas também não se mostra imagem quebrada.
			 */
			icones?: { coluna: number; nomes: (string | null)[] };
	  };

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
}

export interface NavSection {
	title: string;
	items: { label: string; href: string }[];
}
