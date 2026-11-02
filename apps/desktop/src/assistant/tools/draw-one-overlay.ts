/* @layer renderer-app @kind logic */
import { currentTarget } from '../../editor/current-target';
import { selectionMask } from '../../editor/selection/selection-mask';
import { artLineSet } from './art-line-set';
import { drawOverlayLines } from './draw-overlay-lines';
import { drawOverlaySelection } from './draw-overlay-selection';
import type { ArtLines, OverlayCanvas } from './render-overlay.type';
import type { RenderOverlay } from './tool-input.type';

const drawOneOverlay = (canvas: OverlayCanvas, name: RenderOverlay, art: ArtLines): void => {
  if (name === 'selection') {
    const open = currentTarget();
    const mask = open ? selectionMask(open) : null;
    if (mask) drawOverlaySelection(canvas, mask);
  } else if (name === 'grid' || name === 'major' || name === 'tile' || name === 'guides') {
    drawOverlayLines(canvas.image, artLineSet(name, art));
  }
};

export { drawOneOverlay };
