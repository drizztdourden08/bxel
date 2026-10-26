/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import { tileSizeOf } from '../../../ruler/tile-size-of';
import { unitOf } from '../../../ruler/unit-of';
import type { AppSettings } from '../../../settings.type';
import { useRulerUnitStore } from '../../../stores/useRulerUnitStore';

const useRulerUnits = (): void => {
  const { settings, patch } = useSettings<AppSettings>();
  const { rulerUnit, gridTileSize } = settings;
  useEffect(() => {
    useRulerUnitStore.getState().sync(unitOf(rulerUnit), tileSizeOf(gridTileSize));
  }, [rulerUnit, gridTileSize]);
  useEffect(() => {
    useRulerUnitStore.getState().setWriter((unit) => patch({ rulerUnit: unit }));
    return () => useRulerUnitStore.getState().setWriter(null);
  }, [patch]);
};

export { useRulerUnits };
