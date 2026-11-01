/* @layer renderer-app @kind logic */
import { useTilesetViewStore } from '../stores/useTilesetViewStore';

const hasCollisionToPaste = (): boolean => useTilesetViewStore.getState().shapeClipboard.length > 0;

export { hasCollisionToPaste };
