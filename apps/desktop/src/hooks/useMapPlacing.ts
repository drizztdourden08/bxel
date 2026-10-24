/* @layer renderer-app @kind hook */
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';

const useMapPlacing = (): boolean => {
  const mode = useSpriteStore((state) => state.mode);
  const editMode = useTilemapStore((state) => state.editMode);
  return mode === 'tilemap' && editMode === 'place';
};

export { useMapPlacing };
