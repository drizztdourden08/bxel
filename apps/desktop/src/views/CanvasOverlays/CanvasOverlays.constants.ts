/* @layer renderer-app @kind constants */
const LOUPE = {
  size: 96,
  gap: 28,
  times: 4,
  minPixels: 3,
  gridFrom: 8,
} as const;

const HUD_SHOW_MS = 1000;

const CANVAS_OVERLAY_TEXT = {
  hud: 'Zoom',
  hudReset: 'Double click to fit',
  loupe: 'Loupe',
  fullscreen: 'Fullscreen preview. Press any key to return.',
  fullscreenBack: 'Fullscreen preview closed',
  percent: (zoom: number): string => `${Math.round(zoom * 100)}%`,
} as const;

export { CANVAS_OVERLAY_TEXT, HUD_SHOW_MS, LOUPE };
