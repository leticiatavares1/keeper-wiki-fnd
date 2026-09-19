import { error } from '@sveltejs/kit';
import { availableGameIds, getContent } from '$lib/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	availableGameIds.flatMap((game) =>
		(getContent(game)?.articles ?? []).map((a) => ({ game, slug: a.slug }))
	);

export const load: PageLoad = async ({ params, parent }) => {
	const { content } = await parent();
	const article = content.articles.find((a) => a.slug === params.slug);
	if (!article) error(404, 'Artigo não encontrado');
	return { article };
};
