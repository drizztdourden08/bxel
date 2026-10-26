/* @layer renderer-app @kind logic */
import { symmetryOf } from '../../../editor/symmetry-of';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelDraw } from '../../PixelViewport';
import { overlayLook } from './overlay-look';
import { paintAreas } from './paint-areas';
import { paintAxes } from './paint-axes';
import { paintCursor } from './paint-cursor';
import { paintGuides } from './paint-guides';
import { paintSelection } from './paint-selection';

const paintOverlay: PixelDraw = (ctx, view) => {
  const look = overlayLook(ctx.canvas);
  const symmetry = symmetryOf(useToolStore.getState(), { width: view.imageWidth, height: view.imageHeight });
  paintAreas(ctx, view, look);
  paintSelection(ctx, view, look);
  paintGuides(ctx, view, look);
  paintAxes(ctx, view, symmetry, look);
  paintCursor(ctx, view, symmetry, look);
};

export { paintOverlay };
