import { error } from '@sveltejs/kit';
import type { RecipeCard } from '$lib/api/types';
import { availableGameIds, getContent } from '$lib/content';
import type { Article } from '$lib/content/types';
import { CAVEIRA } from '$lib/caveiras';
import { checkIcones, recipe, toCard } from '$lib/server/api';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	availableGameIds.flatMap((game) =>
		(getContent(game)?.articles ?? []).map((a) => ({ game, slug: a.slug }))
	);

/** Ícone citado numa tabela de artigo (ex.: o símbolo do dia da semana) não é
 *  dado da API, mas o PNG é: mesma regra de "não mostra imagem quebrada" dos
 *  ícones de item, bancada e tecnologia. Só chama a API quando o artigo
 *  realmente cita algum, e só quando o jogo tem dado extraído. */
async function withIconArt(article: Article, apiData?: boolean): Promise<Article> {
	if (!apiData) return article;
	let mudou = false;
	const sections = await Promise.all(
		article.sections.map(async (s) => {
			const blocks = await Promise.all(
				s.blocks.map(async (b) => {
					if (b.type !== 'table' || (!b.icones && b.caveiras === undefined)) return b;
					mudou = true;
					const tabela = { ...b };
					if (b.icones) tabela.icones = { ...b.icones, nomes: await checkIcones(b.icones.nomes) };
					// Faltando uma das duas caveiras, a coluna fica só no texto.
					if (b.caveiras !== undefined) {
						const arte = await checkIcones(Object.values(CAVEIRA));
						if (arte.includes(null)) delete tabela.caveiras;
					}
					return tabela;
				})
			);
			return { ...s, blocks };
		})
	);
	return mudou ? { ...article, sections } : article;
}

export const load: PageServerLoad = async ({ params }) => {
	const content = getContent(params.game);
	if (!content) error(404, 'Jogo não encontrado');
	const artigoBruto = content.articles.find((a) => a.slug === params.slug);
	if (!artigoBruto) error(404, 'Artigo não encontrado');
	const article = await withIconArt(artigoBruto, content.game.apiData);

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
