/* @layer renderer-app @kind logic */
import { useLayerViewStore } from '../../stores/useLayerViewStore';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useViewStore } from '../../stores/useViewStore';

const togglesView = () => {
  const view = useViewStore.getState();
  return {
    grid: view.grid,
    gridMajor: view.gridMajor,
    gridTile: view.gridTile,
    gridIso: view.gridIso,
    guides: view.guides,
    rulers: view.rulers,
    snap: view.snap,
    slices: view.slices,
    hideOverlays: view.hideOverlays,
    mirror: view.mirror,
    loupe: view.loupe,
    backgroundPreview: view.backgroundPreview,
    split: view.split,
    splitLink: view.splitLink,
    splitActual: view.splitActual,
    fullscreen: view.fullscreen,
    lockGuides: view.lockGuides,
    tiled: view.tiled,
    highlightLayer: useLayerViewStore.getState().highlight,
    animatedTiles: useTilemapStore.getState().animateTiles,
  };
};

export { togglesView };
