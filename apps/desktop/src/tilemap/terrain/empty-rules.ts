/* @layer renderer-app @kind logic */
import { TERRAIN_SLOTS } from '@bxel/document';
import type { TerrainRules } from '@bxel/document';

const emptyRules = (kind: TerrainRules['kind']): TerrainRules => ({ kind, keys: new Array<number>(TERRAIN_SLOTS[kind]).fill(0) });

export { emptyRules };
