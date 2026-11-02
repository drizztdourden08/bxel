/* @layer renderer-app @kind logic */
import { findSprite } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import type { DocumentView } from '../../documents/document-host.type';
import { drawOneOverlay } from './draw-one-overlay';
import { DRAW_ORDER } from './render-overlay.constants';
import type { OverlayCanvas } from './render-overlay.type';
import type { RenderInput, RenderOverlay } from './tool-input.type';

const drawViewOverlays = (canvas: OverlayCanvas, request: RenderInput, view: DocumentView, applied: readonly RenderOverlay[]): void => {
  const { image, scale } = canvas;
  const { target } = request;
  const guides = 'spriteId' in target ? findSprite(view.state.artwork, target.spriteId as SpriteId)?.guides : undefined;
  const art = { width: image.width / scale, height: image.height / scale, scale, guides };
  for (const name of DRAW_ORDER.filter((each) => applied.includes(each))) drawOneOverlay(canvas, name, art);
};

export { drawViewOverlays };
