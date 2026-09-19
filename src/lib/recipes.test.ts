import { describe, expect, it } from 'vitest';
import type { Recipe } from './content/types';
import { filterRecipes, groupByCategory } from './recipes';

const r = (id: string, result: string, station: string, category: string, en?: string): Recipe => ({
	id,
	station,
	category,
	en,
	ingredients: [{ name: 'Lingote de ferro', qty: 1 }],
	result: { name: result, qty: 1 }
});

const data = [
	r('a', 'Pregos', 'Bigorna de madeira', 'Metal', 'Nails'),
	r('b', 'Maçã assada', 'Fogueira', 'Comida'),
	r('c', 'Peças simples de ferro', 'Bigorna de madeira', 'Metal')
];

describe('filterRecipes', () => {
	it('ignora acento e caixa', () => {
		expect(filterRecipes(data, 'MACA').map((x) => x.id)).toEqual(['b']);
	});

	it('busca pelo nome em inglês e pelo ingrediente', () => {
		expect(filterRecipes(data, 'nails').map((x) => x.id)).toEqual(['a']);
		expect(filterRecipes(data, 'lingote')).toHaveLength(3);
	});

	it('combina texto e bancada', () => {
		expect(filterRecipes(data, 'ferro', 'Fogueira').map((x) => x.id)).toEqual(['b']);
		expect(filterRecipes(data, '', 'Bigorna de madeira')).toHaveLength(2);
	});
});

describe('groupByCategory', () => {
	it('preserva a ordem de aparição', () => {
		expect(groupByCategory(data).map((g) => g.category)).toEqual(['Metal', 'Comida']);
	});
});
