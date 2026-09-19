import type { GameContent } from '../types';
import { articles } from './articles';
import { recipes } from './recipes';

const gk1: GameContent = {
	game: {
		id: 'gk1',
		title: 'Graveyard Keeper',
		short: 'Graveyard Keeper',
		blurb: 'Receitas, dicas para os primeiros dias e as mecânicas que o jogo não explica.'
	},
	groups: ['Primeiros passos', 'Mecânicas'],
	articles,
	recipes
};

export default gk1;
