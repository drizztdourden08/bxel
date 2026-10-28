/* @layer renderer-app @kind constants */
import type { DrawingSettings, FilledTool, InkKind } from './drawing-store.type';

const DRAWING_DEFAULTS: DrawingSettings = {
  inkKind: 'normal',
  onlyColour: null,
  ditherPattern: 'checker',
  ditherLevel: 8,
  shadeSteps: 1,
  shadeRamp: null,
  filled: { rect: false, ellipse: false, curve: false, polygon: false, contour: true },
  fillColour: 'same',
  cornerRadius: 0,
  evenSteps: false,
  curvePerfect: true,
  contourPerfect: false,
  pickSample: 'visible',
  fillSample: 'layer',
  fillMatch: 'index',
  sprayDensity: 6,
  spraySize: 8,
  spraySeed: null,
  gradientKind: 'linear',
  gradientMode: 'bands',
  gradientPattern: 'bayer',
  gradientSize: 4,
  gradientReflect: false,
  gradientRamp: null,
  symmetryDiagonal: false,
  symmetryTurn: false,
  lockToTile: false,
  linkedChoice: 'ask',
  brushId: null,
  brushMode: 'colour',
  brushFlipX: false,
  brushFlipY: false,
  brushTurn: 0,
};

const INK_KINDS: readonly InkKind[] = ['normal', 'behind', 'lockAlpha', 'onlyColour', 'dither', 'shade', 'lighten', 'darken'];

const FILLED_TOOLS: readonly FilledTool[] = ['rect', 'ellipse', 'curve', 'polygon', 'contour'];

const SPRAY_LIMITS = { sizeMin: 2, sizeMax: 64, densityMin: 1, densityMax: 100 } as const;

const SPRAY_TICK_MS = 33;

const CORNER_RADIUS = { min: 0, max: 8 } as const;

export { CORNER_RADIUS, DRAWING_DEFAULTS, FILLED_TOOLS, INK_KINDS, SPRAY_LIMITS, SPRAY_TICK_MS };
