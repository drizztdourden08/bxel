/* @layer renderer-app @kind logic */
import { currentTarget } from '../../editor/current-target';
import { GRID_MIN_SCALE } from './render-overlay.constants';
import type { OverlayFit } from './render-overlay.type';
import type { RenderInput, RenderOverlay } from './tool-input.type';

const isSprite = (request: RenderInput): boolean => 'spriteId' in request.target;

const isFrame = (request: RenderInput): boolean =>
  request.animated === undefined && (isSprite(request) || ('animationId' in request.target && request.target.frameId !== undefined));

const ownsSelection = (request: RenderInput): boolean => {
  const open = currentTarget();
  return open !== null && open.documentId === request.documentId && 'spriteId' in request.target && open.sprite.id === request.target.spriteId;
};

const FITS: Readonly<Record<RenderOverlay, (request: RenderInput) => boolean>> = {
  grid: (request) => isFrame(request) && request.scale >= GRID_MIN_SCALE,
  major: isFrame,
  tile: isFrame,
  guides: isSprite,
  selection: ownsSelection,
  onion: (request) => 'animationId' in request.target && request.target.frameId !== undefined,
  collision: (request) => 'tilesetId' in request.target,
};

const overlayFit = (request: RenderInput): OverlayFit => {
  const asked = [...new Set(request.overlays ?? [])];
  return { applied: asked.filter((name) => FITS[name](request)), ignored: asked.filter((name) => !FITS[name](request)) };
};

export { overlayFit };
