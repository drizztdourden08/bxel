/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { leash } from '../../../editor/leash';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint } from './canvas-tools.type';
import { gestureLive } from './gesture-live';
import { pixelAtEvent } from './pixel-at-event';

const stabilisedAt = (viewport: PixelViewportHandle | null, sample: ClientPoint): Point => {
  const reach = useDrawingStore.getState().stabiliser;
  if (reach <= 0) return pixelAtEvent(viewport, sample);
  const held = leash(gestureLive.held, { x: sample.clientX, y: sample.clientY }, reach);
  gestureLive.held = held;
  return pixelAtEvent(viewport, { clientX: held.x, clientY: held.y });
};

export { stabilisedAt };
