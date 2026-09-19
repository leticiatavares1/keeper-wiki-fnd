import { describe, expect, it } from 'vitest';
import { linksIn } from '$lib/richtext';
import { availableGameIds, getContent, navFor } from './index';
import type { Block } from './types';

function texts(block: Block): string[] {
	switch (block.type) {
		case 'p':
		case 'callout':
			return [block.text];
		case 'list':
			return block.items;
		case 'table':
			return block.rows.flat();
		default:
			return [];
	}
}

describe.each(availableGameIds)('conteúdo de %s', (id) => {
	const content = getContent(id)!;
	const routes = new Set([
		`/${id}`,
		`/${id}/receitas`,
		...content.articles.map((a) => `/${id}/${a.slug}`)
	]);
	const recipeIds = new Set(content.recipes.map((r) => r.id));

	it('não repete slug nem id de receita', () => {
		expect(routes.size).toBe(content.articles.length + 2);
		expect(recipeIds.size).toBe(content.recipes.length);
	});

	it('põe cada artigo num grupo conhecido', () => {
		for (const a of content.articles) expect(content.groups, a.slug).toContain(a.group);
	});

	for (const article of content.articles) {
		const blocks = article.sections.flatMap((s) => s.blocks);

		it(`${article.slug}: links internos e receitas existem`, () => {
			for (const href of blocks.flatMap(texts).flatMap(linksIn)) {
				if (href.startsWith('/')) expect(routes, href).toContain(href);
			}
			for (const b of blocks) if (b.type === 'recipe') expect(recipeIds, b.id).toContain(b.id);
		});

		it(`${article.slug}: no máximo dois callouts e três selos`, () => {
			expect(blocks.filter((b) => b.type === 'callout').length).toBeLessThanOrEqual(2);
			expect(article.badges?.length ?? 0).toBeLessThanOrEqual(3);
		});
	}

	it('sidebar com até seis itens por seção', () => {
		for (const s of navFor(content)) expect(s.items.length, s.title).toBeLessThanOrEqual(6);
	});
});
