/* @layer renderer-app @kind constants */
import type { DitherPattern, GradientKind, GradientPattern } from '@bxel/raster';
import type { IconName } from '@drizztdourden08/tessera';
import type { FillColour, FillMatch, FillSample, GradientMode, InkKind, PickSample } from '../../stores/drawing-store.type';
import type { HintSpec } from '../ActionHint';

const DRAWING_TEXT = {
  ink: 'Ink',
  inkPattern: 'Dither pattern',
  inkSteps: 'Shade steps',
  inkLevel: 'Dither level',
  pickSample: 'Pick from',
  fillSample: 'Fill bounds',
  fillMatch: 'Fill matches',
  sprayRadius: 'Spray size',
  sprayDensity: 'Spray density',
  spraySeed: 'Lock seed',
  gradientKind: 'Gradient kind',
  gradientMode: 'Gradient steps',
  gradientPattern: 'Gradient pattern',
  gradientReflect: 'Reflect',
  filled: 'Filled',
  fillColour: 'Fill colour',
  radius: 'Corner radius',
  evenSteps: 'Even steps',
  perfect: 'Pixel perfect',
  symmetry: 'Symmetry',
  symmetryTitle: 'Symmetry axes',
  brushes: 'Brush',
  brushStencil: 'Stencil',
  lockToTile: 'Lock to tile',
  noBrush: 'No saved brush',
} as const;

const INK_LABELS: Readonly<Record<InkKind, string>> = {
  normal: 'Normal',
  behind: 'Behind',
  lockAlpha: 'Lock alpha',
  onlyColour: 'Only colour',
  dither: 'Dither',
  shade: 'Shade',
  lighten: 'Lighten',
  darken: 'Darken',
};

const INK_DESCRIPTIONS: Readonly<Record<InkKind, string>> = {
  normal: 'Paint the colour as it is.',
  behind: 'Paint only where the pixel is transparent, so colour goes under the line art.',
  lockAlpha: 'Paint only over pixels that already have colour, so nothing spills outside the shape.',
  onlyColour: 'Paint only over pixels of the back colour. The right button swaps the two colours.',
  dither: 'Mix the front and back colour through a pattern that stays fixed to the canvas.',
  shade: 'Move each pixel one step along its ramp. The right button goes the other way.',
  lighten: 'Move each pixel one step lighter along its ramp. The right button darkens.',
  darken: 'Move each pixel one step darker along its ramp. The right button lightens.',
};

const INK_ICONS: Readonly<Record<InkKind, IconName>> = {
  normal: 'pixel-pencil',
  behind: 'pixel-layers',
  lockAlpha: 'pixel-lock',
  onlyColour: 'pixel-eyedropper',
  dither: 'pixel-grid',
  shade: 'pixel-shade',
  lighten: 'pixel-shade',
  darken: 'pixel-shade',
};

const DITHER_PATTERN_LABELS: Readonly<Record<DitherPattern, string>> = {
  checker: 'Checker, 50 percent',
  bayer: 'Bayer 4 by 4, by level',
  rows: 'Lines across',
  columns: 'Lines down',
  dots: 'Dots, 25 percent',
};

const GRADIENT_PATTERN_LABELS: Readonly<Record<GradientPattern, string>> = {
  bayer: 'Bayer',
  checker: 'Checker',
  rows: 'Lines across',
  columns: 'Lines down',
};

const GRADIENT_KINDS: readonly GradientKind[] = ['linear', 'radial'];
const GRADIENT_MODES: readonly GradientMode[] = ['bands', 'dither'];
const PICK_SAMPLES: readonly PickSample[] = ['visible', 'layer'];
const FILL_SAMPLES: readonly FillSample[] = ['layer', 'visible'];
const FILL_MATCHES: readonly FillMatch[] = ['index', 'ramp'];
const FILL_COLOURS: readonly FillColour[] = ['same', 'back'];

const PLAIN_LABELS = {
  linear: 'Linear',
  radial: 'Radial',
  bands: 'Bands',
  dither: 'Dithered',
  visible: 'All visible layers',
  layer: 'This layer',
  index: 'Same colour',
  ramp: 'Same ramp',
  same: 'Same as outline',
  back: 'Back colour',
} as const;

const PLAIN_DESCRIPTIONS = {
  linear: 'Run the ramp along the line you drag.',
  radial: 'Run the ramp outwards from the point where you start.',
  bands: 'Hard bands, one per ramp colour.',
  dither: 'Mix neighbouring colours through a pattern.',
  visible: 'Read the composite of every visible layer.',
  layer: 'Read only the current layer.',
  index: 'The area is made of the exact colour you click.',
  ramp: 'Every colour of the clicked ramp counts as one area.',
  same: 'Fill with the same colour as the outline.',
  back: 'Outline in the front colour and fill in the back colour.',
} as const;

const PLAIN_ICONS: Readonly<Record<keyof typeof PLAIN_LABELS, IconName>> = {
  linear: 'pixel-gradient',
  radial: 'pixel-brush-circle',
  bands: 'pixel-list-view',
  dither: 'pixel-grid',
  visible: 'pixel-layers',
  layer: 'pixel-sprite',
  index: 'pixel-fill-bucket',
  ramp: 'pixel-palette',
  same: 'pixel-brush-square',
  back: 'pixel-shape-rect-filled',
};

const plainHint = (key: keyof typeof PLAIN_LABELS): HintSpec => ({ name: PLAIN_LABELS[key], description: PLAIN_DESCRIPTIONS[key] });

const HINTS = {
  filled: { name: 'Filled', description: 'Fill the inside of the shape. Press the tool key again to toggle.' } satisfies HintSpec,
  radius: { name: 'Corner radius', description: 'Round the corners of rectangles, 0 to 8 pixels.' } satisfies HintSpec,
  evenSteps: { name: 'Even steps', description: 'Draw lines with equal runs so there are no uneven breaks.' } satisfies HintSpec,
  perfect: { name: 'Pixel perfect', description: 'Drop the extra corner pixels that make a line look thick. Shown at brush size 1.' } satisfies HintSpec,
  reflect: { name: 'Reflect', description: 'Run the gradient back again after it reaches the end.' } satisfies HintSpec,
  spraySize: { name: 'Spray size', description: 'The width of the spray disc in pixels.' } satisfies HintSpec,
  sprayDensity: { name: 'Spray density', description: 'How many dots land every tick while the button is held.' } satisfies HintSpec,
  spraySeed: { name: 'Lock seed', description: 'Repeat the same scatter on every stroke.' } satisfies HintSpec,
  inkSteps: { name: 'Shade steps', description: 'How many ramp steps a pixel moves, 1 to 4.' } satisfies HintSpec,
  inkLevel: { name: 'Dither level', description: 'How much of the front colour the pattern keeps, 1 to 15 of 16.' } satisfies HintSpec,
  stencil: { name: 'Stencil', description: 'Paint the custom brush shape in the front colour instead of its own colours.' } satisfies HintSpec,
  lockToTile: { name: 'Lock to tile', description: 'Keep every stroke inside the tile, with no wrap across the edge.' } satisfies HintSpec,
};

export {
  DITHER_PATTERN_LABELS, DRAWING_TEXT, FILL_COLOURS, FILL_MATCHES, FILL_SAMPLES, GRADIENT_KINDS, GRADIENT_MODES, GRADIENT_PATTERN_LABELS, HINTS, INK_DESCRIPTIONS, INK_ICONS, INK_LABELS,
  PICK_SAMPLES, PLAIN_ICONS, plainHint,
};
