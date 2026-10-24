/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { clampPoint } from '../../../editor/clamp-point';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ClientPoint } from './canvas-tools.type';

const pixelAtEvent = (viewport: PixelViewportHandle | null, event: ClientPoint): Point =>
  clampPoint(viewport?.screenToPixel(event.clientX, event.clientY) ?? { x: 0, y: 0 });

export { pixelAtEvent };
