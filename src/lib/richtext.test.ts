import { describe, expect, it } from 'vitest';
import { linksIn, parseRichText } from './richtext';

describe('parseRichText', () => {
	it('mantém texto sem link', () => {
		expect(parseRichText('Só texto.')).toEqual([{ text: 'Só texto.' }]);
	});

	it('separa links do texto em volta', () => {
		expect(parseRichText('Veja [dias](/gk1/semana) e [cemitério](/gk1/cemiterio).')).toEqual([
			{ text: 'Veja ' },
			{ text: 'dias', href: '/gk1/semana' },
			{ text: ' e ' },
			{ text: 'cemitério', href: '/gk1/cemiterio' },
			{ text: '.' }
		]);
	});

	it('lista os destinos', () => {
		expect(linksIn('[a](/x) texto [b](/y)')).toEqual(['/x', '/y']);
	});
});
