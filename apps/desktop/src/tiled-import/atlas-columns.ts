/* @layer renderer-app @kind logic */
import { ATLAS_COLUMNS } from './tiled-import.constants';

const atlasColumns = (tiles: number): number => Math.min(tiles, ATLAS_COLUMNS);

export { atlasColumns };
