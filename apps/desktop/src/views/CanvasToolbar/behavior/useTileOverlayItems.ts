/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useTileClockStore } from '../../../stores/useTileClockStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { ANIMATE_TILES_HINT, COLLISION_OVERLAY_HINT, TILE_CLOCK_PAUSE_HINT, TILE_CLOCK_PLAY_HINT, TILE_TEXT } from '../../../tilemap/tile-mode.constants';
import { toggleItem } from '../../../toolbar-items';
import { tileSpeedGroups } from './tile-speed-groups';

const useTileOverlayItems = (): ToolbarItem[] => {
  const tilemap = useSpriteStore((state) => state.mode === 'tilemap');
  const shown = useTilemapStore((state) => state.showCollision);
  const setShown = useTilemapStore((state) => state.setShowCollision);
  const animate = useTilemapStore((state) => state.animateTiles);
  const setAnimate = useTilemapStore((state) => state.setAnimateTiles);
  const paused = useTileClockStore((state) => state.paused);
  const speed = useTileClockStore((state) => state.speed);
  const setPaused = useTileClockStore((state) => state.setPaused);
  const setSpeed = useTileClockStore((state) => state.setSpeed);
  if (!tilemap) return [];
  return [
    toggleItem({ id: 'map-collision', icon: 'square', hint: COLLISION_OVERLAY_HINT, caption: TILE_TEXT.collisionCaption, pressed: shown, onChange: setShown }),
    toggleItem({
      id: 'map-animate', icon: 'pixel-animation', hint: ANIMATE_TILES_HINT, caption: TILE_TEXT.animateCaption, pressed: animate, onChange: setAnimate, options: tileSpeedGroups(speed, setSpeed), openOn: 'hold',
    }),
    toggleItem({
      id: 'map-tile-clock', icon: paused ? 'pixel-play' : 'pixel-pause', hint: paused ? TILE_CLOCK_PLAY_HINT : TILE_CLOCK_PAUSE_HINT, disabled: !animate, pressed: paused, onChange: setPaused,
    }),
  ];
};

export { useTileOverlayItems };
