import { describe, expect, it } from 'vitest';
import type { DlcId, ItemCard, RecipeCard, Ref, Station, Tech } from '$lib/api/types';
import { byName, byUsefulness, filterItems, filterRecipes, filterStations, filterTechs, groupBy, matchesDlc, normalize, recipeLabel } from './search';

const ref = (id: string, pt: string | null, qtd = 1): Ref => ({
	ref_id: id,
	pt,
	en: null,
	qtd,
	qtd_max: null,
	qtd_expr: null,
	e_item: true,
	e_grupo: false,
	grupo: null,
	icone: null,
	estrela: null
});

const recipe = (id: string, saida: Ref, entrada: Ref, estacao = 'Fogueira'): RecipeCard => ({
	id,
	origem: 'craft',
	estacoes: [{ id: 'e', pt: estacao, en: null, icone: null, dlc: null }],
	entradas: [entrada],
	entradas_da_estacao: [],
	saidas: [saida],
	tempo_s: 5,
	tempo_expr: null,
	energia: 10,
	energia_expr: null,
	precisa_desbloquear: false,
	pontos_tecnologia: {},
	acao: null,
	objeto_pt: null,
	objeto_en: null,
	objeto_icone: null,
	dlc: null
});

const item = (
	id: string,
	pt: string | null,
	en: string | null,
	tipo: string,
	dlc: DlcId | null = null
): ItemCard => ({
	id,
	pt,
	en,
	tipo,
	nao_usado: false,
	icone: null,
	dlc,
	niveis: 0
});

describe('normalize', () => {
	it('tira acento e caixa', () => {
		expect(normalize(' MAÇÃ ')).toBe('maca');
	});
});

describe('filterItems', () => {
	const itens = [
		item('red_apple', 'Maçã vermelha', 'Red apple', 'Comida'),
		item('nails', 'Pregos', 'Nails', 'Metal'),
		item('1h_ore_metal', null, null, 'Metal')
	];

	it('acha pelo nome em português sem acento', () => {
		expect(filterItems(itens, 'maca').map((i) => i.id)).toEqual(['red_apple']);
	});

	it('acha pelo nome em inglês e pelo id do jogo', () => {
		expect(filterItems(itens, 'nails').map((i) => i.id)).toEqual(['nails']);
		expect(filterItems(itens, 'ore_metal').map((i) => i.id)).toEqual(['1h_ore_metal']);
	});

	it('combina busca e tipo', () => {
		expect(filterItems(itens, '', 'Metal')).toHaveLength(2);
		expect(filterItems(itens, 'pregos', 'Comida')).toHaveLength(0);
	});
});

describe('filterRecipes', () => {
	const receitas = [
		recipe('baked_apple', ref('snack:baked_apple', 'Maçã assada', 5), ref('red_apple', 'Maçã vermelha', 5)),
		recipe('nails', ref('nails', 'Pregos', 5), ref('iron_ingot', 'Lingote de ferro'), 'Bigorna')
	];

	it('acha pelo que sai, pelo que entra e pela bancada', () => {
		expect(filterRecipes(receitas, 'assada').map((r) => r.id)).toEqual(['baked_apple']);
		expect(filterRecipes(receitas, 'lingote').map((r) => r.id)).toEqual(['nails']);
		expect(filterRecipes(receitas, 'bigorna').map((r) => r.id)).toEqual(['nails']);
	});

	it('sem busca devolve tudo', () => {
		expect(filterRecipes(receitas, '  ')).toHaveLength(2);
	});
});

describe('filterStations e filterTechs', () => {
	const bancadas: Station[] = [
		{
			id: 'mf_workbench_1',
			pt: 'Bancada de carpintaria',
			en: "Carpenter's Workbench",
			icone: null,
			receitas: 13,
			dlc: null
		}
	];
	const tec: Tech = {
		id: 'Advanced alchemy',
		pt: 'Alquimia avançada',
		en: 'Advanced Alchemy',
		ramo_n: 1,
		ramo_pt: 'Anatomia e alquimia',
		ramo_icone: 'i_tbranch_1',
		custo: { b: 20, g: 20 },
		oculta: false,
		requer_dlc: 0,
		dlc: null,
		requer: [],
		libera_receitas: [{ id: 'x', pt: 'Mesa de alquimia', en: null, existe: true }],
		libera_perks: []
	};

	it('acha a bancada pelo nome em inglês', () => {
		expect(filterStations(bancadas, 'carpenter')).toHaveLength(1);
	});

	it('acha a tecnologia pelo que ela libera e filtra por ramo', () => {
		expect(filterTechs([tec], 'mesa de alquimia')).toHaveLength(1);
		expect(filterTechs([tec], '', 'Anatomia e alquimia')).toHaveLength(1);
		expect(filterTechs([tec], '', 'Cozinha')).toHaveLength(0);
	});
});

describe('matchesDlc', () => {
	const itens = [
		item('pregos', 'Pregos', null, 'Metal'),
		item('cerveja_zumbi', 'Cerveja', null, 'Comida', 'breaking_dead'),
		item('queijo', 'Queijo', null, 'Comida', 'game_of_crone')
	];

	it('sem filtro, passa tudo', () => {
		expect(filterItems(itens, '', '', '')).toHaveLength(3);
	});

	it('conta Breaking Dead como jogo base', () => {
		expect(filterItems(itens, '', '', 'base').map((i) => i.id)).toEqual(['pregos', 'cerveja_zumbi']);
		expect(matchesDlc({ dlc: 'breaking_dead' }, 'breaking_dead')).toBe(false);
	});

	it('separa uma DLC só', () => {
		expect(filterItems(itens, '', '', 'game_of_crone').map((i) => i.id)).toEqual(['queijo']);
		expect(filterItems(itens, '', '', 'stranger_sins')).toHaveLength(0);
	});
});

describe('groupBy, byName e recipeLabel', () => {
	it('preserva a ordem de aparição', () => {
		const grupos = groupBy(['ab', 'ba', 'ac'], (s) => s[0]);
		expect(grupos.map((g) => g.key)).toEqual(['a', 'b']);
		expect(grupos[0].items).toEqual(['ab', 'ac']);
	});

	it('ordena com as regras do português', () => {
		expect(['Água', 'Zinco', 'Bota'].sort(byName((s) => s))).toEqual(['Água', 'Bota', 'Zinco']);
	});

	it('rotula a receita pela primeira saída', () => {
		const r = recipe('x', ref('nails', 'Pregos'), ref('iron', 'Ferro'));
		expect(recipeLabel(r)).toBe('Pregos');
		expect(recipeLabel({ ...r, saidas: [], objeto_pt: 'Cerca' })).toBe('Cerca');
	});
});

describe('byUsefulness', () => {
	const base = recipe('x', ref('a', 'Alfa'), ref('b', 'Beta'));
	const fabricar = { ...base, id: 'fab' };
	const construir = { ...base, id: 'con', origem: 'construcao' as const, acao: 'Put' };
	const demolir = { ...base, id: 'dem', origem: 'construcao' as const, acao: 'Remove' };

	it('põe fabricar antes de construir, e demolir por último', () => {
		expect([demolir, construir, fabricar].sort(byUsefulness).map((r) => r.id)).toEqual([
			'fab',
			'con',
			'dem'
		]);
	});
});
