/* @layer renderer-app @kind constants */
import type { ShapeKind } from '@bxel/raster';
import type { ToolId } from '../editor/tool.type';
import type { SelectVariant } from '../editor/selection/selection.type';
import type { PixelIconName } from './pixel-icon.type';

const TOOL_ICONS: Readonly<Record<ToolId, PixelIconName>> = {
  pencil: 'pencil',
  eraser: 'eraser',
  fill: 'fill',
  picker: 'picker',
  shape: 'rectangle',
  zoom: 'zoom',
  hand: 'hand',
  select: 'selectRectangle',
  move: 'move',
};

const SHAPE_KIND_ICONS: Readonly<Record<ShapeKind, PixelIconName>> = {
  line: 'line',
  rect: 'rectangle',
  ellipse: 'ellipse',
};

const SHAPE_FILLED_ICONS: Readonly<Record<ShapeKind, PixelIconName>> = {
  line: 'line',
  rect: 'rectangleFilled',
  ellipse: 'ellipseFilled',
};

const SELECT_VARIANT_ICONS: Readonly<Record<SelectVariant, PixelIconName>> = {
  rect: 'selectRectangle',
  ellipse: 'selectEllipse',
  lasso: 'lasso',
  polygon: 'selectPolygon',
  wand: 'magicWand',
  colour: 'selectColour',
};

export { SELECT_VARIANT_ICONS, SHAPE_FILLED_ICONS, SHAPE_KIND_ICONS, TOOL_ICONS };
