/* @layer renderer-app @kind logic */
import { FITS } from './overlay-fit.constants';
import type { OverlayFit } from './render-overlay.type';
import type { RenderInput } from './tool-input.type';

const overlayFit = (request: RenderInput): OverlayFit => {
  const asked = [...new Set(request.overlays ?? [])];
  return { applied: asked.filter((name) => FITS[name](request)), ignored: asked.filter((name) => !FITS[name](request)) };
};

export { overlayFit };
