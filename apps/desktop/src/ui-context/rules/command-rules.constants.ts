/* @layer renderer-app @kind constants */
import { always, any, canRedo, canUndo, file, hasDocument, hasFile, isolated, never, not, projectOpen } from '../predicates.constants';
import { ONLY, REASON } from '../reasons.constants';
import { rule } from '../rule';
import { family } from './family';
import type { RuleTable } from './rule-table.type';
import {
  ANY_SELECTED, CELLS_SELECTED, CLIPBOARD, DOC, DRAW, DRAW_STAGE, EDIT_STAGE, FILE, GRID_STAGE, MAP, NONE_OR_PIXEL, NOT_TILE_FILE,
  ONION, PIXEL, PIXELS_SELECTED, SHEET, TILE_FILES, TIMELINE, WRITE, ZOOM_STAGE,
} from './groups.constants';

const TOOLS: RuleTable = {
  ...family(['tool.select_pencil', 'tool.select_eraser', 'tool.select_fill', 'tool.select_shape'], DRAW_STAGE, [DRAW, WRITE], ONLY.drawing),
  ...family(['tool.select_picker', 'tool.select_select'], DRAW_STAGE, [DRAW], ONLY.drawing),
  ...family(['tool.select_move'], NONE_OR_PIXEL, [DRAW, WRITE], ONLY.pixels),
  ...family(['tool.select_zoom', 'tool.select_hand'], ZOOM_STAGE, [[hasFile, REASON.noDraw]]),
};

const BRUSH: RuleTable = {
  ...family(['brush.smaller', 'brush.larger'], NONE_OR_PIXEL, [DOC], ONLY.pixels),
  ...family(['palette.swap_colors', 'palette.swap_pairs', 'palette.step_back', 'palette.step_forward'], NONE_OR_PIXEL, [DOC], ONLY.pixels),
  ...family(['symmetry.toggle_x', 'symmetry.toggle_y', 'symmetry.axis_here', 'symmetry.axis_centre', 'symmetry.axis_remove'], PIXEL, [], ONLY.pixels),
};

const VIEW: RuleTable = {
  ...family(['view.zoom_in', 'view.zoom_out', 'view.zoom_fit', 'view.zoom_actual', 'view.zoom_to'], ZOOM_STAGE, [FILE]),
  ...family(['view.toggle_pixel_grid'], GRID_STAGE),
  ...family(['view.toggle_major_grid', 'view.toggle_tile_grid', 'view.toggle_rulers', 'ruler.set_unit'], EDIT_STAGE),
  ...family(['view.toggle_guides', 'guide.add_here', 'guide.clear', 'view.tiled_off', 'view.tiled_x', 'view.tiled_y', 'view.tiled_both'], PIXEL, [], ONLY.pixels),
  ...family(['status.copy_cursor'], any(PIXEL, MAP, SHEET)),
};

const HISTORY: RuleTable = {
  'history.undo': rule({ applies: always, needs: [[canUndo, REASON.nothingToUndo]] }),
  'history.redo': rule({ applies: always, needs: [[canRedo, REASON.nothingToRedo]] }),
};

const LAYERS: RuleTable = {
  ...family(['layer.add', 'layer.delete'], EDIT_STAGE, [WRITE]),
  ...family(['layer.select_above', 'layer.select_below', 'layer.toggle_visible', 'layer.toggle_locked'], EDIT_STAGE),
  ...family(['layer.duplicate', 'layer.merge', 'layer.flatten', 'layer.move_up', 'layer.move_down'], PIXEL, [WRITE], ONLY.pixels),
  ...family(['layer.solo'], PIXEL, [], ONLY.pixels),
};

const SELECTION: RuleTable = {
  ...family(['selection.select_all', 'selection.clear'], DRAW_STAGE, [DOC]),
  ...family(['selection.invert', 'selection.expand', 'selection.shrink'], PIXEL, [PIXELS_SELECTED], ONLY.pixels),
  ...family(['selection.copy'], NONE_OR_PIXEL, [DOC, PIXELS_SELECTED], ONLY.pixels),
  ...family(['selection.cut'], NONE_OR_PIXEL, [DOC, WRITE, PIXELS_SELECTED], ONLY.pixels),
  ...family(['selection.paste'], NONE_OR_PIXEL, [DOC, WRITE, CLIPBOARD], ONLY.pixels),
  ...family(['selection.delete'], DRAW_STAGE, [DOC, WRITE, ANY_SELECTED]),
  ...family(['selection.by_colour'], PIXEL, [], ONLY.pixels),
  ...family(['preview.apply', 'preview.cancel'], always),
};

const TRANSFORM: RuleTable = {
  ...family(['transform.flip_horizontal', 'transform.flip_vertical', 'transform.turn_clockwise'], EDIT_STAGE, [DOC, WRITE]),
  ...family(['transform.turn_counter_clockwise', 'transform.rotate', 'transform.scale'], PIXEL, [WRITE], ONLY.pixels),
  ...family(['canvas.trim', 'canvas.size'], NOT_TILE_FILE, [WRITE], 'Sprites and animations'),
  ...family(['canvas.crop_to_selection'], NOT_TILE_FILE, [WRITE, PIXELS_SELECTED], 'Sprites and animations'),
};

