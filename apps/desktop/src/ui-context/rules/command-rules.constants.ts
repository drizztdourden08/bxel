/* @layer renderer-app @kind constants */
import { PALETTE_TRANSFER_COMMAND } from '../../keymap/palette-transfer-command-id.constants';
import { DRAWING_COMMAND, DRAWING_COMMAND_IDS, DRAWING_OPTION_COMMAND_IDS, OUTLINE_ACTIONS } from '../../keymap/drawing-command-id.constants';
import { always, any, canRedo, canUndo, file, hasDocument, hasFile, isolated, never, not, projectOpen } from '../predicates.constants';
import { ONLY, REASON } from '../reasons.constants';
import { rule } from '../rule';
import { family } from './family';
import type { RuleTable } from './rule-table.type';
import {
  ANY_SELECTED, CELLS_SELECTED, CLIPBOARD, DOC, DRAW, DRAW_STAGE, EDIT_STAGE, FILE, GRID_STAGE, MAP, NONE_OR_PIXEL, NOT_TILE_FILE, SELECTED_HERE,
  ONION, PALETTE_STAGE, PIXEL, PIXELS_SELECTED, RULER_STAGE, SHEET, TILE_FILES, TIMELINE, WRITE, ZOOM_STAGE,
} from './groups.constants';

const TOOLS: RuleTable = {
  ...family(['tool.select_pencil', 'tool.select_eraser', 'tool.select_fill', 'tool.select_line', 'tool.select_spray', 'tool.select_rect'], DRAW_STAGE, [DRAW, WRITE], ONLY.drawing),
  ...family(['shade', 'gradient', 'curve', 'ellipse', 'contour', 'polygon'].map((tool) => `tool.select_${tool}`), NONE_OR_PIXEL, [DRAW, WRITE], ONLY.pixels),
  ...family(['tool.select_picker', 'tool.select_select'], DRAW_STAGE, [DRAW], ONLY.drawing),
  ...family(['tool.select_move', 'tool.select_slice'], NONE_OR_PIXEL, [DRAW, WRITE], ONLY.pixels),
  ...family(['tool.select_zoom', 'tool.select_hand'], ZOOM_STAGE, [[hasFile, REASON.noDraw]]),
};

const PRESETS: RuleTable = {
  ...family(['tool.previous', 'tool.cycle_back_select'], DRAW_STAGE, [DRAW], ONLY.drawing),
  ...family(['tool.apply_preset', 'tool.save_preset', 'tool.reset_options', ...[1, 2, 3, 4, 5].map((slot) => `tool.apply_quick_preset_${slot}`)], PIXEL, [DOC], ONLY.pixels),
};

