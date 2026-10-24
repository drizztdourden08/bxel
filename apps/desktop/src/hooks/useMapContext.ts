/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { resolveMap } from '../tilemap/resolve-map';
import type { MapContext } from '../tilemap/tilemap.type';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useActiveDocument } from './useActiveDocument';

const useMapContext = (): MapContext | null => {
  const artwork = useActiveDocument()?.state.artwork ?? null;
  const tilesetId = useTilemapStore((state) => state.tilesetId);
  const mapId = useTilemapStore((state) => state.mapId);
  const layerId = useTilemapStore((state) => state.layerId);
  return useMemo(() => (artwork ? resolveMap(artwork, { tilesetId, mapId, layerId }) : null), [artwork, tilesetId, mapId, layerId]);
};

export { useMapContext };
