/* @layer renderer-app @kind logic */
import type { TileDataPatch } from './set-tile-data.type';

const heldTileData: { patch: TileDataPatch | null } = { patch: null };

export { heldTileData };
