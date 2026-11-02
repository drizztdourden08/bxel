/* @layer renderer-app @kind logic */
import { encodePngRgba } from '@bxel/formats';
import { encodeBase64, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import { cropRgba } from './crop-rgba';
import { drawViewOverlays } from './draw-view-overlays';
import { indexHash } from './index-hash';
import { mirrorRgba } from './mirror-rgba';
import { overlayFit } from './overlay-fit';
import { OVERLAY_TEXT } from './render-overlay.constants';
import { reply } from './reply';
import { stillImageOf } from './still-image-of';
import type { RenderInput } from './tool-input.type';
import { visibleArtRect } from './visible-art-rect';

const wantsViewOptions = (request: RenderInput): boolean => (request.overlays?.length ?? 0) > 0 || request.view === true || request.mirror === true;

const applyViewOptions = async (made: ToolReply, request: RenderInput, view: DocumentView): Promise<ToolReply> => {
  const start = stillImageOf(made);
  if (!wantsViewOptions(request) || !start || !made.outcome.ok) return made;
  const { scale } = request;
  const mirror = request.mirror === true;
  const fit = overlayFit(request);
  drawViewOverlays({ image: start, scale }, request, view, fit.applied);
  const rect = request.view === true ? visibleArtRect(request.documentId, { width: start.width / scale, height: start.height / scale }) : null;
  const cropped = rect ? cropRgba(start, rect, scale) : start;
  const image = mirror ? mirrorRgba(cropped) : cropped;
  const encoded = encodePngRgba(image);
  if (!encoded.ok || encoded.bytes.length > RENDER_PNG_BYTES_MAX) return made;
  const uri = `${String(made.outcome.uri)}${OVERLAY_TEXT.uriPart(fit.applied, mirror, rect !== null)}`;
  const extra = { ...(request.overlays ? { overlays: fit } : {}), ...(mirror ? { mirrored: true } : {}), ...(rect ? { cropped: rect } : {}) };
  const changed = { ...made.outcome, width: image.width, height: image.height, indexHash: await indexHash(encoded.bytes), uri, ...extra };
  return reply(changed, [encodeBase64(encoded.bytes)]);
};

export { applyViewOptions };
