/* @layer renderer-app @kind logic */
import type { TerrainSet } from '@bxel/document';

const chosenSet = (sets: readonly TerrainSet[], id: string | null): TerrainSet | undefined => sets.find((set) => set.id === id) ?? sets[0];

export { chosenSet };
