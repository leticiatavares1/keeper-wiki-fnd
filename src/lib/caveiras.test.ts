import { describe, expect, it } from 'vitest';
import { splitCaveiras } from './caveiras';

describe('splitCaveiras', () => {
	it('troca a cor pela caveira e mantém o número', () => {
		expect(splitCaveiras('−1 vermelho, +1 branco')).toEqual([
			{ texto: '−1 ' },
			{ caveira: 'vermelha' },
			{ texto: ', +1 ' },
			{ caveira: 'branca' }
		]);
	});

	it('devolve inteiro o texto sem cor', () => {
		expect(splitCaveiras('Aleatório')).toEqual([{ texto: 'Aleatório' }]);
	});

	it('aceita o plural', () => {
		expect(splitCaveiras('+2 brancos')).toEqual([{ texto: '+2 ' }, { caveira: 'branca' }]);
	});

	it('não pega a cor dentro de outra palavra', () => {
		expect(splitCaveiras('Avermelhado')).toEqual([{ texto: 'Avermelhado' }]);
	});
});
