/* @layer renderer-app @kind logic */
import type { PixelPoint } from '../../PixelViewport';
import { LOUPE } from '../CanvasOverlays.constants';

const loupePlace = (centre: PixelPoint, room: { width: number; height: number }): PixelPoint => {
  const right = centre.x + LOUPE.gap + LOUPE.size <= room.width;
  const below = centre.y + LOUPE.gap + LOUPE.size <= room.height;
  return {
    x: right ? centre.x + LOUPE.gap : centre.x - LOUPE.gap - LOUPE.size,
    y: below ? centre.y + LOUPE.gap : centre.y - LOUPE.gap - LOUPE.size,
  };
};

export { loupePlace };
