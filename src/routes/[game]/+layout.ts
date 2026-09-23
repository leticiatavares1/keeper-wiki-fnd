import { error } from '@sveltejs/kit';
import { getContent, navFor } from '$lib/content';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = ({ params, data }) => {
	const content = getContent(params.game);
	if (!content) error(404, 'Jogo não encontrado');
	return { ...data, content, nav: navFor(content, data.dlcs) };
};
