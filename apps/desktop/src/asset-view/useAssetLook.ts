/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { CanvasLook } from '../canvas-look/canvas-look.type';
import { assetLook } from './asset-look';
import { useAssetView } from './useAssetView';
import { useGridDefaults } from './useGridDefaults';

const useAssetLook = (base: CanvasLook): CanvasLook => {
  const { view } = useAssetView();
  const { tile, source } = useGridDefaults();
  return useMemo(() => assetLook(base, view, source === 'setting' ? null : tile), [base, view, tile, source]);
};

export { useAssetLook };
