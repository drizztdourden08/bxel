/* @layer renderer-app @kind logic */
import type { RgbaImage } from '@bxel/formats';
import { cropRgba } from './crop-rgba';
import { mirrorRgba } from './mirror-rgba';
import type { ArtRect } from './render-overlay.type';
import type { RenderInput } from './tool-input.type';
import { visibleArtRect } from './visible-art-rect';

const composeViewImage = (start: RgbaImage, request: RenderInput): { readonly image: RgbaImage; readonly rect: ArtRect | null } => {
  const { scale } = request;
  const rect = request.view === true ? visibleArtRect(request.documentId, { width: start.width / scale, height: start.height / scale }) : null;
  const cropped = rect ? cropRgba(start, rect, scale) : start;
  return { image: request.mirror === true ? mirrorRgba(cropped) : cropped, rect };
};

export { composeViewImage };
