/* @layer renderer-app @kind logic */
import type { TerrainRules } from '@bxel/document';
import type { TerrainChoice } from './terrain.type';

const terrainChoice = (rules: TerrainRules | undefined): TerrainChoice => rules?.kind ?? 'none';

export { terrainChoice };
