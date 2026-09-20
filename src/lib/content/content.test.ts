import { describe, expect, it } from 'vitest';
import { linksIn } from '$lib/richtext';
import { availableGameIds, dataSlugs, getContent, navFor } from './index';
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
	// As páginas de bancada, item e tecnologia são geradas a partir da API; aqui
	// só entram as rotas fixas, que são as que um artigo pode citar.
	const routes = new Set([
		`/${id}`,
		...(content.game.apiData ? dataSlugs.map((slug) => `/${id}/${slug}`) : []),
		...content.articles.map((a) => `/${id}/${a.slug}`)
	]);

	it('não repete slug', () => {
		const slugs = content.articles.map((a) => a.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it('não usa slug reservado pelas páginas do dado do jogo', () => {
		for (const a of content.articles) expect(dataSlugs, a.slug).not.toContain(a.slug);
	});

	it('põe cada artigo num grupo conhecido', () => {
		for (const a of content.articles) expect(content.groups, a.slug).toContain(a.group);
	});

	for (const article of content.articles) {
		const blocks = article.sections.flatMap((s) => s.blocks);

		it(`${article.slug}: links internos apontam para rota que existe`, () => {
			for (const href of blocks.flatMap(texts).flatMap(linksIn)) {
				if (href.startsWith('/')) expect(routes, href).toContain(href);
			}
		});

		it(`${article.slug}: bloco de receita tem id da API`, () => {
			// O id é conferido de verdade no build, que busca a receita na API e
			// quebra se ela não existir. Aqui fica só a forma.
			for (const b of blocks) if (b.type === 'recipe') expect(b.id.trim()).toBeTruthy();
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
