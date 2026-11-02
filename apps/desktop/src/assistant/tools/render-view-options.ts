/* @layer renderer-app @kind logic */
import { encodePngRgba } from '@bxel/formats';
import { encodeBase64, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import { composeViewImage } from './compose-view-image';
import { drawViewOverlays } from './draw-view-overlays';
import { indexHash } from './index-hash';
import { overlayFit } from './overlay-fit';
import { OVERLAY_TEXT } from './render-overlay.constants';
import { reply } from './reply';
import { stillImageOf } from './still-image-of';
import type { RenderInput } from './tool-input.type';
import { viewOptionsExtra } from './view-options-extra';

const wantsViewOptions = (request: RenderInput): boolean => (request.overlays?.length ?? 0) > 0 || request.view === true || request.mirror === true;

const applyViewOptions = async (made: ToolReply, request: RenderInput, view: DocumentView): Promise<ToolReply> => {
  const start = stillImageOf(made);
  if (!wantsViewOptions(request) || !start || !made.outcome.ok) return made;
  const { scale } = request;
  const fit = overlayFit(request);
  drawViewOverlays({ image: start, scale }, request, view, fit.applied);
  const { image, rect } = composeViewImage(start, request);
  const encoded = encodePngRgba(image);
  if (!encoded.ok || encoded.bytes.length > RENDER_PNG_BYTES_MAX) return made;
  const uri = `${String(made.outcome.uri)}${OVERLAY_TEXT.uriPart(fit.applied, request.mirror === true, rect !== null)}`;
  const extra = viewOptionsExtra(request, fit, rect);
  const changed = { ...made.outcome, width: image.width, height: image.height, indexHash: await indexHash(encoded.bytes), uri, ...extra };
  return reply(changed, [encodeBase64(encoded.bytes)]);
};

export { applyViewOptions };
