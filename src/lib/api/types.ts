// Espelho das respostas da API em ../keeper-wiki-bkd. Os campos ficam com o nome
// que vem no JSON, em pt-BR: o que mudar lá muda aqui. O dado sai do binário do
// jogo, extraído pelo ../reveng-graveyard-keeper — nada aqui é escrito à mão.

export interface List<T> {
	total: number;
	limite: number;
	offset: number;
	dados: T[];
}

/** Uma ponta de receita: o que entra ou o que sai. */
export interface Ref {
	ref_id: string;
	pt: string | null;
	en: string | null;
	qtd: number | null;
	/** Preenchido quando a receita devolve uma faixa, e não um valor fixo. */
	qtd_max: number | null;
	/** Fórmula do jogo, quando a quantidade não é um número. */
	qtd_expr: string | null;
	/** false quando a referência não é item do jogo (b_faith, book:book_hard…). */
	e_item: boolean;
}

export interface StationRef {
	id: string;
	pt: string | null;
	en: string | null;
}

export interface Recipe {
	id: string;
	origem: 'craft' | 'construcao';
	tipo: string | null;
	oculta: boolean;
	estacoes: StationRef[];
	entradas: Ref[];
	/** O que a bancada consome por conta própria: combustível, água. */
	entradas_da_estacao: Ref[];
	saidas: Ref[];
	/** NULL quando o jogo usa fórmula; ela fica em tempo_expr. */
	tempo_s: number | null;
	tempo_expr: string | null;
	energia: number | null;
	energia_expr: string | null;
	sanidade: number | null;
	dificuldade: number | null;
	precisa_desbloquear: boolean;
	perks: string[];
	/** Tecnologias que liberam esta receita. */
	liberada_por: string[];
	/** Pontos ganhos ao fabricar, por cor: r (vermelho), g (verde), b (azul).
	 *  O valor vem nulo em 133 receitas: o binário guarda a cor sem número. */
	pontos_tecnologia: Record<string, number | null>;
	/** Só em origem "construcao": "Put" constrói, "Remove" demole. */
	acao: string | null;
	objeto_id: string | null;
	objeto_pt: string | null;
	objeto_en: string | null;
}

/**
 * O recorte de receita que o card mostra. As páginas mandam isto para o
 * navegador — a resposta inteira da API traz campos que a tela não usa
 * (perks, dificuldade, sanidade) e a maior bancada tem 462 receitas.
 */
export type RecipeCard = Pick<
	Recipe,
	| 'id'
	| 'origem'
	| 'estacoes'
	| 'entradas'
	| 'entradas_da_estacao'
	| 'saidas'
	| 'tempo_s'
	| 'tempo_expr'
	| 'energia'
	| 'energia_expr'
	| 'precisa_desbloquear'
	| 'pontos_tecnologia'
	| 'acao'
	| 'objeto_pt'
	| 'objeto_en'
>;

export interface Item {
	id: string;
	/** NULL quando o item não tem entrada na localização oficial do jogo. */
	pt: string | null;
	en: string | null;
	descricao_pt: string | null;
	descricao_en: string | null;
	tipo: string | null;
	preco_base: number | null;
	qualidade: number | null;
	pilha: number | null;
	eficiencia: number | null;
	tem_durabilidade: boolean;
	nao_usado: boolean;
	tipos_de_produto: string[];
}

/** O recorte de item que o índice de busca manda para o navegador. */
export type ItemCard = Pick<Item, 'id' | 'pt' | 'en' | 'tipo' | 'nao_usado'>;

export interface Station {
	id: string;
	pt: string | null;
	en: string | null;
	receitas: number;
}

export interface ItemRecipes {
	produzem: Recipe[];
	consomem: Recipe[];
}

export interface TechRef {
	id: string;
	pt: string | null;
	en: string | null;
}

/** Receita liberada por uma tecnologia. `existe` é false quando o binário aponta
 *  para uma receita que não está na lista de receitas. */
export interface TechRecipe extends TechRef {
	existe: boolean;
}

export interface Tech {
	id: string;
	pt: string | null;
	en: string | null;
	ramo_n: number | null;
	ramo_pt: string | null;
	/** Custo em pontos, por cor: r (vermelho), g (verde), b (azul). */
	custo: Record<string, number>;
	oculta: boolean;
	requer_dlc: number;
	requer: TechRef[];
	libera_receitas: TechRecipe[];
	libera_perks: string[];
}

export interface ImportInfo {
	feita_em: string;
	build_do_jogo: string | null;
	fonte: string;
	itens: number;
	receitas: number;
	tecnologias: number;
}
