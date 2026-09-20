import { error } from '@sveltejs/kit';
import type { RecipeCard } from '$lib/api/types';
import { availableGameIds, getContent } from '$lib/content';
import { recipe, toCard } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	availableGameIds.flatMap((game) =>
		(getContent(game)?.articles ?? []).map((a) => ({ game, slug: a.slug }))
	);

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content) error(404, 'Jogo não encontrado');
	const article = content.articles.find((a) => a.slug === params.slug);
	if (!article) error(404, 'Artigo não encontrado');

	// As receitas citadas no artigo vêm da API no build. Id que não existe
	// derruba o build de propósito: é erro de conteúdo, não de servidor.
	const ids = [
		...new Set(
			article.sections
				.flatMap((s) => s.blocks)
				.filter((b) => b.type === 'recipe')
				.map((b) => b.id)
		)
	];
	const receitas = await Promise.all(ids.map(async (id) => [id, toCard(await recipe(id))] as const));

	return { article, recipes: Object.fromEntries(receitas) as Record<string, RecipeCard> };
};
