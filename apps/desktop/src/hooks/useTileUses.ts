/* @layer renderer-app @kind hook */
import { tileUseCounts } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useMapContext } from './useMapContext';

const useTileUses = (): number | null => {
  const map = useMapContext();
  const key = useTilemapStore((state) => state.editKey);
  if (!map?.tileset || key === null) return null;
  return tileUseCounts(map.artwork, map.tileset.id).get(key) ?? 0;
};

export { useTileUses };
