/* @layer renderer-app @kind hook */
import { tileUseCounts } from '@bxel/document';
import { useMapContext } from '../../../hooks/useMapContext';
import { useCanvasSurface } from '../../../canvas-surface/useCanvasSurface';
import type { TileHeader } from '../../../stage-header/stage-header.type';
import { useTilemapStore } from '../../../stores/useTilemapStore';

const useTileHeader = (): TileHeader | null => {
  const surface = useCanvasSurface();
  const map = useMapContext();
  const key = useTilemapStore((state) => state.editKey);
  if (surface !== 'tile') return null;
  const uses = map?.tileset && key !== null ? (tileUseCounts(map.artwork, map.tileset.id).get(key) ?? 0) : 0;
  return { key, uses };
};

export { useTileHeader };
