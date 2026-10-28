/* @layer renderer-app @kind constants */
import type { ShapeKind } from '@bxel/raster';
import type { SelectVariant } from '../editor/selection/selection.type';
import type { PixelIconName } from './pixel-icon.type';

const SHAPE_KIND_ICONS: Readonly<Record<ShapeKind, PixelIconName>> = {
  line: 'pixel-shape-line',
  rect: 'pixel-shape-rect',
  ellipse: 'pixel-shape-ellipse',
};

const SELECT_VARIANT_ICONS: Readonly<Record<SelectVariant, PixelIconName>> = {
  rect: 'pixel-select-rect',
  ellipse: 'pixel-select-ellipse',
  lasso: 'pixel-select-lasso',
  polygon: 'pixel-select-polygon',
  wand: 'pixel-select-wand',
  colour: 'pixel-select-color',
};

export { SELECT_VARIANT_ICONS, SHAPE_KIND_ICONS };
