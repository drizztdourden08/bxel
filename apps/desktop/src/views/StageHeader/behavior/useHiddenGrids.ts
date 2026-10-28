/* @layer renderer-app @kind hook */
import { useAssetLook } from '../../../asset-view/useAssetLook';
import { gridsHidden } from '../../../canvas-look/grids-hidden';
import { useCanvasLook } from '../../../canvas-look/useCanvasLook';
import { useCanvasSurface } from '../../../canvas-surface/useCanvasSurface';
import { useViewFeedStore } from '../../../stores/useViewFeedStore';
import { useViewStore } from '../../../stores/useViewStore';

const useHiddenGrids = (): boolean => {
  const surface = useCanvasSurface();
  const pixel = useViewStore((state) => state.grid);
  const major = useViewStore((state) => state.gridMajor);
  const tile = useViewStore((state) => state.gridTile);
  const look = useAssetLook(useCanvasLook());
  const zoom = useViewFeedStore((state) => state.view?.zoom ?? 0);
  return gridsHidden(look, { pixel, major, tile }, zoom, surface);
};

export { useHiddenGrids };
