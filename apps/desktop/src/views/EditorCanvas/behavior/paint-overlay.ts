/* @layer renderer-app @kind logic */
import { symmetryOf } from '../../../editor/symmetry-of';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useToolStore } from '../../../stores/useToolStore';
import { useViewStore } from '../../../stores/useViewStore';
import type { PixelDraw } from '../../PixelViewport';
import { overlayLook } from './overlay-look';
import { paintAreas } from './paint-areas';
import { paintAxes } from './paint-axes';
import { paintCanvasPreview } from './paint-canvas-preview';
import { paintCursor } from './paint-cursor';
import { paintMarker } from './paint-marker';
import { paintGuides } from './paint-guides';
import { paintLint } from './paint-lint';
import { paintSelection } from './paint-selection';
import { paintSlices } from './paint-slices';
import { paintTransform } from './paint-transform';
import { paintBrushResize } from './paint-brush-resize';
import { paintZoomRect } from './paint-zoom-rect';

const paintOverlay: PixelDraw = (ctx, view) => {
  const look = overlayLook(ctx.canvas);
  const size = { width: view.imageWidth, height: view.imageHeight };
  const symmetry = symmetryOf(useToolStore.getState(), size, useReadoutStore.getState().pointer);
  const hidden = useViewStore.getState().hideOverlays;
  paintAreas(ctx, view, look);
  if (!hidden) {
    paintLint(ctx, view);
    paintSelection(ctx, view, look);
    paintGuides(ctx, view);
    paintAxes(ctx, view, symmetry, look);
  }
  paintCursor(ctx, view, symmetry, look);
  paintTransform(ctx, view, look);
  paintCanvasPreview(ctx, view, look);
  paintSlices(ctx, view, look);
  paintZoomRect(ctx, view, look);
  paintBrushResize(ctx, view, look);
  paintMarker(ctx, view, look);
};

export { paintOverlay };
