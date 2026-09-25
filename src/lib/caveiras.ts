/**
 * Os sprites das caveiras do painel do corpo, no necrotério e na mesa de
 * embalsamar: branca são as boas ações, vermelha os pecados. Não são ícone de
 * item — a extração os tira do HUD, pelo nome fixo.
 */
export const CAVEIRA = { branca: 'icon_hud_skull', vermelha: 'icon_skull_red' } as const;

export type Cor = keyof typeof CAVEIRA;
export type Pedaco = { texto: string } | { caveira: Cor };

const COR = /\b(branco|brancos|vermelho|vermelhos)\b/g;

/**
 * Parte o texto de um efeito ("−1 vermelho, +1 branco") nas palavras que viram
 * caveira e no que fica como texto. Texto sem cor ("Aleatório") volta inteiro.
 */
export function splitCaveiras(texto: string): Pedaco[] {
	const pedacos: Pedaco[] = [];
	let fim = 0;
	for (const m of texto.matchAll(COR)) {
		if (m.index > fim) pedacos.push({ texto: texto.slice(fim, m.index) });
		pedacos.push({ caveira: m[1].startsWith('branco') ? 'branca' : 'vermelha' });
		fim = m.index + m[0].length;
	}
	if (fim < texto.length) pedacos.push({ texto: texto.slice(fim) });
	return pedacos;
}
