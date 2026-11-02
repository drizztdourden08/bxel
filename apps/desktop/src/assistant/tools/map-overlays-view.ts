/* @layer renderer-app @kind logic */
import { useLayerViewStore } from '../../stores/useLayerViewStore';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useViewStore } from '../../stores/useViewStore';

const mapOverlaysView = () => {
  const tiles = useTilemapStore.getState();
  const view = useViewStore.getState();
  return {
    collision: tiles.showCollision,
    animatedTiles: tiles.animateTiles,
    terrainBrush: tiles.terrainBrush,
    tileGrid: view.gridTile,
    highlightLayer: useLayerViewStore.getState().highlight,
    mirror: view.mirror,
    hideOverlays: view.hideOverlays,
  };
};

export { mapOverlaysView };
