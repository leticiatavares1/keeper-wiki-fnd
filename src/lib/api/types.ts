// Espelho das respostas da API em ../keeper-wiki-bkd. Os campos ficam com o nome
// que vem no JSON, em pt-BR: o que mudar lá muda aqui. O dado sai do binário do
// jogo, extraído pelo ../reveng-graveyard-keeper — nada aqui é escrito à mão.

/** De qual DLC o registro é, pelo enum `DLCEngine.DLCVersion` do jogo. Só a
 *  tecnologia tem o campo no binário; em receita, bancada e item a API deduz
 *  (pela tecnologia que libera e pela mesa da zona da DLC). Nulo é jogo base. */
export type DlcId = 'breaking_dead' | 'stranger_sins' | 'game_of_crone' | 'better_save_soul';

/** Uma DLC, com quanto do dado do jogo é dela. */
export interface Dlc {
	id: DlcId;
	/** Posição no enum do jogo: 1 a 4. */
	n: number;
	nome: string;
	tecnologias: number;
	receitas: number;
	estacoes: number;
	itens: number;
}

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
	/** false quando a referência não é item do jogo (b_faith, money…). */
	e_item: boolean;
	/** true quando a referência é um grupo de níveis, e não um item: 164 receitas
	 *  pedem "Abóbora" (`pumpkin_crop`), não o nível 2 dela. */
	e_grupo: boolean;
	/** O grupo do item apontado, quando ele é um nível de qualidade. */
	grupo: string | null;
	/** Sprite do item; no grupo, o do nível mais baixo. Nulo quando não há arte. */
	icone: string | null;
	/** 1, 2 ou 3 — bronze, prata e ouro. Nulo no grupo e em quem não tem. */
	estrela: number | null;
}

export interface StationRef {
	id: string;
	pt: string | null;
	en: string | null;
	/** Sprite do objeto de mundo que é a bancada. Nulo na maioria: só 87 das 228
	 *  bancadas distintas têm `custom_icon` no balanceamento. */
	icone: string | null;
	dlc: DlcId | null;
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
	/** Sprite que o menu de construção mostra para este resultado — a demolição
	 *  usa o mesmo ícone da construção original. Presente em 514 das 533
	 *  receitas de construção. */
	objeto_icone: string | null;
	dlc: DlcId | null;
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
	| 'objeto_icone'
	| 'dlc'
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
	/** Nome do sprite do item. Nulo quando o jogo não tem arte com esse nome. */
	icone: string | null;
	/** Nível da estrela de qualidade: 1 bronze, 2 prata, 3 ouro. */
	estrela: number | null;
	/** Id do grupo de níveis, quando o item é um nível de qualidade de outro. */
	grupo: string | null;
	/** O jogador pode usar o item direto do inventário (`can_be_used`). */
	pode_usar: boolean;
	/** O que o item devolve ao ser usado, por recurso: `{energy: 24, hp: -20}`.
	 *  Valor negativo é perda — cogumelo venenoso tira saúde. Vazio na maioria.
	 *  Em ferramenta (`pode_usar` false) o número é o custo por golpe. */
	ao_usar: Record<string, number>;
	/** A parte do efeito que o jogo guarda como fórmula (perk, buff), crua. */
	ao_usar_expr: string[];
	dlc: DlcId | null;
}

/** Um item com níveis de qualidade: as três "Abóbora" são um grupo só.
 *  Nome, ícone e tipo saem do nível mais baixo — o que o jogador vê primeiro. */
export interface Group {
	id: string;
	pt: string | null;
	en: string | null;
	icone: string | null;
	tipo: string | null;
	nao_usado: boolean;
	/** Quantos níveis o grupo tem: 2 ou 3. */
	niveis: number;
	dlc: DlcId | null;
}

/** O grupo com os níveis dentro, na ordem em que o jogador os melhora. */
export interface GroupDetail extends Group {
	itens: Item[];
}

/** O recorte de item que o índice de busca manda para o navegador. Uma entrada
 *  por item que o jogador reconhece: o grupo entra no lugar dos seus níveis. */
export type ItemCard = Pick<Item, 'id' | 'pt' | 'en' | 'tipo' | 'nao_usado' | 'icone' | 'dlc'> & {
	/** 0 no item comum; 2 ou 3 no grupo, que vale por todos os seus níveis. */
	niveis: number;
};

export interface Station {
	id: string;
	pt: string | null;
	en: string | null;
	/** Mesmo ícone de `StationRef`; nulo na maioria das bancadas. */
	icone: string | null;
	receitas: number;
	dlc: DlcId | null;
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
	/** Ícone fixo do ramo (`"i_tbranch_" + ramo_n`, 8 valores) — não existe
	 *  ícone por tecnologia individual, só por ramo. Sempre presente. */
	ramo_icone: string;
	/** Custo em pontos, por cor: r (vermelho), g (verde), b (azul). */
	custo: Record<string, number>;
	oculta: boolean;
	requer_dlc: number;
	dlc: DlcId | null;
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
