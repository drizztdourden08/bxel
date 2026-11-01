/* @layer renderer-app @kind logic */
import { symmetryOf } from '../../../editor/symmetry-of';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelDraw } from '../../PixelViewport';
import { overlayLook } from './overlay-look';
import { paintAreas } from './paint-areas';
import { paintAxes } from './paint-axes';
import { paintCanvasPreview } from './paint-canvas-preview';
import { paintCursor } from './paint-cursor';
import { paintGuides } from './paint-guides';
import { paintLint } from './paint-lint';
import { paintSelection } from './paint-selection';
import { paintSlices } from './paint-slices';
import { paintTransform } from './paint-transform';
import { paintZoomRect } from './paint-zoom-rect';

const paintOverlay: PixelDraw = (ctx, view) => {
  const look = overlayLook(ctx.canvas);
  const symmetry = symmetryOf(useToolStore.getState(), { width: view.imageWidth, height: view.imageHeight });
  paintAreas(ctx, view, look);
  paintLint(ctx, view);
  paintSelection(ctx, view, look);
  paintGuides(ctx, view);
  paintAxes(ctx, view, symmetry, look);
  paintCursor(ctx, view, symmetry, look);
  paintTransform(ctx, view, look);
  paintCanvasPreview(ctx, view, look);
  paintSlices(ctx, view, look);
  paintZoomRect(ctx, view, look);
};

export { paintOverlay };
