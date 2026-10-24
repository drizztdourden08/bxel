/* @layer renderer-app @kind constants */
import type { CombineMode, Connectivity, FillMode, ShapeKind } from '@bxel/raster';
import type { ShortcutKey } from '@drizztdourden08/tessera';
import type { SelectVariant } from './selection/selection.type';

const SHAPE_DESCRIPTIONS: Readonly<Record<ShapeKind, string>> = {
  line: 'Draw a straight line. Hold Shift to snap the angle.',
  rect: 'Draw a rectangle. Hold Shift to keep it square.',
  ellipse: 'Draw an ellipse. Hold Shift to keep it round.',
};

const FILL_DESCRIPTIONS: Readonly<Record<FillMode, string>> = {
  contiguous: 'Fill only the pixels that touch the one you click.',
  global: 'Fill every pixel in the sprite that has the clicked colour.',
};

const CONNECTIVITY_DESCRIPTIONS: Readonly<Record<Connectivity, string>> = {
  4: 'Pixels touch when they share an edge.',
  8: 'Pixels touch when they share an edge or a corner.',
};

const SELECT_DESCRIPTIONS: Readonly<Record<SelectVariant, string>> = {
  rect: 'Drag a rectangle around the pixels.',
  ellipse: 'Drag an ellipse around the pixels.',
  lasso: 'Draw a free outline around the pixels.',
  polygon: 'Click each corner of the outline. Double click or press Enter to close it.',
  wand: 'Click a pixel to select the area of the same colour that touches it.',
  colour: 'Click a pixel to select every pixel of that colour.',
};

const MODE_DESCRIPTIONS: Readonly<Record<CombineMode, string>> = {
  replace: 'A new selection replaces the old one.',
  add: 'A new selection joins the old one.',
  subtract: 'A new selection is cut out of the old one.',
  intersect: 'Keep only where the new and old selections overlap.',
};

const MODE_KEYS: Readonly<Record<CombineMode, readonly ShortcutKey[]>> = {
  replace: [],
  add: ['shift'],
  subtract: ['alt'],
  intersect: ['shift', 'alt'],
};

export { CONNECTIVITY_DESCRIPTIONS, FILL_DESCRIPTIONS, MODE_DESCRIPTIONS, MODE_KEYS, SELECT_DESCRIPTIONS, SHAPE_DESCRIPTIONS };
