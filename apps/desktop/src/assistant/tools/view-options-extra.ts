/* @layer renderer-app @kind logic */
import type { ArtRect, OverlayFit } from './render-overlay.type';
import type { RenderInput } from './tool-input.type';

const viewOptionsExtra = (request: RenderInput, fit: OverlayFit, rect: ArtRect | null): Record<string, unknown> => ({
  ...(request.overlays ? { overlays: fit } : {}),
  ...(request.mirror === true ? { mirrored: true } : {}),
  ...(rect ? { cropped: rect } : {}),
});

export { viewOptionsExtra };
