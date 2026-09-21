// Traz os PNG dos ícones da API para dentro do site.
//
// O site é estático: nada aqui fala com a API em runtime. Este script roda
// ANTES do `dev` e do `build` (ver `predev`/`prebuild` no package.json), baixa
// o que a API tem em `/icones` e deixa tudo em `static/icones/`, que o
// SvelteKit copia para `build/` como qualquer outro arquivo estático.
//
// A pasta fica fora do git: arte é asset do jogo, e quem a mantém é o
// ../reveng-graveyard-keeper, que a extrai do binário a cada build do jogo.

import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = (process.env.API_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '');
const DESTINO = 'static/icones';
/** Localhost aguenta bem; o limite é só para não abrir 700 sockets de uma vez. */
const EM_PARALELO = 16;

async function lista() {
	let resposta;
	try {
		resposta = await fetch(`${BASE}/icones`);
	} catch (causa) {
		throw new Error(
			`A API não respondeu em ${BASE}. Suba o banco e a API antes:\n` +
				'  cd ../keeper-wiki-db && docker compose up -d\n' +
				'  cd ../keeper-wiki-bkd && docker compose up -d --build api',
			{ cause: causa }
		);
	}
	if (!resposta.ok) throw new Error(`A API devolveu ${resposta.status} em ${BASE}/icones`);
	return (await resposta.json()).dados;
}

async function baixa(nome) {
	const resposta = await fetch(`${BASE}/icones/${nome}.png`);
	if (!resposta.ok) throw new Error(`${nome}.png: a API devolveu ${resposta.status}`);
	await writeFile(join(DESTINO, `${nome}.png`), Buffer.from(await resposta.arrayBuffer()));
}

/** Roda `tarefa` em cada item, com no máximo `EM_PARALELO` ao mesmo tempo. */
async function emLotes(itens, tarefa) {
	const fila = [...itens];
	const trabalhadores = Array.from({ length: Math.min(EM_PARALELO, fila.length) }, async () => {
		for (let nome = fila.pop(); nome !== undefined; nome = fila.pop()) await tarefa(nome);
	});
	await Promise.all(trabalhadores);
}

const nomes = await lista();
await mkdir(DESTINO, { recursive: true });

// Sprite que sumiu de um build do jogo para o outro não pode ficar para trás:
// a tela mostraria arte que o jogo não tem mais.
const tinha = (await readdir(DESTINO)).filter((f) => f.endsWith('.png'));
const querem = new Set(nomes.map((n) => `${n}.png`));
const sobrando = tinha.filter((f) => !querem.has(f));
await Promise.all(sobrando.map((f) => rm(join(DESTINO, f))));

await emLotes(nomes, baixa);

console.log(
	`${DESTINO}: ${nomes.length} ícones${sobrando.length ? `, ${sobrando.length} removidos` : ''}`
);
