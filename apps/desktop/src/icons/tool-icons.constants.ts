/* @layer renderer-app @kind constants */
import type { ShapeKind } from '@bxel/raster';
import type { ToolId } from '../editor/tool.type';
import type { SelectVariant } from '../editor/selection/selection.type';
import type { StockPixelIconName } from './pixel-icon.type';

const TOOL_ICONS: Readonly<Record<ToolId, StockPixelIconName>> = {
  pencil: 'pixel-pencil',
  eraser: 'pixel-eraser',
  fill: 'pixel-fill-bucket',
  picker: 'pixel-eyedropper',
  shape: 'pixel-shape-rect',
  zoom: 'pixel-zoom',
  hand: 'pixel-hand',
  select: 'pixel-select-rect',
  move: 'pixel-move',
};

const SHAPE_KIND_ICONS: Readonly<Record<ShapeKind, StockPixelIconName>> = {
  line: 'pixel-shape-line',
  rect: 'pixel-shape-rect',
  ellipse: 'pixel-shape-ellipse',
};

const SHAPE_FILLED_ICONS: Readonly<Record<ShapeKind, StockPixelIconName>> = {
  line: 'pixel-shape-line',
  rect: 'pixel-shape-rect-filled',
  ellipse: 'pixel-shape-ellipse-filled',
};

const SELECT_VARIANT_ICONS: Readonly<Record<SelectVariant, StockPixelIconName>> = {
  rect: 'pixel-select-rect',
  ellipse: 'pixel-select-ellipse',
  lasso: 'pixel-select-lasso',
  polygon: 'pixel-select-polygon',
  wand: 'pixel-select-wand',
  colour: 'pixel-select-color',
};

export { SELECT_VARIANT_ICONS, SHAPE_FILLED_ICONS, SHAPE_KIND_ICONS, TOOL_ICONS };
