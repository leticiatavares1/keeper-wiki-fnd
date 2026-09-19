export type Segment = { text: string; href?: string };

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Quebra texto com links no formato [rótulo](/caminho) em segmentos. */
export function parseRichText(input: string): Segment[] {
	const out: Segment[] = [];
	let last = 0;
	for (const m of input.matchAll(LINK)) {
		if (m.index > last) out.push({ text: input.slice(last, m.index) });
		out.push({ text: m[1], href: m[2] });
		last = m.index + m[0].length;
	}
	if (last < input.length) out.push({ text: input.slice(last) });
	return out;
}

/** Todos os destinos de link de um texto. */
export function linksIn(input: string): string[] {
	return [...input.matchAll(LINK)].map((m) => m[2]);
}