const OPTIONS: RuleTable = {
  ...family(
    [
      'brush.cycle_tip', 'brush.toggle_pixel_perfect', 'fill.toggle_area', 'fill.toggle_neighbours', 'select.set_shape',
      'select.set_mode', 'options.select.neighbours', 'options.select.sample', 'options.select.amount', 'options.pencil.size', 'options.eraser.size', ...['shade', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'].map((tool) => `options.${tool}.size`), 'options.set', 'options.reset',
      'options.reset_all',
    ],
    PIXEL,
    [DOC],
    ONLY.pixels,
  ),
  ...family(['brush.size_down_by_four', 'brush.size_up_by_four', 'brush.tip_previous', 'brush.tip_next'], NONE_OR_PIXEL, [DOC], ONLY.pixels),
  ...family(['options.focus', 'options.open'], EDIT_STAGE),
  ...family([...DRAWING_COMMAND_IDS.filter((id) => id !== DRAWING_COMMAND.brushFromSelection && !OUTLINE_ACTIONS.includes(id)), ...DRAWING_OPTION_COMMAND_IDS], PIXEL, [DOC], ONLY.pixels),
  ...family(OUTLINE_ACTIONS, PIXEL, [DOC, WRITE], ONLY.pixels),
  ...family([DRAWING_COMMAND.brushFromSelection], PIXEL, [DOC, WRITE, PIXELS_SELECTED], ONLY.pixels),
};

const BRUSH: RuleTable = {
  ...family(['brush.smaller', 'brush.larger'], any(NONE_OR_PIXEL, MAP), [DOC], ONLY.pixels),
  ...family(['palette.swap_colors', 'palette.swap_pairs', 'palette.step_back', 'palette.step_forward'], NONE_OR_PIXEL, [DOC], ONLY.pixels),
  ...family(['symmetry.toggle_x', 'symmetry.toggle_y'], any(PIXEL, MAP), [], ONLY.pixels),
  ...family(['symmetry.axis_here', 'symmetry.axis_centre', 'symmetry.axis_remove'], PIXEL, [], ONLY.pixels),
};

const ZOOM_DIGITS = [100, 200, 400, 800, 1600, 3200].map((percent) => `view.zoom_${percent}`);

const VIEW: RuleTable = {
  ...family(['view.zoom_in', 'view.zoom_out', 'view.zoom_fit', 'view.zoom_actual', 'view.zoom_to', 'view.zoom_selection', ...ZOOM_DIGITS], ZOOM_STAGE, [FILE]),
  ...family(['view.toggle_pixel_grid'], GRID_STAGE),
  ...family(['view.toggle_major_grid'], EDIT_STAGE),
  ...family(['view.toggle_tile_grid', 'view.toggle_rulers', 'ruler.set_unit', 'view.toggle_snap', 'view.toggle_guides', 'guide.add_here', 'guide.clear'], RULER_STAGE),
  ...family(['view.tiled_off', 'view.tiled_x', 'view.tiled_y', 'view.tiled_both'], PIXEL, [], ONLY.pixels),
  ...family(['status.copy_cursor'], any(PIXEL, MAP, SHEET)),
};

const HISTORY: RuleTable = {
  'history.undo': rule({ applies: always, needs: [[canUndo, REASON.nothingToUndo]] }),
  'history.redo': rule({ applies: always, needs: [[canRedo, REASON.nothingToRedo]] }),
};

const LAYERS: RuleTable = {
  ...family(['layer.add', 'layer.delete'], EDIT_STAGE, [WRITE]),
  ...family(['layer.select_above', 'layer.select_below'], EDIT_STAGE),
  ...family(
    ['layer.toggle_visible', 'layer.toggle_locked', 'layer.set_lock', 'layer.set_colour', 'layer.show_all', 'layer.hide_others', 'layer.lock_others', 'layer.unlock_all'],
    EDIT_STAGE,
    [WRITE],
  ),
  ...family(['layer.duplicate', 'layer.merge', 'layer.move_up', 'layer.move_down', 'layer.move_top', 'layer.move_bottom', 'layer.solo'], EDIT_STAGE, [WRITE]),
  ...family(['layer.flatten', 'layer.group', 'layer.ungroup', 'layer.merge_selected', 'layer.reference_add', 'layer.reference_relink'], PIXEL, [WRITE], ONLY.pixels),
  ...family(['layer.selection_to_layer', 'layer.cut_to_layer'], PIXEL, [WRITE, PIXELS_SELECTED], ONLY.pixels),
  ...family(['layer.toggle_clip', 'layer.toggle_exported'], PIXEL, [WRITE], ONLY.pixels),
  ...family(['layer.toggle_fold'], PIXEL, [], ONLY.pixels),
  ...family(['view.highlight_layer'], PIXEL, [], ONLY.pixels),
};

const SELECTION: RuleTable = {
  ...family(['selection.select_all', 'selection.clear'], DRAW_STAGE, [DOC]),
  ...family(['selection.invert'], any(PIXEL, MAP), [SELECTED_HERE], ONLY.drawing),
  ...family(['selection.expand', 'selection.shrink'], PIXEL, [PIXELS_SELECTED], ONLY.pixels),
  ...family(['selection.reselect', 'selection.save', 'selection.select_opaque', 'selection.select_by_frame'], PIXEL, [DOC], ONLY.pixels),
  ...family(['selection.border', 'selection.smooth', 'selection.to_guides'], PIXEL, [PIXELS_SELECTED], ONLY.pixels),
  ...family(
    ['selection.stroke_inside', 'selection.stroke_outside', 'selection.fill_front', 'selection.fill_back', 'selection.align_left', 'selection.align_centre', 'selection.align_right', 'selection.align_top', 'selection.align_middle', 'selection.align_bottom'],
    PIXEL,
    [WRITE, PIXELS_SELECTED],
    ONLY.pixels,
  ),
  ...family(['selection.paste_as_layer', 'selection.paste_into_selection', 'selection.paste_expand', 'selection.paste_transform', 'selection.paste_new_sprite', 'selection.paste_choose'], PIXEL, [DOC, WRITE, CLIPBOARD], ONLY.pixels),
  ...family(['selection.copy_merged'], NONE_OR_PIXEL, [DOC, PIXELS_SELECTED], ONLY.pixels),
  ...family(['selection.copy'], DRAW_STAGE, [DOC, SELECTED_HERE], ONLY.drawing),
  ...family(['selection.cut'], DRAW_STAGE, [DOC, WRITE, SELECTED_HERE], ONLY.drawing),
  ...family(['selection.paste', 'selection.paste_in_place'], DRAW_STAGE, [DOC, WRITE, CLIPBOARD], ONLY.drawing),
  ...family(['selection.delete'], DRAW_STAGE, [DOC, WRITE, ANY_SELECTED]),
  ...family(['selection.by_colour', 'view.toggle_slices'], PIXEL, [], ONLY.pixels),
  ...family(['slice.delete_selected', 'slice.properties'], PIXEL, [WRITE], ONLY.pixels),
  ...family(['preview.apply', 'preview.cancel'], always),
};

const TRANSFORM: RuleTable = {
  ...family(['transform.flip_horizontal', 'transform.flip_vertical', 'transform.turn_clockwise'], EDIT_STAGE, [DOC, WRITE]),
  ...family(['transform.turn_counter_clockwise', 'transform.turn_half', 'transform.begin', 'transform.rotate', 'transform.scale'], PIXEL, [WRITE], ONLY.pixels),
  ...family(['canvas.trim', 'canvas.size'], NOT_TILE_FILE, [WRITE], 'Sprites and animations'),
  ...family(['canvas.crop_to_selection'], NOT_TILE_FILE, [WRITE, PIXELS_SELECTED], 'Sprites and animations'),
};

const SHEET_EDITS = [
  'sprite.duplicate', 'sprite.delete', 'sprite.ask_delete', 'sprite.move_earlier', 'sprite.move_later', 'sprite.rename', 'sheet.arrange_grid', 'sheet.arrange_packed',
  'sheet.arrange_manual', 'sheet.import', 'slice.add', 'slice.remove', 'sprite.rename_many', 'sprite.duplicate_named', 'sprite.move_to_folder', 'sprite.set_palette',
  'sprite.set_pivot', 'sprite.resize', 'sprite.cut_strip', 'sprite.slice', 'sprite.trim', 'sprite.flip_horizontal', 'sprite.flip_vertical', 'sprite.turn_left',
  'sprite.turn_right', 'sprite.turn_half', 'sprite.move_to_start', 'sprite.move_to_end', 'sprite.use_view_order', 'sprite.add_to_sheet', 'sprite.remove_from_sheet',
  'sprite.move_to_sheet', 'sprite.paste_entries', 'sprite.distribute_rows', 'sprite.copy_to_sheet', 'sprite.folder_from_selection', 'sprite.make_tileset', 'sheet.align',
];

const SHEET_VIEWS = [
  'sprite.isolate', 'sprite.compare', 'sprite.save_selection', 'sprite.sort_by_name', 'sprite.select_none', 'sprite.select_invert', 'sprite.select_same_size',
  'sprite.select_same_folder', 'sprite.open_entry', 'sprite.copy_entries', 'sprite.cut_entries', 'sprite.export_selection_sheet', 'sprite.export_selection_files', 'sprite.show_in_project', 'sprite.add_from_project', 'sprite.select_duplicates', 'sprite.load_selection', 'sprite.drop_selection', 'sprite.select_by_trait', 'manager.clear_filters',
];

const SHEETS: RuleTable = {
  ...family(SHEET_EDITS, SHEET, [WRITE], ONLY.sheets),
  ...family(SHEET_VIEWS, SHEET, [], ONLY.sheets),
  ...family(['sprite.make_animation'], any(SHEET, file('sprite'), isolated), [WRITE], 'Sprites and sheets'),
  ...family(['sprite.back'], isolated, [], ONLY.sheets),
  ...family(['scope.set_broadcast'], PIXEL, [], ONLY.pixels),
  ...family(['frame.duplicate'], never),
};

const TILES: RuleTable = {
  ...family(['tilemap.new_tileset', 'tilemap.new_tilemap', 'collision.toggle_overlay'], TILE_FILES, [], ONLY.tiles),
  ...family(['tilemap.add_tile', 'tilemap.duplicate_tile', 'tilemap.delete_tile', 'tileset.animation_from_tiles'], TILE_FILES, [WRITE], ONLY.tiles),
  ...family(
    ['tileset.mode_tiles', 'tileset.mode_terrain', 'tileset.mode_collision', 'tileset.mode_data', 'tileset.mode_animation', 'tileset.focus_search'],
    TILE_FILES,
    [],
    ONLY.tiles,
  ),
  ...family(['tilemap.toggle_edit', 'tilemap.place_tiles', 'tilemap.edit_tile', 'tilemap.use_tile'], file('tilemap'), [], ONLY.maps),
  ...family(['tilemap.make_unique', 'tilemap.replace_selection', 'tilemap.clear_cells'], MAP, [WRITE, CELLS_SELECTED], ONLY.maps),
  ...family(['tilemap.select_same', 'tilemap.capture_stamp'], MAP, [CELLS_SELECTED], ONLY.maps),
  ...family(['tilemap.replace_everywhere', 'tilemap.layer_up', 'tilemap.layer_down'], MAP, [WRITE], ONLY.maps),
  ...family(
    ['tilemap.flip_x', 'tilemap.flip_y', 'tilemap.turn', 'tilemap.pick_tile_here', 'tilemap.edit_tile_here', 'terrain.toggle_brush', 'animation.toggle_tiles'],
    MAP,
    [],
    ONLY.maps,
  ),
};

const WRITING = [
  'timeline.delete', 'timeline.add_frame', 'timeline.duplicate_frames', 'timeline.add_from_sprites', 'timeline.add_from_strip', 'timeline.add_from_sheet', 'timeline.add_from_images',
  'timeline.new_direction_set', 'timeline.split_to_sprites', 'timeline.delete_frames', 'timeline.move_frames_earlier', 'timeline.move_frames_later',
  'timeline.add_tag', 'timeline.set_duration', 'tag.rename', 'tag.set_direction', 'tag.set_colour', 'tag.custom_colour', 'tag.set_range', 'tag.delete',
  'timeline.paste_frames', 'timeline.paste_linked', 'timeline.open_duration', 'timeline.move_frames_start', 'timeline.move_frames_end', 'timeline.move_frames_to',
  'timeline.reverse_frames', 'timeline.linked_copy', 'timeline.make_copy', 'timeline.move_to_own_file', 'timeline.scale_durations', 'tag.edit', 'tag.set_repeat', 'tag.set_facing',
  'tag.include_frames', 'tag.exclude_frames', 'tag.make_mirror',
];

const WATCHING = [
  'timeline.make_spritesheet', 'timeline.export_frames', 'timeline.select_all_frames', 'timeline.go_to_frame', 'timeline.play_from',
  'tag.play', 'tag.select_frames', 'timeline.copy_frames', 'timeline.cut_frames', 'timeline.select_same_sprite', 'timeline.invert_selection',
  'timeline.open_sprite', 'timeline.show_in_project', 'timeline.toggle_play_paint', 'tag.play_once',
];

const ANIMATION_VIEW = [
  'timeline.set_loop_range', 'timeline.clear_loop_range', 'timeline.set_units', 'timeline.set_zoom', 'timeline.onion_settings', 'timeline.toggle_time_mode',
  'timeline.toggle_group_facing',
];

const TIMELINES: RuleTable = {
  ...family(WRITING, TIMELINE, [WRITE], ONLY.animations),
  ...family(WATCHING, TIMELINE, [], ONLY.animations),
  ...family(ANIMATION_VIEW, file('animation'), [], ONLY.animations),
  ...family(['timeline.toggle_onion'], ONION, [], ONLY.animations),
};

const PALETTES: RuleTable = {
  ...family(['palette.delete_swatch', 'palette.merge_swatch', 'palette.change_limit'], PALETTE_STAGE, [DOC, WRITE], ONLY.swatches),
  ...family(['palette.copy_hex', 'palette.reveal_swatch', 'palette.use_as'], PALETTE_STAGE, [], ONLY.swatches),
  ...family(['palette.pick_here'], PIXEL, [], ONLY.pixels),
  ...family(['palette.add_colour', 'palette.new_ramp', 'palette.make_ramp', 'palette.make_ramp_by_lightness', 'palette.gradient_between'], PALETTE_STAGE, [DOC, WRITE], ONLY.swatches),
  ...family(['palette.remove_unused', 'palette.unite_duplicates', 'palette.sort_selection'], PALETTE_STAGE, [DOC, WRITE], ONLY.swatches),
  ...family([PALETTE_TRANSFER_COMMAND.import, PALETTE_TRANSFER_COMMAND.moveColour], PALETTE_STAGE, [DOC, WRITE], ONLY.swatches),
  ...family([PALETTE_TRANSFER_COMMAND.export, PALETTE_TRANSFER_COMMAND.copyList, PALETTE_TRANSFER_COMMAND.saveProject], PALETTE_STAGE, [DOC], ONLY.swatches),
  ...family([PALETTE_TRANSFER_COMMAND.replaceFront, PALETTE_TRANSFER_COMMAND.replaceRamp], PIXEL, [DOC, WRITE], ONLY.pixels),
  ...family([PALETTE_TRANSFER_COMMAND.previewWith, PALETTE_TRANSFER_COMMAND.previewEnd], PIXEL, [DOC], ONLY.pixels),
};

const PANEL_COMMAND_IDS = [
  'asset.open', 'asset.duplicate', 'asset.copy_for_sheet', 'asset.export', 'asset.show_users', 'asset.copy_relative_path', 'project.open_entry', 'project.new_asset',
  'project.new_folder', 'project.refresh', 'project.collapse_all', 'project.reveal_root', 'project.open_hub', 'project.unlink_folder', 'project.rename_entry',
  'project.trash_entry', 'project.duplicate_entry', 'project.select_all', 'project.new_folder_here', 'project.new_menu', 'project.find',
];

const FILES: RuleTable = {
  ...family(['file.open', 'file.new', 'file.import_image', 'file.import_tiled', 'help.shortcuts', 'help.demo'], always),
  ...family(['sprite.new'], always, [DOC]),
  ...family(['file.save'], always, [DOC, WRITE]),
  ...family(['file.save_as', 'file.save_all'], always, [DOC]),
  ...family(['export.open'], not(file('image')), [DOC]),
  ...family(['asset.settings'], hasDocument),
  ...family(['project.new', 'project.open', 'project.panel', 'project.window'], always),
  ...family(['image.import'], file('image'), [], 'Images'),
  ...family(['project.close', 'project.settings', 'project.pack', 'project.health'], always, [[projectOpen, REASON.noProject]]),
  ...family(['project.rename_file', 'project.move_files', 'project.trash_files', 'project.make_folder'], always, [[projectOpen, REASON.noProject]]),
  ...family(PANEL_COMMAND_IDS, always, [[projectOpen, REASON.noProject]]),
  ...family(['tab.close', 'tab.close_others', 'tab.close_right', 'tab.move_left', 'tab.move_right', 'asset.reveal', 'asset.copy_path'], always),
};

const COMMAND_RULES: RuleTable = {
  ...TOOLS, ...PRESETS, ...OPTIONS, ...BRUSH, ...VIEW, ...HISTORY, ...LAYERS, ...SELECTION, ...TRANSFORM, ...SHEETS, ...TILES, ...TIMELINES, ...PALETTES, ...FILES,
};

export { COMMAND_RULES, PANEL_COMMAND_IDS };
