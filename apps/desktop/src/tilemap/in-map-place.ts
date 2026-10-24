/* @layer renderer-app @kind logic */
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';

const inMapPlace = (): boolean => useSpriteStore.getState().mode === 'tilemap' && useTilemapStore.getState().editMode === 'place';

export { inMapPlace };
