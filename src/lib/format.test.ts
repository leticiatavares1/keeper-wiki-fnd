import { describe, expect, it } from 'vitest';
import type { Ref } from '$lib/api/types';
import { itemPath, levelAnchor, onUse, spritePath, starLabel } from './format';

const ref = (campos: Partial<Ref>): Ref => ({
	ref_id: 'pumpkin_crop',
	pt: 'Abóbora',
	en: 'Pumpkin',
	qtd: 1,
	qtd_max: null,
	qtd_expr: null,
	e_item: true,
	e_grupo: false,
	grupo: null,
	icone: 'i_pumpkin_crop',
	estrela: null,
	...campos
});

describe('spritePath', () => {
	it('aponta para a pasta espelhada no build', () => {
		expect(spritePath('i_nails')).toBe('/icones/i_nails.png');
		expect(spritePath('item_star_2')).toBe('/icones/item_star_2.png');
	});
});

describe('starLabel', () => {
	it('dá nome às três estrelas do jogo', () => {
		expect(starLabel(1)).toBe('Estrela de bronze');
		expect(starLabel(2)).toBe('Estrela de prata');
		expect(starLabel(3)).toBe('Estrela de ouro');
	});
});

describe('itemPath', () => {
	it('leva o item comum para a ficha dele', () => {
		expect(itemPath('gk1', ref({ ref_id: 'nails', grupo: null }))).toBe('/gk1/itens/nails');
	});

	it('leva o nível de qualidade para a âncora dele na ficha do grupo', () => {
		const nivel = ref({ ref_id: 'pumpkin_crop:2', grupo: 'pumpkin_crop', estrela: 2 });
		expect(itemPath('gk1', nivel)).toBe('/gk1/itens/pumpkin_crop#nivel-2');
	});

	it('leva o grupo para a própria ficha, sem âncora', () => {
		const grupo = ref({ ref_id: 'pumpkin_crop', e_item: false, e_grupo: true });
		expect(itemPath('gk1', grupo)).toBe('/gk1/itens/pumpkin_crop');
	});

	it('não inventa âncora para o nível sem estrela', () => {
		// `hamp_crop:1..3` tem nível, mas o jogo não desenha estrela neles.
		const nivel = ref({ ref_id: 'hamp_crop:2', grupo: 'hamp_crop', estrela: null });
		expect(itemPath('gk1', nivel)).toBe('/gk1/itens/hamp_crop');
	});
});

describe('onUse', () => {
	it('escreve o que o item devolve, com o sinal', () => {
		expect(onUse({ energy: 24 })).toBe('+24 de energia');
	});

	it('trata perda como perda: infusão dá energia e cobra saúde', () => {
		expect(onUse({ energy: 80, hp: -20 })).toBe('+80 de energia · −20 de saúde');
	});

	it('põe energia antes de saúde, na ordem da ficha', () => {
		expect(onUse({ hp: -5, energy: 10 })).toBe('+10 de energia · −5 de saúde');
	});

	it('não mostra recurso zerado nem inventa texto para item sem efeito', () => {
		expect(onUse({ energy: 0 })).toBe('');
		expect(onUse({})).toBe('');
	});

	it('mostra a chave crua do recurso que a wiki ainda não conhece', () => {
		expect(onUse({ sanity: 3 })).toBe('+3 de sanity');
	});
});

describe('levelAnchor', () => {
	it('nomeia a linha do nível na tabela da ficha', () => {
		expect(levelAnchor(3)).toBe('nivel-3');
		expect(levelAnchor(null)).toBe('nivel-0');
	});
});
