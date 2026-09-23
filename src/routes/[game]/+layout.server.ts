import { getContent } from '$lib/content';
import { dlcs } from '$lib/server/api';
import type { LayoutServerLoad } from './$types';

// As DLCs vêm da API, que só roda no build: daí um load de servidor, cujo
// resultado o prerender grava junto da página. O +layout.ts monta a Sidebar.
export const load: LayoutServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	return { dlcs: content?.game.apiData ? await dlcs() : [] };
};
