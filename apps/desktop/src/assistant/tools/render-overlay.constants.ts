/* @layer renderer-app @kind constants */
import type { OverlayInk } from './render-overlay.type';
import type { RenderOverlay } from './tool-input.type';

const GRID_MIN_SCALE = 4;

const GRID_INK: Readonly<Record<'grid' | 'major' | 'tile' | 'guides' | 'selection', OverlayInk>> = {
  grid: { rgb: [255, 255, 255], alpha: 0.2 },
  major: { rgb: [255, 255, 255], alpha: 0.5 },
  tile: { rgb: [216, 216, 224], alpha: 0.75 },
  guides: { rgb: [0, 200, 255], alpha: 0.9 },
  selection: { rgb: [255, 255, 255], alpha: 1 },
};

const GRID_STEP: Readonly<Record<'grid' | 'major' | 'tile', number>> = { grid: 1, major: 8, tile: 16 };

const DRAW_ORDER: readonly RenderOverlay[] = ['grid', 'major', 'tile', 'guides', 'selection'];

const OVERLAY_TEXT = {
  uriPart: (overlays: readonly string[], mirror: boolean, view: boolean): string =>
    `${overlays.length > 0 ? `&overlays=${overlays.join(',')}` : ''}${mirror ? '&mirror=1' : ''}${view ? '&view=1' : ''}`,
} as const;

export { DRAW_ORDER, GRID_INK, GRID_MIN_SCALE, GRID_STEP, OVERLAY_TEXT };
