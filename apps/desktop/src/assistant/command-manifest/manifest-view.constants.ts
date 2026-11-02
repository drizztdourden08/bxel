/* @layer renderer-app @kind constants */
import { OPTION_COMMAND, TOOL_COMMAND } from '../../keymap/option-command-id.constants';
import { DRAWING_COMMAND, DRAWING_COMMAND_IDS, DRAWING_TOOL_IDS, OUTLINE_ACTIONS } from '../../keymap/drawing-command-id.constants';
import { PATTERN_COMMAND } from '../../keymap/pattern-command-id.constants';
import { OPTION_VALUE_COMMAND_IDS } from '../../keymap/option-commands.constants';
import { one } from './manifest-one';
import { rows } from './manifest-rows';

const VIEW_ROWS = [
  ...rows('app_control', 'show', ['view.zoom_in', 'view.zoom_out', 'view.zoom_fit', 'view.zoom_actual', 'view.zoom_selection']),
  ...rows('app_control', 'show', ['view.zoom_100', 'view.zoom_200', 'view.zoom_400', 'view.zoom_800', 'view.zoom_1600', 'view.zoom_3200']),
  one('view.toggle_snap', 'app_control', 'app'),
  one('view.toggle_slices', 'app_control', 'app'),
  ...rows('app_control', 'show', ['view.toggle_pixel_grid', 'view.toggle_major_grid', 'view.toggle_tile_grid', 'view.toggle_iso_grid', 'view.toggle_guides', 'view.toggle_rulers']),
  ...rows('app_control', 'show', ['view.hide_overlays', 'view.toggle_mirror', 'view.toggle_loupe', 'view.background_preview', 'view.fullscreen_preview', 'view.toggle_preview', 'view.toggle_split', 'view.toggle_split_link', 'view.toggle_split_actual', 'view.lock_guides', 'view.describe_canvas', 'view.read_row']),
  one('view.centre_here', 'app_control', 'show', { args: 'pickHere' }),
  ...rows('app_control', 'show', ['view.tiled_off', 'view.tiled_x', 'view.tiled_y', 'view.tiled_both']),
  one('view.zoom_to', 'app_control', 'show', { args: 'zoom' }),
  ...rows('app_control', 'show', ['help.shortcuts', 'project.panel', 'project.window', 'project.settings', 'project.health', 'asset.settings']),
  one('help.demo', 'app_control', 'app', { dialog: 'demo' }),
  one('status.copy_cursor', 'app_control', 'app'),
  one('status.copy_index', 'app_control', 'app'),
  one('ruler.set_unit', 'app_control', 'app', { args: 'unit' }),
  ...rows('app_control', 'app', ['tab.move_left', 'tab.move_right'], { args: 'tab' }),
  ...rows('app_control', 'app', ['tool.select_pencil', 'tool.select_eraser', 'tool.select_fill', 'tool.select_picker']),
  ...rows('app_control', 'app', DRAWING_TOOL_IDS.map((tool) => `tool.select_${tool}`)),
  ...rows('app_control', 'app', DRAWING_COMMAND_IDS.filter((id) => id !== DRAWING_COMMAND.brushFromSelection && !OUTLINE_ACTIONS.includes(id))),
  ...rows('edit_pixels', 'edit', OUTLINE_ACTIONS),
  one(DRAWING_COMMAND.brushFromSelection, 'edit_pixels', 'edit'),
  one(PATTERN_COMMAND.fromSelection, 'edit_pixels', 'edit'),
  ...rows('app_control', 'app', ['tool.select_zoom', 'tool.select_hand', 'tool.select_select', 'tool.select_move', 'tool.select_slice', 'brush.smaller', 'brush.larger']),
  ...rows('app_control', 'app', OPTION_VALUE_COMMAND_IDS, { args: 'optionValue' }),
  ...rows('app_control', 'app', [OPTION_COMMAND.set, OPTION_COMMAND.reset], { args: 'optionTarget' }),
  ...rows('app_control', 'app', [OPTION_COMMAND.resetAll, OPTION_COMMAND.focus, OPTION_COMMAND.open, OPTION_COMMAND.sizeDownBy, OPTION_COMMAND.sizeUpBy, OPTION_COMMAND.tipPrevious, OPTION_COMMAND.tipNext]),
  ...rows('app_control', 'app', ['select'].map(TOOL_COMMAND.cycleBack)),
  one(TOOL_COMMAND.quickPreset, 'app_control', 'app', { args: 'quickSlot' }),
  ...rows('app_control', 'app', [TOOL_COMMAND.previous, TOOL_COMMAND.resetOptions]),
  one(TOOL_COMMAND.applyPreset, 'app_control', 'app', { args: 'preset' }),
  ...rows('edit_pixels', 'edit', [OPTION_COMMAND.sizeStep], { args: 'sizeStep' }),
  ...rows('edit_pixels', 'edit', [OPTION_COMMAND.inkSet], { args: 'inkChoice' }),
  one(OPTION_COMMAND.shapeToggleFilled, 'edit_pixels', 'edit'),
  ...rows('app_control', 'app', [TOOL_COMMAND.selectMember, TOOL_COMMAND.hideMember], { args: 'member' }),
  one(TOOL_COMMAND.savePreset, 'app_control', 'app', { dialog: 'tool_preset' }),
  ...rows('app_control', 'app', ['symmetry.toggle_x', 'symmetry.toggle_y']),
  ...rows('app_control', 'app', ['symmetry.axis_here', 'symmetry.axis_centre', 'symmetry.axis_remove'], { args: 'axis' }),
  ...rows('app_control', 'app', ['palette.swap_colors', 'palette.swap_pairs', 'palette.step_back', 'palette.step_forward']),
  one('palette.use_as', 'app_control', 'app', { args: 'swatch' }),
  one('palette.copy_hex', 'app_control', 'app', { args: 'swatch' }),
  one('palette.reveal_swatch', 'app_control', 'show', { args: 'swatch' }),
  one('palette.pick_here', 'app_control', 'app', { args: 'pickHere' }),
  ...rows('app_control', 'show', ['sprite.back']),
  ...rows('app_control', 'app', ['scope.set_broadcast', 'sprite.isolate']),
];

export { VIEW_ROWS };
