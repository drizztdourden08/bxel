/* @layer renderer-app @kind constants */
import type { ToolId } from '../editor/tool.type';
import type { SelectVariant } from '../editor/selection/selection.type';
import type { PixelIconName } from './pixel-icon.type';

const TOOL_ICONS: Readonly<Record<ToolId, PixelIconName>> = {
  pencil: 'pixel-pencil',
  eraser: 'pixel-eraser',
  spray: 'pixel-brush-circle',
  fill: 'pixel-fill-bucket',
  gradient: 'pixel-gradient',
  picker: 'pixel-eyedropper',
  line: 'pixel-shape-line',
  curve: 'pixel-shape-curve',
  rect: 'pixel-shape-rect',
  ellipse: 'pixel-shape-ellipse',
  contour: 'pixel-select-lasso',
  polygon: 'pixel-shape-polygon',
  zoom: 'pixel-zoom',
  hand: 'pixel-hand',
  select: 'pixel-select-rect',
  move: 'pixel-move',
};

const MAP_TOOL_ICONS: Readonly<Record<ToolId, PixelIconName>> = {
  ...TOOL_ICONS,
  pencil: 'pixel-map-paint',
  eraser: 'pixel-map-erase',
  fill: 'pixel-map-fill',
  picker: 'pixel-map-pick',
  rect: 'pixel-map-rect',
};

const SHAPE_FILLED_ICONS: Readonly<Record<'rect' | 'ellipse', PixelIconName>> = {
  rect: 'pixel-shape-rect-filled',
  ellipse: 'pixel-shape-ellipse-filled',
};

const SELECT_VARIANT_ICONS: Readonly<Record<SelectVariant, PixelIconName>> = {
  rect: 'pixel-select-rect',
  ellipse: 'pixel-select-ellipse',
  lasso: 'pixel-select-lasso',
  polygon: 'pixel-select-polygon',
  wand: 'pixel-select-wand',
  colour: 'pixel-select-color',
};

export { MAP_TOOL_ICONS, SELECT_VARIANT_ICONS, SHAPE_FILLED_ICONS, TOOL_ICONS };
