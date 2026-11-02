/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { currentTarget } from '../../editor/current-target';
import { selectionMask } from '../../editor/selection/selection-mask';
import type { DocumentView } from '../../documents/document-host.type';
import { artLineSet } from './art-line-set';
import { drawOverlayLines } from './draw-overlay-lines';
import { drawOverlaySelection } from './draw-overlay-selection';
import { DRAW_ORDER } from './render-overlay.constants';
import type { OverlayCanvas } from './render-overlay.type';
import type { RenderInput, RenderOverlay } from './tool-input.type';

const drawViewOverlays = (canvas: OverlayCanvas, request: RenderInput, view: DocumentView, applied: readonly RenderOverlay[]): void => {
  const { image, scale } = canvas;
  const { target } = request;
  const guides = 'spriteId' in target ? findSprite(view.state.artwork, target.spriteId as SpriteId)?.guides : undefined;
  const art = { width: image.width / scale, height: image.height / scale, scale, guides };
  for (const name of DRAW_ORDER.filter((each) => applied.includes(each))) {
    if (name === 'selection') {
      const open = currentTarget();
      const mask = open ? selectionMask(open) : null;
      if (mask) drawOverlaySelection(canvas, mask);
    } else if (name === 'grid' || name === 'major' || name === 'tile' || name === 'guides') {
      drawOverlayLines(image, artLineSet(name, art));
    }
  }
};

export { drawViewOverlays };
