/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useEffect } from 'react';
import { useAssetView } from '../../../asset-view/useAssetView';
import { useGridDefaults } from '../../../asset-view/useGridDefaults';
import { unitOf } from '../../../ruler/unit-of';
import type { AppSettings } from '../../../settings.type';
import { useRulerUnitStore } from '../../../stores/useRulerUnitStore';
import { useSnapGridStore } from '../../../stores/useSnapGridStore';

const useRulerUnits = (): void => {
  const { settings, patch } = useSettings<AppSettings>();
  const { rulerUnit } = settings;
  const { view } = useAssetView();
  const defaults = useGridDefaults();
  const grid = view.tileGrid ?? defaults.tile;
  const tile = grid?.width ?? 1;
  const height = grid?.height ?? 1;
  useEffect(() => {
    useRulerUnitStore.getState().sync(unitOf(rulerUnit), tile);
  }, [rulerUnit, tile]);
  useEffect(() => {
    useSnapGridStore.getState().set({ width: tile, height });
  }, [tile, height]);
  useEffect(() => {
    useRulerUnitStore.getState().setWriter((unit) => patch({ rulerUnit: unit }));
    return () => useRulerUnitStore.getState().setWriter(null);
  }, [patch]);
};

export { useRulerUnits };
