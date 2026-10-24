/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useMapContext } from '../../../hooks/useMapContext';
import { mapTarget } from '../../../tilemap/map-target';
import type { MapView } from '../TilemapCanvas.type';
import { mapImage } from './map-image';

const useMapView = (): MapView | null => {
  const context = useMapContext();
  const target = useMemo(() => mapTarget(context), [context]);
  const tilemap = target?.tilemap ?? null;
  const artwork = target?.artwork ?? null;
  const image = useMemo(() => (artwork && tilemap ? mapImage(artwork, tilemap) : null), [artwork, tilemap]);
  return target && image ? { target, image } : null;
};

export { useMapView };
