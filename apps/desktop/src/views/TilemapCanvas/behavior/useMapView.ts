/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useMapContext } from '../../../hooks/useMapContext';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';
import { mapTarget } from '../../../tilemap/map-target';
import type { MapView } from '../TilemapCanvas.type';
import { mapImage } from './map-image';

const useMapView = (): MapView | null => {
  const context = useMapContext();
  const target = useMemo(() => mapTarget(context), [context]);
  const tilemap = target?.tilemap ?? null;
  const artwork = target?.artwork ?? null;
  const layerId = target?.layer.id ?? null;
  const lit = useLayerViewStore((state) => state.highlight);
  const highlight = lit ? layerId : null;
  const image = useMemo(() => (artwork && tilemap ? mapImage(artwork, tilemap, highlight) : null), [artwork, tilemap, highlight]);
  return target && image ? { target, image, highlighted: highlight !== null } : null;
};

export { useMapView };
