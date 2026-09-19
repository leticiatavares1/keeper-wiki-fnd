import { availableGameIds } from '$lib/content';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => availableGameIds.map((game) => ({ game }));
