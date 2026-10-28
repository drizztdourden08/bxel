/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { ANIMATE_TILES_HINT, COLLISION_OVERLAY_HINT, TILE_TEXT } from '../../../tilemap/tile-mode.constants';
import { toggleItem } from '../../../toolbar-items';

const useTileOverlayItems = (): ToolbarItem[] => {
  const tilemap = useSpriteStore((state) => state.mode === 'tilemap');
  const shown = useTilemapStore((state) => state.showCollision);
  const setShown = useTilemapStore((state) => state.setShowCollision);
  const animate = useTilemapStore((state) => state.animateTiles);
  const setAnimate = useTilemapStore((state) => state.setAnimateTiles);
  if (!tilemap) return [];
  return [
    toggleItem({ id: 'map-collision', icon: 'square', hint: COLLISION_OVERLAY_HINT, caption: TILE_TEXT.collisionCaption, pressed: shown, onChange: setShown }),
    toggleItem({ id: 'map-animate', icon: 'pixel-animation', hint: ANIMATE_TILES_HINT, caption: TILE_TEXT.animateCaption, pressed: animate, onChange: setAnimate }),
  ];
};

export { useTileOverlayItems };
