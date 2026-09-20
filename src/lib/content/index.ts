import gk1 from './gk1';
import type { Game, GameContent, NavSection } from './types';

const gk2: Game = {
	id: 'gk2',
	title: 'Graveyard Keeper 2',
	short: 'GK2',
	blurb: 'Lança em 22 de setembro de 2026. A wiki abre depois do lançamento.',
	soon: true
};

/** Registro de jogos. Para ativar um jogo, crie src/lib/content/<id>/ e registre aqui. */
const contents: GameContent[] = [gk1];

export const games: Game[] = [gk1.game, gk2];

export function getContent(id: string): GameContent | undefined {
	return contents.find((c) => c.game.id === id);
}

export const availableGameIds = contents.map((c) => c.game.id);

/** Jogos cujo dado extraído está na API: só eles ganham bancadas, itens e tecnologias. */
export const gameIdsWithData = contents.filter((c) => c.game.apiData).map((c) => c.game.id);

export function gamePath(content: GameContent, slug?: string): string {
	return slug ? `/${content.game.id}/${slug}` : `/${content.game.id}`;
}

/** Rotas geradas a partir da API. Nenhum artigo pode usar esses slugs. */
export const dataSlugs = ['receitas', 'itens', 'tecnologias'] as const;

/** Sidebar do jogo: início, páginas do dado do jogo e artigos por grupo. */
export function navFor(content: GameContent): NavSection[] {
	const base = gamePath(content);
	const dados = content.game.apiData
		? [
				{ label: 'Receitas', href: `${base}/receitas` },
				{ label: 'Itens', href: `${base}/itens` },
				{ label: 'Tecnologias', href: `${base}/tecnologias` }
			]
		: [];
	return [
		{
			title: content.game.short,
			items: [{ label: 'Início', href: base }, ...dados]
		},
		...content.groups.map((group) => ({
			title: group,
			items: content.articles
				.filter((a) => a.group === group)
				.map((a) => ({ label: a.title, href: gamePath(content, a.slug) }))
		}))
	];
}
