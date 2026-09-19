import type { Recipe } from '../types';

// Receitas conferidas na Graveyard Keeper Wiki (graveyardkeeper.fandom.com), página de cada item.
// Nomes em português são tradução desta wiki; `en` guarda o nome oficial em inglês para a busca.
// `note` aparece no cabeçalho da receita (pontos de tecnologia, combustível, energia).

export const recipes: Recipe[] = [
	// Madeira
	{
		id: 'ripa-cavalete',
		category: 'Madeira',
		station: 'Cavalete',
		en: 'Flitch',
		ingredients: [{ name: 'Tora', qty: 1 }],
		result: { name: 'Ripa', qty: 6 }
	},
	{
		id: 'ripa-serra',
		category: 'Madeira',
		station: 'Serra circular',
		en: 'Flitch',
		ingredients: [{ name: 'Tora', qty: 1 }],
		result: { name: 'Ripa', qty: 7 }
	},
	{
		id: 'tarugo-cavalete',
		category: 'Madeira',
		station: 'Cavalete',
		en: 'Wood billet',
		ingredients: [{ name: 'Tora', qty: 1 }],
		result: { name: 'Tarugo de madeira', qty: 4 }
	},
	{
		id: 'tabua-bancada',
		category: 'Madeira',
		station: 'Bancada de carpinteiro',
		en: 'Wooden plank',
		ingredients: [{ name: 'Ripa', qty: 1 }],
		result: { name: 'Tábua de madeira', qty: 1 }
	},
	{
		id: 'tabua-serra',
		category: 'Madeira',
		station: 'Serra circular',
		en: 'Wooden plank',
		ingredients: [{ name: 'Tora', qty: 1 }],
		result: { name: 'Tábua de madeira', qty: 3 }
	},
	{
		id: 'viga',
		category: 'Madeira',
		station: 'Serra circular',
		en: 'Wooden beam',
		note: '+5 vermelho',
		ingredients: [
			{ name: 'Tora', qty: 1 },
			{ name: 'Peças complexas de ferro', qty: 1 }
		],
		result: { name: 'Viga de madeira', qty: 3 }
	},
	{
		id: 'lenha',
		category: 'Madeira',
		station: 'Cepo de lenha',
		en: 'Firewood',
		ingredients: [{ name: 'Tarugo de madeira', qty: 1 }],
		result: { name: 'Lenha', qty: 15 }
	},

	// Metal
	{
		id: 'lingote-minerio',
		category: 'Metal',
		station: 'Fornalha',
		en: 'Iron ingot',
		note: '25 de combustível',
		ingredients: [{ name: 'Minério de ferro', qty: 1 }],
		result: { name: 'Lingote de ferro', qty: 1 }
	},
	{
		id: 'lingote-sucata',
		category: 'Metal',
		station: 'Fornalha',
		en: 'Iron ingot',
		ingredients: [{ name: 'Sucata de metal', qty: 10 }],
		result: { name: 'Lingote de ferro', qty: 1 }
	},
	{
		id: 'pregos',
		category: 'Metal',
		station: 'Bigorna de madeira',
		en: 'Nails',
		ingredients: [{ name: 'Lingote de ferro', qty: 1 }],
		result: { name: 'Pregos', qty: 8 }
	},
	{
		id: 'pecas-simples',
		category: 'Metal',
		station: 'Bigorna de madeira',
		en: 'Simple iron parts',
		ingredients: [{ name: 'Lingote de ferro', qty: 1 }],
		result: { name: 'Peças simples de ferro', qty: 4 }
	},

	// Pedra
	{
		id: 'pedaco-de-pedra',
		category: 'Pedra',
		station: 'Cortador de pedra',
		en: 'A piece of stone',
		ingredients: [{ name: 'Bloco de pedra', qty: 1 }],
		result: { name: 'Pedaço de pedra', qty: 6 }
	},
	{
		id: 'tijolo-polido',
		category: 'Pedra',
		station: 'Cortador de pedra',
		en: 'A polished brick of stone',
		note: '+1 azul',
		ingredients: [
			{ name: 'Pedaço de pedra', qty: 1 },
			{ name: 'Pasta de polir', qty: 1 }
		],
		result: { name: 'Tijolo de pedra polido', qty: 1 }
	},

	// Túmulos
	{
		id: 'marco-de-madeira',
		category: 'Túmulos',
		station: 'Bancada de carpinteiro',
		en: 'Wooden marker',
		note: '+3 vermelho',
		ingredients: [
			{ name: 'Ripa', qty: 2 },
			{ name: 'Pregos', qty: 1 }
		],
		result: { name: 'Marco de madeira', qty: 1 }
	},
	{
		id: 'cruz-de-madeira',
		category: 'Túmulos',
		station: 'Bancada de carpinteiro',
		en: 'Wooden cross',
		note: '+5 vermelho',
		ingredients: [
			{ name: 'Tábua de madeira', qty: 1 },
			{ name: 'Pregos', qty: 1 }
		],
		result: { name: 'Cruz de madeira', qty: 1 }
	},
	{
		id: 'cerca-de-madeira',
		category: 'Túmulos',
		station: 'Bancada de carpinteiro',
		en: 'Wooden grave fence',
		note: '+2 vermelho',
		ingredients: [{ name: 'Tábua de madeira', qty: 1 }],
		result: { name: 'Cerca de túmulo de madeira', qty: 1 }
	},
	{
		id: 'lapide',
		category: 'Túmulos',
		station: 'Cortador de pedra',
		en: 'Gravestone',
		note: '+5 vermelho',
		ingredients: [{ name: 'Pedaço de pedra', qty: 2 }],
		result: { name: 'Lápide', qty: 1 }
	},
	{
		id: 'cerca-de-pedra',
		category: 'Túmulos',
		station: 'Cortador de pedra',
		en: 'Stone grave fence',
		note: '+2 vermelho · +5 azul',
		ingredients: [{ name: 'Pedaço de pedra', qty: 2 }],
		result: { name: 'Cerca de túmulo de pedra', qty: 1 }
	},

	// Igreja e escrita
	{
		id: 'corda-de-canhamo',
		category: 'Igreja e escrita',
		station: 'Bancada da igreja',
		en: 'Hemp rope',
		note: '+1 azul',
		ingredients: [{ name: 'Cânhamo', qty: 4 }],
		result: { name: 'Corda de cânhamo', qty: 5 }
	},
	{
		id: 'papel-de-pele',
		category: 'Igreja e escrita',
		station: 'Bancada da igreja',
		en: 'Pigskin paper',
		ingredients: [{ name: 'Pele', qty: 1 }],
		result: { name: 'Papel de pele de porco', qty: 4 }
	},
	{
		id: 'papel-limpo',
		category: 'Igreja e escrita',
		station: 'Bancada da igreja',
		en: 'Clean paper',
		ingredients: [{ name: 'Papel de pele de porco', qty: 1 }],
		result: { name: 'Papel limpo', qty: 4 }
	},
	{
		id: 'tinta',
		category: 'Igreja e escrita',
		station: 'Bancada da igreja',
		en: 'Ink',
		ingredients: [
			{ name: 'Tinta preta', qty: 1 },
			{ name: 'Frasco cônico', qty: 1 },
			{ name: 'Água', qty: 1 }
		],
		result: { name: 'Tinta de escrever', qty: 5 }
	},
	{
		id: 'vela',
		category: 'Igreja e escrita',
		station: 'Bancada da igreja',
		en: 'Candle',
		ingredients: [
			{ name: 'Gordura', qty: 2 },
			{ name: 'Cera de abelha', qty: 2 },
			{ name: 'Corda de cânhamo', qty: 1 }
		],
		result: { name: 'Vela', qty: 4 }
	},

	// Comida
	{
		id: 'maca-assada',
		category: 'Comida',
		station: 'Fogueira',
		en: 'Baked apple',
		ingredients: [{ name: 'Maçã vermelha', qty: 5 }],
		result: { name: 'Maçã assada', qty: 5 }
	},
	{
		id: 'cogumelos-assados',
		category: 'Comida',
		station: 'Fogueira',
		en: 'Baked mushrooms',
		ingredients: [{ name: 'Cogumelo comestível', qty: 5 }],
		result: { name: 'Cogumelos assados', qty: 3 }
	}
];
