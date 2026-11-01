/* @layer renderer-app @kind component */
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { OVERLAY_TEXT } from '../ViewPanel.constants';
import { OverlayRow } from './OverlayRow';

const MapOverlayRows = () => {
  const collision = useTilemapStore((state) => state.showCollision);
  const animate = useTilemapStore((state) => state.animateTiles);
  return (
    <>
      <OverlayRow label={OVERLAY_TEXT.collision} description={OVERLAY_TEXT.collisionDescription} checked={collision} onChange={(on) => useTilemapStore.getState().setShowCollision(on)} />
      <OverlayRow label={OVERLAY_TEXT.animate} description={OVERLAY_TEXT.animateDescription} checked={animate} onChange={(on) => useTilemapStore.getState().setAnimateTiles(on)} />
    </>
  );
};

export { MapOverlayRows };