const SHEET_EDITS = [
  'sprite.duplicate', 'sprite.delete', 'sprite.ask_delete', 'sprite.move_earlier', 'sprite.move_later', 'sprite.rename', 'sheet.arrange_grid', 'sheet.arrange_packed',
  'sheet.arrange_manual', 'sheet.import', 'slice.add', 'slice.remove', 'sprite.rename_many', 'sprite.duplicate_named', 'sprite.move_to_folder', 'sprite.set_palette',
  'sprite.set_pivot', 'sprite.resize', 'sprite.cut_strip', 'sprite.slice', 'sprite.trim', 'sprite.flip_horizontal', 'sprite.flip_vertical', 'sprite.turn_left',
  'sprite.turn_right', 'sprite.turn_half', 'sprite.move_to_start', 'sprite.move_to_end', 'sprite.use_view_order', 'sprite.add_to_sheet', 'sprite.remove_from_sheet',
  'sprite.move_to_sheet', 'sheet.align',
];

const SHEET_VIEWS = [
  'sprite.isolate', 'sprite.compare', 'sprite.save_selection', 'sprite.sort_by_name', 'sprite.select_none', 'sprite.select_invert', 'sprite.select_unplaced',
  'sprite.select_duplicates', 'sprite.load_selection', 'sprite.drop_selection', 'sprite.select_by_trait', 'manager.clear_filters',
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
  ...family(['tilemap.add_tile', 'tilemap.duplicate_tile', 'tilemap.delete_tile'], TILE_FILES, [WRITE], ONLY.tiles),
  ...family(['tilemap.toggle_edit', 'tilemap.place_tiles', 'tilemap.edit_tile', 'tilemap.use_tile'], file('tilemap'), [], ONLY.maps),
  ...family(['tilemap.make_unique', 'tilemap.replace_selection', 'tilemap.clear_cells'], MAP, [WRITE, CELLS_SELECTED], ONLY.maps),
  ...family(['tilemap.replace_everywhere', 'tilemap.layer_up', 'tilemap.layer_down'], MAP, [WRITE], ONLY.maps),
  ...family(
    ['tilemap.flip_x', 'tilemap.flip_y', 'tilemap.turn', 'tilemap.pick_tile_here', 'tilemap.edit_tile_here', 'terrain.toggle_brush', 'animation.toggle_tiles'],
    MAP,
    [],
    ONLY.maps,
  ),
};

const WRITING = [
  'timeline.delete', 'timeline.add_frame', 'timeline.duplicate_frames', 'timeline.add_from_sprites', 'timeline.add_from_strip', 'timeline.add_from_sheet',
  'timeline.new_direction_set', 'timeline.split_to_sprites', 'timeline.delete_frames', 'timeline.move_frames_earlier', 'timeline.move_frames_later',
  'timeline.add_tag', 'timeline.set_duration', 'tag.rename', 'tag.set_direction', 'tag.set_colour', 'tag.custom_colour', 'tag.set_range', 'tag.delete',
];

const WATCHING = [
  'timeline.make_spritesheet', 'timeline.export_frames', 'timeline.select_all_frames', 'timeline.go_to_frame', 'timeline.play_from', 'timeline.focus_duration',
  'tag.play', 'tag.select_frames',
];

const TIMELINES: RuleTable = {
  ...family(WRITING, TIMELINE, [WRITE], ONLY.animations),
  ...family(WATCHING, TIMELINE, [], ONLY.animations),
  ...family(['timeline.toggle_onion'], ONION, [], ONLY.animations),
};

const PALETTES: RuleTable = {
  ...family(['palette.delete_swatch', 'palette.merge_swatch', 'palette.change_limit'], PIXEL, [DOC, WRITE], ONLY.pixels),
  ...family(['palette.copy_hex', 'palette.reveal_swatch', 'palette.use_as'], PIXEL, [], ONLY.pixels),
  ...family(['palette.pick_here'], PIXEL, [], ONLY.pixels),
  ...family(['palette.add_colour', 'palette.new_ramp', 'palette.make_ramp', 'palette.make_ramp_by_lightness', 'palette.gradient_between'], PIXEL, [DOC, WRITE], ONLY.pixels),
  ...family(['palette.remove_unused', 'palette.unite_duplicates', 'palette.sort_selection'], PIXEL, [DOC, WRITE], ONLY.pixels),
};

const FILES: RuleTable = {
  ...family(['file.open', 'file.new', 'file.import_image', 'file.import_tiled', 'help.shortcuts', 'help.demo'], always),
  ...family(['sprite.new'], always, [DOC]),
  ...family(['file.save'], always, [DOC, WRITE]),
  ...family(['file.save_as', 'file.save_all'], always, [DOC]),
  ...family(['export.open'], not(file('image')), [DOC]),
  ...family(['asset.settings'], hasDocument),
  ...family(['project.new', 'project.open', 'project.panel'], always),
  ...family(['image.import'], file('image'), [], 'Images'),
  ...family(['project.close', 'project.settings', 'project.pack'], always, [[projectOpen, REASON.noProject]]),
  ...family(['tab.close', 'tab.close_others', 'tab.close_right', 'tab.move_left', 'tab.move_right', 'asset.reveal', 'asset.copy_path'], always),
};

const COMMAND_RULES: RuleTable = {
  ...TOOLS, ...BRUSH, ...VIEW, ...HISTORY, ...LAYERS, ...SELECTION, ...TRANSFORM, ...SHEETS, ...TILES, ...TIMELINES, ...PALETTES, ...FILES,
};

export { COMMAND_RULES };
