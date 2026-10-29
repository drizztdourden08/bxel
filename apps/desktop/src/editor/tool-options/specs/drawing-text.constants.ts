/* @layer renderer-app @kind constants */
import type { DitherPattern, GradientPattern } from '@bxel/raster';
import type { InkKind } from '../../../stores/drawing-store.type';
import type { OptionChoice } from '../tool-options.type';

const DRAWING_TEXT = {
  ink: 'Ink',
  inkDescription: 'How the paint lands on the pixels under it. Every ink writes only colours of the palette.',
  ditherPattern: 'Dither pattern',
  ditherPatternDescription: 'The pattern the front and back colour follow. It stays fixed to the canvas.',
  ditherLevel: 'Dither level',
  ditherLevelDescription: 'How much of the front colour the Bayer pattern keeps, 1 to 15 of 16.',
  shadeMode: 'Shade mode',
  shadeModeDescription: 'Move along the ramp of each pixel: lighten and darken go one way, shade follows the button.',
  shadeSteps: 'Shade steps',
  shadeStepsDescription: 'How many ramp steps a pixel moves, 1 to 4.',
  shadeRamp: 'Shade ramp',
  shadeRampDescription: 'The ramp to move along. Automatic uses the ramp that holds each pixel.',
  autoRamp: 'Automatic',
  filled: 'Filled',
  filledDescription: 'Fill the inside of the shape. Press the tool key again to toggle.',
  fillColour: 'Fill colour',
  fillColourDescription: 'Fill with the outline colour, or outline in the front colour and fill in the back colour.',
  radius: 'Corner radius',
  radiusDescription: 'Round the corners of rectangles, 0 to 8 pixels.',
  evenSteps: 'Even steps',
  evenStepsDescription: 'Draw lines with equal runs so there are no uneven breaks.',
  perfect: 'Pixel perfect',
  perfectDescription: 'Drop the extra corner pixels that make a line look thick.',
  pickSample: 'Pick from',
  pickSampleDescription: 'Pick the colour of the top visible pixel, or only of the current layer.',
  fillSample: 'Fill bounds',
  fillSampleDescription: 'Stop the fill at pixels of the current layer, or of every visible layer.',
  fillMatch: 'Fill matches',
  fillMatchDescription: 'Treat only the exact colour as one area, or every colour of its ramp.',
  sprayRadius: 'Spray size',
  sprayRadiusDescription: 'The width of the spray disc in pixels.',
  sprayDensity: 'Spray density',
  sprayDensityDescription: 'How many dots land every tick while the button is held.',
  spraySeed: 'Lock seed',
  spraySeedDescription: 'Repeat the same scatter on every stroke.',
  gradientKind: 'Gradient kind',
  gradientKindDescription: 'Run the ramp along a line, or outwards from the start point.',
  gradientMode: 'Gradient steps',
  gradientModeDescription: 'Hard bands, or a dither between neighbouring colours.',
  gradientPattern: 'Gradient pattern',
  gradientPatternDescription: 'The pattern the dither follows. It wraps with the tiled preview, so the pattern has no seam.',
  gradientSize: 'Bayer size',
  gradientSizeDescription: 'The size of the Bayer matrix, 2, 4 or 8.',
  gradientReflect: 'Reflect',
  gradientReflectDescription: 'Run the gradient back again after it reaches the end.',
  gradientRamp: 'Gradient ramp',
  gradientRampDescription: 'The ramp to run. Automatic uses the ramp of the front colour, from the front to the back colour.',
  customBrush: 'Custom brush',
  customBrushDescription: 'Paint with a brush saved from a selection. Make one with New brush from selection.',
  noBrush: 'Square or circle tip',
  brushStencil: 'Stencil',
  brushStencilDescription: 'Paint the brush shape in the front colour instead of its own colours.',
  brushFlipX: 'Flip brush across',
  brushFlipXDescription: 'Mirror the custom brush left to right.',
  brushFlipY: 'Flip brush down',
  brushFlipYDescription: 'Mirror the custom brush top to bottom.',
  brushTurn: 'Turn brush',
  brushTurnDescription: 'Turn the custom brush in quarter turns.',
  lockTile: 'Lock to tile',
  lockTileDescription: 'Keep every stroke inside the tile, with no wrap across the edge.',
  scatterSeed: 'Lock seed',
  scatterSeedDescription: 'Repeat the same random placement every time.',
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

const INK_CHOICES: readonly OptionChoice[] = [
  { value: 'normal', label: INK_LABELS.normal, description: INK_DESCRIPTIONS.normal, icon: 'pixel-pencil' },
  { value: 'behind', label: INK_LABELS.behind, description: INK_DESCRIPTIONS.behind, icon: 'layers' },
  { value: 'lockAlpha', label: INK_LABELS.lockAlpha, description: INK_DESCRIPTIONS.lockAlpha, icon: 'lock' },
  { value: 'onlyColour', label: INK_LABELS.onlyColour, description: INK_DESCRIPTIONS.onlyColour, icon: 'pixel-eyedropper' },
  { value: 'dither', label: INK_LABELS.dither, description: INK_DESCRIPTIONS.dither, icon: 'pixel-grid' },
  { value: 'shade', label: INK_LABELS.shade, description: INK_DESCRIPTIONS.shade, icon: 'pixel-shade' },
  { value: 'lighten', label: INK_LABELS.lighten, description: INK_DESCRIPTIONS.lighten, glyph: '+' },
  { value: 'darken', label: INK_LABELS.darken, description: INK_DESCRIPTIONS.darken, glyph: '-' },
];

const SHADE_MODE_CHOICES: readonly OptionChoice[] = [
  { value: 'shade', label: 'Shade', description: 'Left lightens up the ramp, right darkens. Pick a ramp or use the ramp of each pixel.', icon: 'pixel-shade' },
  { value: 'lighten', label: 'Lighten', description: 'Move every pixel one step lighter along its own ramp.', glyph: '+' },
  { value: 'darken', label: 'Darken', description: 'Move every pixel one step darker along its own ramp.', glyph: '-' },
];

const DITHER_PATTERN_LABELS: Readonly<Record<DitherPattern, string>> = {
  checker: 'Checker, 50 percent',
  bayer: 'Bayer 4 by 4, by level',
  rows: 'Lines across',
  columns: 'Lines down',
  dots: 'Dots, 25 percent',
};

const DITHER_PATTERN_CHOICES: readonly OptionChoice[] = (Object.keys(DITHER_PATTERN_LABELS) as DitherPattern[]).map((value) => ({
  value,
  label: DITHER_PATTERN_LABELS[value],
  description: DRAWING_TEXT.ditherPatternDescription,
  icon: 'pixel-grid',
}));

const GRADIENT_PATTERN_LABELS: Readonly<Record<GradientPattern, string>> = {
  bayer: 'Bayer',
  checker: 'Checker',
  rows: 'Lines across',
  columns: 'Lines down',
};

const GRADIENT_PATTERN_CHOICES: readonly OptionChoice[] = (Object.keys(GRADIENT_PATTERN_LABELS) as GradientPattern[]).map((value) => ({
  value,
  label: GRADIENT_PATTERN_LABELS[value],
  description: DRAWING_TEXT.gradientPatternDescription,
  icon: 'pixel-grid',
}));

const PICK_SAMPLE_CHOICES: readonly OptionChoice[] = [
  { value: 'visible', label: 'All visible layers', description: 'Read the composite of every visible layer.', icon: 'layers' },
  { value: 'layer', label: 'This layer', description: 'Read only the current layer.', icon: 'pixel-sprite' },
];

const FILL_SAMPLE_CHOICES: readonly OptionChoice[] = [
  { value: 'layer', label: 'This layer', description: 'Stop at pixels of the current layer.', icon: 'pixel-sprite' },
  { value: 'visible', label: 'All visible layers', description: 'Stop at outlines drawn on any visible layer.', icon: 'layers' },
];

const FILL_MATCH_CHOICES: readonly OptionChoice[] = [
  { value: 'index', label: 'Same colour', description: 'The area is made of the exact colour you click.', icon: 'pixel-fill-bucket' },
  { value: 'ramp', label: 'Same ramp', description: 'Every colour of the clicked ramp counts as one area.', icon: 'pixel-palette' },
];

const FILL_COLOUR_CHOICES: readonly OptionChoice[] = [
  { value: 'same', label: 'Same as outline', description: 'Fill with the same colour as the outline.', icon: 'pixel-brush-square' },
  { value: 'back', label: 'Back colour', description: 'Outline in the front colour and fill in the back colour.', icon: 'pixel-shape-rect-filled' },
];

const GRADIENT_KIND_CHOICES: readonly OptionChoice[] = [
  { value: 'linear', label: 'Linear', description: 'Run the ramp along the line you drag.', icon: 'pixel-gradient' },
  { value: 'radial', label: 'Radial', description: 'Run the ramp outwards from the point where you start.', icon: 'pixel-brush-circle' },
];

const GRADIENT_MODE_CHOICES: readonly OptionChoice[] = [
  { value: 'bands', label: 'Bands', description: 'Hard bands, one per ramp colour.', icon: 'pixel-list-view' },
  { value: 'dither', label: 'Dithered', description: 'Mix neighbouring colours through a pattern.', icon: 'pixel-grid' },
];

const BAYER_SIZE_CHOICES: readonly OptionChoice[] = ['2', '4', '8'].map((value) => ({
  value,
  label: `Bayer ${value} by ${value}`,
  description: DRAWING_TEXT.gradientSizeDescription,
  glyph: value,
}));

const TURN_CHOICES: readonly OptionChoice[] = ['0', '90', '180', '270'].map((value) => ({
  value,
  label: value === '0' ? 'No turn' : `Turn ${value} degrees`,
  description: DRAWING_TEXT.brushTurnDescription,
  glyph: value === '0' ? '0' : value,
}));

export {
  BAYER_SIZE_CHOICES, DITHER_PATTERN_CHOICES, DRAWING_TEXT, FILL_COLOUR_CHOICES, FILL_MATCH_CHOICES, FILL_SAMPLE_CHOICES, GRADIENT_KIND_CHOICES, GRADIENT_MODE_CHOICES,
  GRADIENT_PATTERN_CHOICES, INK_CHOICES, PICK_SAMPLE_CHOICES, SHADE_MODE_CHOICES, TURN_CHOICES,
};
