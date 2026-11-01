/* @layer renderer-app @kind constants */
import type { DrawingSettings } from './drawing-store.type';

const DRAWING_DEFAULTS: DrawingSettings = {
  inks: {},
  onlyColour: null,
  ditherPattern: 'checker',
  ditherLevel: 8,
  ditherCustom: false,
  shadeMode: 'shade',
  shadeSteps: 1,
  shadeRamp: null,
  patternAlign: 'canvas',
  filled: { rect: false, ellipse: false, curve: false, polygon: false, contour: true },
  fillColour: 'same',
  cornerRadius: 0,
  evenSteps: false,
  curvePerfect: true,
  curveCubic: false,
  contourPerfect: false,
  pickSample: 'visible',
  pickReturn: false,
  fillSample: 'layer',
  fillMatch: 'index',
  sprayDensity: 6,
  sprayPressure: true,
  stabiliser: 0,
  outlineRing: 8,
  outlineSelOut: false,
  outlineFrames: 'frame',
  cels: 'frame',
  spraySize: 8,
  spraySeed: null,
  gradientKind: 'linear',
  gradientMode: 'bands',
  gradientPattern: 'bayer',
  gradientCustom: false,
  gradientSize: 4,
  gradientReflect: false,
  gradientRamp: null,
  symmetryDiagonal: false,
  symmetryTurn: false,
  lockToTile: false,
  linkedChoice: 'ask',
  brushId: null,
  brushSpacing: 1,
  brushMode: 'colour',
  brushFlipX: false,
  brushFlipY: false,
  brushTurn: 0,
};

const STABILISER_LIMITS = { min: 0, max: 32 } as const;

const SPRAY_LIMITS = { sizeMin: 2, sizeMax: 64, densityMin: 1, densityMax: 100 } as const;

const SPRAY_TICK_MS = 33;

const CORNER_RADIUS = { min: 0, max: 8 } as const;

export { CORNER_RADIUS, DRAWING_DEFAULTS, SPRAY_LIMITS, SPRAY_TICK_MS, STABILISER_LIMITS };
