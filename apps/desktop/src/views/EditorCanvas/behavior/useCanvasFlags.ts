/* @layer renderer-app @kind hook */
import { useShallow } from 'zustand/react/shallow';
import { useViewStore } from '../../../stores/useViewStore';

const useCanvasFlags = () =>
  useViewStore(
    useShallow((state) => ({
      grid: state.grid && !state.hideOverlays,
      gridMajor: state.gridMajor && !state.hideOverlays,
      gridTile: state.gridTile && !state.hideOverlays,
      gridIso: state.gridIso && !state.hideOverlays,
      rulers: state.rulers,
      tiled: state.tiled,
      mirror: state.mirror,
      split: state.split,
    })),
  );

export { useCanvasFlags };
