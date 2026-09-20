import type { GameContent } from '../types';
import { articles } from './articles';

const gk1: GameContent = {
	game: {
		id: 'gk1',
		title: 'Graveyard Keeper',
		short: 'Graveyard Keeper',
		blurb: 'Receitas, dicas para os primeiros dias e as mecânicas que o jogo não explica.',
		apiData: true
	},
	groups: ['Primeiros passos', 'Mecânicas'],
	articles
};

export default gk1;
