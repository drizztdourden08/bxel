/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { toggleItem } from '../../../toolbar-items';
import { ANIMATE_TILES_HINT, COLLISION_OVERLAY_HINT, TERRAIN_BRUSH_HINT, TILE_OPTIONS_TEXT } from '../sub-components/TileOptions.constants';

const useTileOverlayItems = (): ToolbarItem[] => {
  const shown = useTilemapStore((state) => state.showCollision);
  const setShown = useTilemapStore((state) => state.setShowCollision);
  const brush = useTilemapStore((state) => state.terrainBrush);
  const setBrush = useTilemapStore((state) => state.setTerrainBrush);
  const animate = useTilemapStore((state) => state.animateTiles);
  const setAnimate = useTilemapStore((state) => state.setAnimateTiles);
  return [
    toggleItem({
      id: 'map-collision', icon: 'square', hint: COLLISION_OVERLAY_HINT, caption: TILE_OPTIONS_TEXT.collisionCaption, pressed: shown, onChange: setShown,
    }),
    toggleItem({
      id: 'map-terrain', icon: 'pixel-map-paint', hint: TERRAIN_BRUSH_HINT, caption: TILE_OPTIONS_TEXT.terrainCaption, pressed: brush, onChange: setBrush,
    }),
    toggleItem({
      id: 'map-animate', icon: 'pixel-animation', hint: ANIMATE_TILES_HINT, caption: TILE_OPTIONS_TEXT.animateCaption, pressed: animate, onChange: setAnimate,
    }),
  ];
};

export { useTileOverlayItems };
