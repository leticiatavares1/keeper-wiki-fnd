import type { Article } from '../types';

// Fatos conferidos na Graveyard Keeper Wiki (graveyardkeeper.fandom.com) e em guias
// de iniciante (GameRant, TheGamer, guia da Steam 2354655153). Não acrescente número sem fonte.

export const articles: Article[] = [
	{
		slug: 'primeiros-dias',
		title: 'Primeiros dias',
		group: 'Primeiros passos',
		summary: 'O que fazer primeiro, o que construir e onde arranjar dinheiro.',
		lede: 'Você acordou num cemitério que não é seu, com uma pá e nenhuma explicação. Normal.',
		badges: [{ label: 'Iniciante', tone: 'moss' }],
		infobox: {
			subtitle: 'Guia para as primeiras semanas',
			rows: [
				['Salvar', 'Só dormindo'],
				['Semana', '6 dias'],
				['Moeda', '100 cobre = 1 prata']
			]
		},
		sections: [
			{
				heading: 'Comece por aqui',
				blocks: [
					{
						type: 'p',
						text: 'O jogo quase não tem tutorial. Leia os diálogos com atenção: é por eles que as missões avançam. Muitas missões só andam uma vez por semana, no dia em que certo personagem aparece. Consulte os [dias da semana](/gk1/semana).'
					},
					{
						type: 'list',
						ordered: true,
						items: [
							'Junte madeira e pedra sempre que passar por elas. Empurre várias toras ou blocos de uma vez para casa.',
							'Construa a fornalha para fazer lingotes de ferro e pregos.',
							'Depois, o cavalete e o cortador de pedra.',
							'Em seguida, a bigorna de madeira.',
							'Adie baús e pilhas de estoque: ocupam o espaço do quintal.'
						]
					},
					{
						type: 'callout',
						tone: 'nota',
						text: 'A bigorna de madeira pede peças simples de ferro, que você ainda não sabe fazer. Compre as primeiras do ferreiro ou procure no porão.'
					}
				]
			},
			{
				heading: 'Dinheiro no começo',
				blocks: [
					{
						type: 'p',
						text: 'A moeda tem três metais: 100 cobre fazem 1 prata, e 100 prata fazem 1 ouro.'
					},
					{
						type: 'list',
						items: [
							'Enterre corpos e venda o certificado de sepultamento a Horadric, na taverna: 1 prata e 50 cobre cada. Veja [corpos e autópsia](/gk1/corpos-e-autopsia).',
							'Plante cedo. Cenoura paga as entregas de corpos, serve de comida e vende. Trigo e cânhamo viram ingredientes.',
							'Pesque.',
							'Faça um sermão todo dia de Orgulho (roxo), quando tiver a habilidade de pregador. Veja [nota do cemitério](/gk1/cemiterio).'
						]
					}
				]
			},
			{
				heading: 'Erros comuns',
				blocks: [
					{
						type: 'list',
						items: [
							'Deixar corpo esperando. Ele apodrece e perde crânios brancos.',
							'Decorar o túmulo de um corpo cheio de crânios vermelhos. Crême esse corpo.',
							'Cozinhar a carne dos corpos. Guarde: ela vende bem mais tarde.',
							'Correr atrás de pontos azuis cedo. Eles vêm com o tempo; foque em construção, teologia e ferraria.',
							'Ignorar o aviso de cansaço. Durma logo: é também o único jeito de salvar.'
						]
					},
					{
						type: 'callout',
						tone: 'dica',
						text: 'Conserte pontes e limpe entulhos no caminho. Os atalhos poupam dias de caminhada.'
					}
				]
			}
		]
	},
	{
		slug: 'energia-e-saude',
		title: 'Energia e saúde',
		group: 'Primeiros passos',
		summary: 'O que gasta energia, como recuperar e o que comer no começo.',
		lede: 'Cavar cova cansa. Quem diria.',
		infobox: {
			subtitle: 'Recursos do personagem',
			rows: [
				['Recupera', 'Comida · bebida · sono'],
				['Sem dormir', 'Sonolento após 2 noites'],
				['Ao morrer', 'Acorda na cama']
			]
		},
		sections: [
			{
				heading: 'Energia',
				blocks: [
					{
						type: 'p',
						text: 'Quase tudo gasta energia: usar ferramenta, fabricar, lutar, pescar. Andar, carregar coisas, usar o forno e fundir metal não gastam. Ferramentas melhores gastam menos.'
					},
					{
						type: 'p',
						text: 'Recupere energia comendo, bebendo ou dormindo. Se passar duas noites sem dormir, você fica sonolento e a energia cai até cerca de 20.'
					}
				]
			},
			{
				heading: 'Saúde',
				blocks: [
					{
						type: 'p',
						text: 'A saúde volta com sono, mel, poção de vida ou cerveja. Se morrer, você acorda na cama com todos os itens.'
					},
					{
						type: 'callout',
						tone: 'perigo',
						text: 'O jogo só salva quando você dorme na cama. Feche o jogo sem dormir e perde o dia.'
					}
				]
			},
			{
				heading: 'Comida para o começo',
				blocks: [
					{
						type: 'table',
						head: ['Comida', 'Como obter', 'Energia'],
						numeric: [2],
						rows: [
							['[Frutinha](/gk1/itens/fruit:berry)', 'Colha', '+5'],
							['[Maçã vermelha](/gk1/itens/fruit:apple_red_crop)', 'Colha', '+5'],
							['[Maçã assada](/gk1/itens/snack:baked_apple)', 'Fogueira', '+8'],
							['[Cogumelos assados](/gk1/itens/snack:baked_kebab_7)', 'Fogueira', '+12'],
							['[Pão](/gk1/itens/snack:bread)', 'Fabrique', '+15'],
							['[Carne cozida](/gk1/itens/meal:baked_meat)', 'Fabrique', '+18'],
							['[Sanduíche](/gk1/itens/snack:sandwich)', 'Fabrique', '+20'],
							['[Pote de chucrute](/gk1/itens/snack:bowl_sauerkraut)', 'Fabrique', '+30']
						],
						icones: {
							coluna: 0,
							nomes: [
								'i_berry',
								'i_apple_red_crop',
								'i_baked_apple',
								'i_baked_kebab_7',
								'i_bread',
								'i_baked_meat',
								'i_sandwich',
								'i_bowl_sauerkraut'
							]
						}
					},
					{ type: 'recipe', id: 'baked_apple' },
					{ type: 'recipe', id: 'baked_kebab_7' }
				]
			}
		]
	},
	{
		slug: 'semana',
		title: 'Dias da semana',
		group: 'Mecânicas',
		summary: 'Os seis dias, seus símbolos e quem aparece em cada um.',
		lede: 'A semana tem seis dias, cada um batizado com um pecado. A avareza ficou de fora.',
		badges: [{ label: 'Calendário', tone: 'night' }],
		infobox: {
			subtitle: 'Calendário do jogo',
			rows: [
				['Dias', '6'],
				['Visitantes', 'Da aurora ao anoitecer'],
				['Burro', 'Todo dia, menos Orgulho (roxo)']
			]
		},
		sections: [
			{
				heading: 'Quem aparece em cada dia',
				blocks: [
					{
						type: 'p',
						text: 'O símbolo do dia aparece no canto da tela, com um brilho de cor própria. Cada dia tem um visitante que só vem nele: chega na aurora e vai embora ao anoitecer. Os dias estão na ordem do jogo.'
					},
					{
						type: 'table',
						head: ['Dia', 'Símbolo', 'Cor', 'Quem', 'Onde'],
						rows: [
							['Orgulho', 'Sol', 'Roxo', 'Bispo', 'Igreja e cemitério'],
							['Luxúria', 'Vênus', 'Vermelho', 'Sra. Charm', 'Taverna The Dead Horse'],
							['Gula', 'Júpiter', 'Laranja', 'Mercador', 'Vila, ao sul da taverna'],
							['Inveja', 'Mercúrio', 'Verde', 'Snake', 'Porão da igreja velha'],
							['Ira', 'Marte', 'Vinho', 'Inquisidor', 'Colina da bruxa'],
							['Preguiça', 'Lua', 'Azul', 'Astrólogo', 'Farol']
						],
						// O ícone é o mesmo glifo que o HUD do jogo desenha no canto da
						// tela (HUDSinIcon.spr_back, em sharedassets2.assets — não vem
						// do balanceamento, então não passa pela extração de item).
						icones: {
							coluna: 1,
							nomes: [
								'i_hud_sin06_off',
								'i_hud_sin05_off',
								'i_hud_sin04_off',
								'i_hud_sin03_off',
								'i_hud_sin02_off',
								'i_hud_sin01_off'
							]
						}
					},
					{
						type: 'callout',
						tone: 'dica',
						text: 'Use a aba de personagens conhecidos no jogo para ver quem vem em qual dia.'
					}
				]
			},
			{
				heading: 'Sem dia fixo',
				blocks: [
					{
						type: 'list',
						items: [
							'Horadric cuida da taverna The Dead Horse e compra certificados de sepultamento.',
							'Gerry é uma caveira falante que mora no necrotério.',
							'Snake aparece toda noite no começo da história. Depois que a porta da chave é aberta, só em Inveja (verde).'
						]
					}
				]
			},
			{
				heading: 'Por que isso importa',
				blocks: [
					{
						type: 'p',
						text: 'Muitas missões só avançam falando com um visitante. Perdeu o dia, espera a semana toda. O sermão também só acontece em Orgulho (roxo). Veja [nota do cemitério](/gk1/cemiterio).'
					}
				]
			}
		]
	},
	{
		slug: 'pontos-de-tecnologia',
		title: 'Pontos de tecnologia',
		group: 'Mecânicas',
		summary: 'Vermelho, verde e azul: o que significam e como ganhar cada um.',
		lede: 'Três cores de conhecimento. A azul é a que mais faz falta.',
		infobox: {
			subtitle: 'Moeda da árvore de tecnologias',
			rows: [
				['Vermelho', 'Ofício'],
				['Verde', 'Natureza'],
				['Azul', 'Espírito'],
				['Estudo', 'Uma vez por item']
			]
		},
		sections: [
			{
				heading: 'As três cores',
				blocks: [
					{
						type: 'table',
						head: ['Cor', 'O que representa', 'Como ganhar'],
						rows: [
							['Vermelho', 'Trabalho manual', 'Minerar pedra e carvão, cortar árvores, operar máquinas'],
							['Verde', 'A natureza das coisas', 'Cortar mato, juntar madeira, plantar'],
							['Azul', 'O mundo espiritual', 'Necrotério, cemitério, escrita e alquimia']
						]
					},
					{
						type: 'p',
						text: 'Gaste os pontos na [árvore de tecnologias](/gk1/tecnologias). Uma tecnologia pode pedir mais de uma cor. Os sete ramos são anatomia e alquimia, teologia, espiritualismo, escrita de livros, agricultura e natureza, metalurgia e construção.'
					}
				]
			},
			{
				heading: 'Mesa de estudo',
				blocks: [
					{
						type: 'p',
						text: 'A mesa de estudo fica no porão da igreja e é liberada pela história. Estude qualquer item nela, uma vez por item. Item orgânico dá verde; ferro, pedra e ferramentas dão vermelho; itens do necrotério, do cemitério e da alquimia dão azul.'
					},
					{
						type: 'p',
						text: 'Estudar custa fé e ciência. A fé vem do sermão e do confessionário. A ciência vem de desmontar papel e livros na própria mesa.'
					},
					{
						type: 'table',
						head: ['Item desmontado', 'Ciência'],
						numeric: [1],
						rows: [
							['[Papel vazio](/gk1/itens/paper_clean)', '2'],
							['[Anotações](/gk1/itens/notes)', '4'],
							['[Capítulo](/gk1/itens/chapter)', '15'],
							['[Lente](/gk1/itens/lense)', '20'],
							['[Livro](/gk1/itens/book:book_hard)', '30']
						],
						icones: {
							coluna: 0,
							nomes: ['i_paper_good', 'i_note_good', 'i_chapter', 'i_lense', 'i_book_soft_2']
						}
					}
				]
			},
			{
				heading: 'Pontos azuis',
				blocks: [
					{
						type: 'list',
						items: [
							'Fabrique corda de cânhamo, tijolo de pedra polido, peças de aço ou frasco cônico: +1 azul cada.',
							'Fabrique cerca de túmulo de pedra: +5 azul e +2 vermelho.',
							'Compre livros de tecnologia do astrólogo, em Preguiça (azul): 25 pontos o comum, 50 o ótimo.',
							'Coma bolo ou torta de uva antes de estudar: +1 azul por estudo enquanto durar o efeito.'
						]
					},
					{ type: 'recipe', id: 'grave_bot_stn_1' },
					{ type: 'recipe', id: 'rope_hemp' }
				]
			}
		]
	},
	{
		slug: 'cemiterio',
		title: 'Nota do cemitério',
		group: 'Mecânicas',
		summary: 'Como túmulos e decoração mudam a nota e quanto o sermão rende.',
		lede: 'Os mortos não reclamam. Quem reclama são os vivos que vão à missa.',
		badges: [{ label: 'Renda', tone: 'candle' }],
		infobox: {
			subtitle: 'Avaliação do cemitério',
			rows: [
				['Túmulo máximo', '+12'],
				['Cova recém-aberta', '−2'],
				['Arbusto', '−1'],
				['Sermão', '3 cobre por ponto']
			]
		},
		sections: [
			{
				heading: 'O que conta',
				blocks: [
					{
						type: 'p',
						text: 'A nota soma arbustos, corpos, decoração e túmulos. Cada arbusto do início vale −1 e não volta a crescer: corte todos. Uma cova recém-aberta vale −2. Planejar um túmulo na mesa de projetos não muda nada.'
					},
					{
						type: 'p',
						text: 'Cada crânio vermelho do corpo enterrado tira 1 ponto. O túmulo nunca vale mais que o número de crânios brancos do corpo. Veja [corpos e autópsia](/gk1/corpos-e-autopsia).'
					}
				]
			},
			{
				heading: 'Decoração',
				blocks: [
					{
						type: 'p',
						text: 'No jogo base, a melhor lápide dá +7 e a melhor cerca +5: no máximo +12 por túmulo. As DLCs sobem esse teto. Decoração estragada rende menos até ser consertada.'
					},
					{
						type: 'table',
						head: ['Decoração', 'Tipo', 'Nota'],
						numeric: [2],
						rows: [
							['[Marcador de madeira](/gk1/itens/grave_top_wd_tab_1)', 'Lápide', '+1'],
							['[Cruz de madeira](/gk1/itens/grave_top_wd_cross_1)', 'Lápide', '+2'],
							['[Lápide](/gk1/itens/grave_top_stn_plate_1)', 'Lápide', '+2'],
							['[Cruz de pedra](/gk1/itens/grave_top_stn_cross_1)', 'Lápide', '+3'],
							['[Cerca de madeira de túmulo](/gk1/itens/grave_bot_wd_1)', 'Cerca', '+1'],
							['[Cerca de pedra de túmulo](/gk1/itens/grave_bot_stn_1)', 'Cerca', '+2']
						],
						icones: {
							coluna: 0,
							nomes: [
								'i_grave_top_wd_tab_1',
								'i_grave_top_wd_cross_1',
								'i_grave_top_stn_plate_1',
								'i_grave_top_stn_cross_1',
								'i_grave_bot_wd_1',
								'i_grave_bot_stn_1'
							]
						}
					},
					{ type: 'recipe', id: 'grave_top_wd_cross_1' },
					{ type: 'recipe', id: 'grave_bot_wd_1' }
				]
			},
			{
				heading: 'Melhorias do cemitério',
				blocks: [
					{
						type: 'table',
						head: ['Melhoria', 'Nota'],
						numeric: [1],
						rows: [
							['Consertar a cerca (10 pregos, 10 tábuas, 6 pedaços de pedra)', '+10'],
							['Lanterna', '+4'],
							['Canteiro de flores', '+2']
						]
					}
				]
			},
			{
				heading: 'Sermão',
				blocks: [
					{
						type: 'p',
						text: 'Fale com o bispo em Orgulho (roxo) com a nota do cemitério em 5 ou mais para ganhar a habilidade de pregador. Depois, faça o sermão todo Orgulho (roxo).'
					},
					{
						type: 'list',
						items: [
							'Um sermão bem-sucedido rende 3 cobre por ponto da nota do cemitério.',
							'Rende também 1 de fé para cada 5 pontos da nota da igreja.',
							'A nota da igreja decide o público e a chance de o sermão dar certo.'
						]
					}
				]
			}
		]
	},
	{
		slug: 'corpos-e-autopsia',
		title: 'Corpos e autópsia',
		group: 'Mecânicas',
		summary: 'Crânios brancos e vermelhos, o que tirar do corpo e o destino de cada um.',
		lede: 'Todo corpo chega com um histórico. O seu trabalho é melhorar a ficha.',
		badges: [
			{ label: 'Necrotério', tone: 'neutral' },
			{ label: 'Perecível', tone: 'blood' }
		],
		infobox: {
			subtitle: 'Do burro até a cova',
			rows: [
				['Ao chegar', '4–6 brancos · 2–4 vermelhos'],
				['Remoção', '10 energia'],
				['Certificado', '1 prata 50 cobre'],
				['Entrega', '5 cenouras']
			]
		},
		sections: [
			{
				heading: 'Entrega',
				blocks: [
					{
						type: 'p',
						text: 'O burro deixa o corpo na estrada em frente ao necrotério. Antes da caixa de cenouras, ele vem mais ou menos a cada 2 dias. Depois que a igreja reabre, pague 5 cenouras por corpo, adiantado, na caixa dele. Aí ele vem todo dia, menos em Orgulho (roxo).'
					},
					{
						type: 'p',
						text: 'As entregas param quando há mais corpos esperando do que lugares no necrotério. Cada mesa ou palete abre um lugar. Conserte o alçapão dos corpos (2 pedaços de pedra e 4 peças simples de ferro, uma vez por dentro e uma por fora) e os corpos caem direto no necrotério.'
					}
				]
			},
			{
				heading: 'Crânios',
				blocks: [
					{
						type: 'list',
						items: [
							'Crânio branco: boas ações. Quanto mais, melhor o túmulo pode ser.',
							'Crânio vermelho: pecados. Cada um tira 1 ponto do cemitério.',
							'Crânio verde: apodrecimento. A cada 10% de frescor perdido, some um crânio branco.'
						]
					},
					{
						type: 'callout',
						tone: 'perigo',
						text: 'Fora do necrotério, o corpo apodrece rápido. Conserte o alçapão dos corpos (veja Entrega) assim que puder: com ele, o corpo cai direto no necrotério e não fica perdendo frescor na estrada. Até lá, leve cada corpo para um palete, mesa de preparo ou mesa de embalsamar no mesmo dia.'
					}
				]
			},
			{
				heading: 'Mesa de preparo',
				blocks: [
					{
						type: 'p',
						text: 'Cada remoção gasta 10 de energia e precisa da tecnologia certa. De vez em quando sai um "erro do cirurgião": −1 branco e +1 vermelho.'
					},
					{
						type: 'table',
						head: ['Remova', 'Efeito', 'Tecnologia'],
						caveiras: 1,
						rows: [
							['[Sangue](/gk1/itens/blood)', '−1 vermelho, +1 branco', 'Softspares'],
							['[Gordura](/gk1/itens/fat)', '−1 vermelho, +1 branco', 'Softspares'],
							['[Carne](/gk1/itens/flesh)', '−1 branco', 'First slice'],
							['[Osso](/gk1/itens/bone)', 'Nenhum', 'Hardspares'],
							['[Pele](/gk1/itens/skin)', '+1 vermelho, −1 branco', 'Hardspares'],
							['[Caveira](/gk1/itens/skull)', '+1 vermelho', 'Hardspares'],
							// Cérebro, coração e intestinos não têm um item só: o jogo cria
							// um por combinação de crânios (brain_1_2...), sem grupo. Não
							// há uma ficha que represente a parte, então fica sem link.
							['Cérebro', 'Aleatório', 'Important parts'],
							['Coração', 'Aleatório', 'Important parts'],
							['Intestinos', 'Aleatório', 'Important parts']
						],
						icones: {
							coluna: 0,
							nomes: [
								'i_blood',
								'i_fat',
								'i_flesh',
								'i_bone',
								'i_skin',
								'i_skull',
								'i_brain',
								'i_heart',
								'i_intestine'
							]
						}
					},
					{
						type: 'p',
						text: 'Tire sangue e gordura primeiro: são as únicas remoções que só melhoram o corpo.'
					}
				]
			},
			{
				heading: 'Mesa de embalsamar',
				blocks: [
					{
						type: 'p',
						text: 'Faça as injeções na bancada da igreja. Para aplicar, ponha o corpo na mesa e a injeção na janela de trabalho: ela entra sozinha, com o tempo correndo. Cada tipo só pode ser usado uma vez por corpo. Na mesa, o corpo apodrece mais devagar; na mesa de embalsamamento II, não apodrece enquanto estiver nela.'
					},
					{
						type: 'table',
						head: ['Injeção', 'Efeito', 'Tecnologia'],
						caveiras: 1,
						rows: [
							['[Injeção de ácido](/gk1/itens/embalm_-1_-1)', '−1 vermelho, −1 branco', 'Embalming Liquids'],
							['[Injeção de lixívia](/gk1/itens/embalm_1_1)', '+1 vermelho, +1 branco', 'Embalming Liquids'],
							['[Injeção de cola](/gk1/itens/embalm_0_1)', '+1 branco', 'Embalming Liquids II'],
							['[Injeção de restauração](/gk1/itens/embalm_50)', 'Tira metade do apodrecimento', 'Embalming Liquids II'],
							['[Injeção de conservante](/gk1/itens/embalm_stop)', 'O corpo para de apodrecer de vez', 'Embalming Liquids II'],
							['[Injeção sombria](/gk1/itens/embalm_2_0)', '+2 vermelhos', 'Embalming Liquids III'],
							['[Injeção de prata](/gk1/itens/embalm_-1_1)', '−1 vermelho, +1 branco', 'Embalming Liquids III'],
							['[Injeção de ouro](/gk1/itens/embalm_-2_2)', '−2 vermelhos, +2 brancos', 'Embalming Liquids III']
						],
						icones: {
							coluna: 0,
							nomes: [
								'i_jar_yellow',
								'i_jar_blue',
								'i_jar_green_l',
								'i_jar_green_l_plus',
								'i_jar_green_l_cross',
								'i_jar_dark',
								'i_jar_pink',
								'i_jar_pink_star_gold'
							]
						}
					},
					{
						type: 'p',
						text: 'Prata e ouro só entram se o corpo tiver os crânios vermelhos que elas tiram: 1 para a prata, 2 para o ouro. A sombria não melhora nada sozinha; ela serve para abrir espaço para as duas.'
					}
				]
			},
			{
				heading: 'O melhor zumbi',
				blocks: [
					{
						type: 'p',
						text: 'A eficiência do zumbi, que é a velocidade com que ele trabalha, depende só dos crânios brancos. Os vermelhos não pesam. Então o objetivo é o máximo de brancos, e vermelho não importa.'
					},
					{
						type: 'list',
						ordered: true,
						items: [
							'Assim que o corpo chegar, aplique a injeção de conservante. A mesa de ressurreição só aceita corpo com 90% de frescor ou mais, e cada 10% perdido também tira um crânio branco. Se o frescor já caiu, use antes a de restauração.',
							'Na mesa de preparo, tire sangue e gordura. Não tire carne nem pele: as duas tiram branco quando saem.',
							'Troque cérebro, coração e intestinos por outros com mais crânios brancos.',
							'Aplique a lixívia e a cola. A lixívia vem antes porque deixa o vermelho que a prata vai gastar.',
							'Aplique a prata e depois o ouro. Se faltar vermelho, aplique a sombria antes.',
							'Não use o ácido: ele tira um branco.',
							'Leve o corpo para a mesa de ressurreição.'
						]
					},
					{
						type: 'callout',
						tone: 'dica',
						text: 'Zumbi que só vai carregar coisas não precisa de nada disso: a eficiência não muda a velocidade de transporte. Guarde as injeções para os zumbis que trabalham nas bancadas.'
					}
				]
			},
			{
				heading: 'Destino do corpo',
				blocks: [
					{
						type: 'table',
						head: ['Destino', 'Resultado'],
						rows: [
							['Enterrar', 'Certificado de sepultamento. Horadric paga 1 prata e 50 cobre.'],
							['Cremar', 'Pira com 8 tarugos de madeira: certificado, 2 sal e 5 cinzas. Melhor para corpo com crânio vermelho.'],
							['Jogar no rio', 'Sem certificado. Na primeira vez, Gerry reclama e ensina a cremação.'],
							['Mesa de ressurreição', 'Vira zumbi trabalhador. Precisa de 90% de frescor ou mais.']
						],
						// O ícone é o que sai de cada destino: a certidão, as cinzas, o
						// corpo que o rio leva e o zumbi.
						icones: { coluna: 0, nomes: ['i_scroll_2', 'i_ash', 'i_body', 'i_2h_zombie'] }
					}
				]
			}
		]
	}
];
