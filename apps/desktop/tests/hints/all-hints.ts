/* @layer renderer-app @kind test */
import { TOOL_SLOTS } from '../../src/editor/tool-catalogue/tool-catalogue.constants';
import type { ToolMember, ToolSlot } from '../../src/editor/tool-catalogue/tool-catalogue.type';
import { toolIds } from '../../src/editor/tool-catalogue/tool-ids';
import { OPTION_SPECS } from '../../src/editor/tool-options/option-specs.constants';
import type { OptionSpec } from '../../src/editor/tool-options/tool-options.type';
import { canvasHelp } from '../../src/views/EditorStatus/behavior/canvas-help';
import {
  BACK_HINT, MIRROR_X_HINT, MIRROR_Y_HINT, ONION_HINT, PAINT_ALL_HINT, PAUSE_HINT, PLAY_HINT, TILED_HINT, TILED_HINTS, VIEW_HINTS, ZOOM_ACTUAL_HINT,
  ZOOM_FIT_HINT,
} from '../../src/views/CanvasToolbar/CanvasToolbar.constants';
import { SCOPE_HINTS } from '../../src/views/ScopeBar/ScopeBar.constants';
import { LAYER_BAR_HINTS, LAYER_FLAG_HINTS } from '../../src/views/LayerStack/LayerStack.constants';
import { chipHint, CONFIG_HINT, HELD_CHIPS } from '../../src/views/PalettePanel/PalettePanel.constants';
import { SPRITE_HINTS } from '../../src/views/SpritesPanel/SpritesPanel.constants';
import { CANVAS_ACTIONS, TRANSFORM_ACTIONS, TRANSFORM_HINT } from '../../src/views/CanvasToolbar/sub-components/TransformMenu.constants';
import type { HintSpec } from '../../src/views/ActionHint';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { ANIMATE_TILES_HINT, COLLISION_OVERLAY_HINT, TILE_MODE_HINTS } from '../../src/tilemap/tile-mode.constants';
import {
  ADD_HINT, DELETE_HINT, DUPLICATE_HINT, EDIT_HINT, NEW_TILEMAP_HINT, NEW_TILESET_HINT, UNIQUE_HINT,
} from '../../src/views/TilesetPanel/TilesetPanel.constants';

const toolHint = (slot: ToolSlot, member: ToolMember): HintSpec => ({
  name: member.label,
  description: member.description,
  shortcuts: [{ command: COMMAND_ID.tool(slot.tool) }],
});

const optionHint = (spec: OptionSpec): HintSpec[] => [
  { name: spec.label, description: spec.disabledReason?.() ?? spec.description, shortcuts: (spec.shortcuts ?? []).map((row) => ({ command: row.command, label: row.label })) },
  ...(spec.choices ?? []).map((choice) => ({ name: choice.label, description: choice.description })),
];

const panelHints = (): HintSpec[] => [
  ...TOOL_SLOTS.flatMap((slot) => slot.members.map((member) => toolHint(slot, member))),
  ...Object.values(TILE_MODE_HINTS),
  ...FLAG_ACTIONS.map((action) => action.hint),
  FILLED_MAP_HINT,
  REPLACE_IN_HINT,
  REPLACE_ALL_HINT,
  CLEAR_CELLS_HINT,
  UNIQUE_CELLS_HINT,
  COLLISION_OVERLAY_HINT,
  ANIMATE_TILES_HINT,
  ADD_HINT,
  DELETE_HINT,
  DUPLICATE_HINT,
  EDIT_HINT,
  NEW_TILEMAP_HINT,
  NEW_TILESET_HINT,
  UNIQUE_HINT,
  ...Object.values(LAYER_BAR_HINTS),
  ...Object.values(LAYER_FLAG_HINTS),
  ...TRANSFORM_ACTIONS.map((action) => action.hint),
  ...CANVAS_ACTIONS.map((action) => action.hint),
  TRANSFORM_HINT,
  ...Object.values(SPRITE_HINTS),
];

const toolbarHints = (): HintSpec[] => [
  ...OPTION_SPECS.flatMap(optionHint),
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
  ...HELD_CHIPS.map(chipHint),
  CONFIG_HINT,
  ...toolIds().map((tool) => canvasHelp(tool, 'sprite')),
  canvasHelp('pencil', 'sheet'),
  ...toolIds().map((tool) => canvasHelp(tool, 'tilemap')),
];

const allHints = (): HintSpec[] => [...panelHints(), ...toolbarHints()];

export { allHints };
