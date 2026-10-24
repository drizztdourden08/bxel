/* @layer renderer-app @kind constants */
import type { ToolId } from '../editor/tool.type';
import type { TileMode } from '../stores/view-store.type';

const EDITOR_SCOPE = 'editor';

const COMMAND_GROUP = {
  tools: 'Tools',
  brush: 'Brush and symmetry',
  colours: 'Colours',
  view: 'View',
  edit: 'Edit',
  layers: 'Layers',
  sheet: 'Sheet',
  help: 'Help',
} as const;

const COMMAND_ID = {
  undo: 'history.undo',
  redo: 'history.redo',
  swapColours: 'palette.swap_colors',
  colourBack: 'palette.step_back',
  colourForward: 'palette.step_forward',
  brushSmaller: 'brush.smaller',
  brushLarger: 'brush.larger',
  symmetryX: 'symmetry.toggle_x',
  symmetryY: 'symmetry.toggle_y',
  zoomIn: 'view.zoom_in',
  zoomOut: 'view.zoom_out',
  zoomFit: 'view.zoom_fit',
  zoomActual: 'view.zoom_actual',
  pixelGrid: 'view.toggle_pixel_grid',
  majorGrid: 'view.toggle_major_grid',
  tileGrid: 'view.toggle_tile_grid',
  rulers: 'view.toggle_rulers',
  tiledOff: 'view.tiled_off',
  tiledX: 'view.tiled_x',
  tiledY: 'view.tiled_y',
  tiledBoth: 'view.tiled_both',
  layerAdd: 'layer.add',
  layerDuplicate: 'layer.duplicate',
  layerMerge: 'layer.merge',
  layerFlatten: 'layer.flatten',
  layerDelete: 'layer.delete',
  layerAbove: 'layer.select_above',
  layerBelow: 'layer.select_below',
  shortcuts: 'help.shortcuts',
  tool: (tool: ToolId): string => `tool.select_${tool}`,
} as const;

const TILED_COMMAND: Readonly<Record<TileMode, string>> = {
  off: COMMAND_ID.tiledOff,
  x: COMMAND_ID.tiledX,
  y: COMMAND_ID.tiledY,
  both: COMMAND_ID.tiledBoth,
};

export { COMMAND_GROUP, COMMAND_ID, EDITOR_SCOPE, TILED_COMMAND };
