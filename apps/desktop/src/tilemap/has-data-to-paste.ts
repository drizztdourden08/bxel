/* @layer renderer-app @kind logic */
import { heldTileData } from './held-tile-data';

const hasDataToPaste = (): boolean => heldTileData.patch !== null;

export { hasDataToPaste };
