/* @layer renderer-app @kind test */
import { TOOLS } from '../../src/editor/tools.constants';
import { canvasHelp } from '../../src/views/EditorStatus/behavior/canvas-help';
import {
  BACK_HINT, MIRROR_X_HINT, MIRROR_Y_HINT, ONION_HINT, PAINT_ALL_HINT, PAUSE_HINT, PLAY_HINT, TILED_HINT, TILED_HINTS, VIEW_HINTS, ZOOM_ACTUAL_HINT,
  ZOOM_FIT_HINT,
} from '../../src/views/CanvasToolbar/CanvasToolbar.constants';
import {
  BRUSH_SHAPE_HINTS, BRUSH_SIZE_HINT, EXPAND_HINT, FILL_HINTS, FILLED_HINT, NEIGHBOUR_HINTS, PIXEL_PERFECT_HINT, SELECT_MODE_HINTS, SELECT_VARIANT_HINTS,
  SHAPE_HINTS, SHRINK_HINT,
} from '../../src/views/OptionsToolbar/OptionsToolbar.constants';
import { SCOPE_HINTS } from '../../src/views/ScopeBar/ScopeBar.constants';
import { LAYER_ACTIONS, LAYER_TOGGLES } from '../../src/views/LayersPanel/LayersPanel.constants';
import { chipHint, CONFIG_HINT, HELD_CHIPS, swatchHint } from '../../src/views/PalettePanel/PalettePanel.constants';
import { SPRITE_HINTS } from '../../src/views/SpritesPanel/SpritesPanel.constants';
import { CANVAS_ACTIONS, TRANSFORM_ACTIONS, TRANSFORM_HINT } from '../../src/views/CanvasToolbar/sub-components/TransformMenu.constants';
import type { HintSpec } from '../../src/views/ActionHint';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import type { ToolDef } from '../../src/editor/tool.type';
import { MAP_TOOLS } from '../../src/tilemap/map-tools.constants';
import {
  CLEAR_CELLS_HINT, FILLED_MAP_HINT, FLAG_ACTIONS, REPLACE_ALL_HINT, REPLACE_IN_HINT, TILE_MODE_HINTS, UNIQUE_CELLS_HINT,
} from '../../src/views/OptionsToolbar/sub-components/TileOptions.constants';
import {
  ADD_LAYER_HINT, DELETE_LAYER_HINT, DOWN_LAYER_HINT, LOCKED_HINT, RENAME_LAYER_HINT, UP_LAYER_HINT, VISIBLE_HINT,
} from '../../src/views/MapLayersPanel/MapLayersPanel.constants';
import {
  ADD_HINT, DELETE_HINT, DUPLICATE_HINT, EDIT_HINT, NEW_TILEMAP_HINT, NEW_TILESET_HINT, UNIQUE_HINT,
} from '../../src/views/TilesetPanel/TilesetPanel.constants';

const toolHint = (def: ToolDef): HintSpec => ({ name: def.label, description: def.description, shortcuts: [{ command: COMMAND_ID.tool(def.id) }] });

const panelHints = (): HintSpec[] => [
  ...TOOLS.map(toolHint),
  ...MAP_TOOLS.map(toolHint),
  ...Object.values(TILE_MODE_HINTS),
  ...FLAG_ACTIONS.map((action) => action.hint),
  FILLED_MAP_HINT,
  REPLACE_IN_HINT,
  REPLACE_ALL_HINT,
  CLEAR_CELLS_HINT,
  UNIQUE_CELLS_HINT,
  ADD_LAYER_HINT,
  DELETE_LAYER_HINT,
  UP_LAYER_HINT,
  DOWN_LAYER_HINT,
  RENAME_LAYER_HINT,
  VISIBLE_HINT,
  LOCKED_HINT,
  ADD_HINT,
  DELETE_HINT,
  DUPLICATE_HINT,
  EDIT_HINT,
  NEW_TILEMAP_HINT,
  NEW_TILESET_HINT,
  UNIQUE_HINT,
  ...LAYER_ACTIONS.map((action) => action.hint),
  ...LAYER_TOGGLES.map((toggle) => toggle.hint),
  ...TRANSFORM_ACTIONS.map((action) => action.hint),
  ...CANVAS_ACTIONS.map((action) => action.hint),
  TRANSFORM_HINT,
  ...Object.values(SPRITE_HINTS),
];

const toolbarHints = (): HintSpec[] => [
  ...Object.values(BRUSH_SHAPE_HINTS),
  ...Object.values(FILL_HINTS),
  ...Object.values(NEIGHBOUR_HINTS),
  ...Object.values(SHAPE_HINTS),
  ...Object.values(SELECT_VARIANT_HINTS),
  ...Object.values(SELECT_MODE_HINTS),
  ...Object.values(SCOPE_HINTS),
  ...Object.values(VIEW_HINTS),
  ...Object.values(TILED_HINTS),
  TILED_HINT,
  ONION_HINT, PLAY_HINT, PAUSE_HINT,
  ZOOM_FIT_HINT, ZOOM_ACTUAL_HINT,
  MIRROR_X_HINT,
  MIRROR_Y_HINT,
  BACK_HINT,
  PAINT_ALL_HINT,
  BRUSH_SIZE_HINT,
  PIXEL_PERFECT_HINT,
  FILLED_HINT,
  EXPAND_HINT,
  SHRINK_HINT,
  swatchHint('3 Blue'),
  ...HELD_CHIPS.map(chipHint),
  CONFIG_HINT,
  ...TOOLS.map((tool) => canvasHelp(tool.id, 'sprite')),
  canvasHelp('pencil', 'sheet'),
  ...MAP_TOOLS.map((tool) => canvasHelp(tool.id, 'tilemap')),
];

const allHints = (): HintSpec[] => [...panelHints(), ...toolbarHints()];

export { allHints };
