/* @layer renderer-app @kind constants */
import { isFrameRequest } from './is-frame-request';
import { isSpriteRequest } from './is-sprite-request';
import { ownsSelection } from './owns-selection';
import { GRID_MIN_SCALE } from './render-overlay.constants';
import type { RenderInput, RenderOverlay } from './tool-input.type';

const FITS: Readonly<Record<RenderOverlay, (request: RenderInput) => boolean>> = {
  grid: (request) => isFrameRequest(request) && request.scale >= GRID_MIN_SCALE,
  major: isFrameRequest,
  tile: isFrameRequest,
  guides: isSpriteRequest,
  selection: ownsSelection,
  onion: (request) => 'animationId' in request.target && request.target.frameId !== undefined,
  collision: (request) => 'tilesetId' in request.target,
};

export { FITS };
