/* @layer renderer-app @kind constants */
import type { BundleId } from '@bxel/mcp';
import { OPTION_COMMAND, TOOL_COMMAND } from '../../keymap/option-command-id.constants';
import { OPTION_VALUE_COMMAND_IDS } from '../../keymap/option-commands.constants';
import type { CommandEffect, ManifestEntry, ManifestExtra } from './manifest.type';

const rows = (area: BundleId, effect: CommandEffect, ids: readonly string[], extra: ManifestExtra = {}): [string, ManifestEntry][] =>
  ids.map((id) => [id, { area, effect, args: extra.args ?? null, dialog: extra.dialog ?? null, refuse: extra.refuse ?? null }]);

const one = (id: string, area: BundleId, effect: CommandEffect, extra: ManifestExtra = {}): [string, ManifestEntry] => rows(area, effect, [id], extra)[0] as [string, ManifestEntry];

const OWN_HISTORY = 'Use the undo tool: it undoes only what this program changed, and get_history lists the entries.';

const VIEW_ROWS = [
  ...rows('app_control', 'show', ['view.zoom_in', 'view.zoom_out', 'view.zoom_fit', 'view.zoom_actual']),
  ...rows('app_control', 'show', ['view.toggle_pixel_grid', 'view.toggle_major_grid', 'view.toggle_tile_grid', 'view.toggle_guides', 'view.toggle_rulers']),
  ...rows('app_control', 'show', ['view.tiled_off', 'view.tiled_x', 'view.tiled_y', 'view.tiled_both']),
  one('view.zoom_to', 'app_control', 'show', { args: 'zoom' }),
  ...rows('app_control', 'show', ['help.shortcuts', 'project.panel', 'project.window', 'project.settings', 'asset.settings']),
  one('help.demo', 'app_control', 'app', { dialog: 'demo' }),
  one('status.copy_cursor', 'app_control', 'app'),
  one('ruler.set_unit', 'app_control', 'app', { args: 'unit' }),
  ...rows('app_control', 'app', ['tab.move_left', 'tab.move_right'], { args: 'tab' }),
  ...rows('app_control', 'app', ['tool.select_pencil', 'tool.select_eraser', 'tool.select_fill', 'tool.select_picker', 'tool.select_shape']),
  ...rows('app_control', 'app', ['tool.select_zoom', 'tool.select_hand', 'tool.select_select', 'tool.select_move', 'brush.smaller', 'brush.larger']),
  ...rows('app_control', 'app', OPTION_VALUE_COMMAND_IDS, { args: 'optionValue' }),
  ...rows('app_control', 'app', [OPTION_COMMAND.set, OPTION_COMMAND.reset], { args: 'optionTarget' }),
  ...rows('app_control', 'app', [OPTION_COMMAND.resetAll, OPTION_COMMAND.focus, OPTION_COMMAND.open, OPTION_COMMAND.sizeDownBy, OPTION_COMMAND.sizeUpBy]),
  ...rows('app_control', 'app', ['shape', 'select', 'fill'].map(TOOL_COMMAND.cycleBack)),
  ...rows('app_control', 'app', [1, 2, 3, 4, 5].map(TOOL_COMMAND.quickPreset)),
  ...rows('app_control', 'app', [TOOL_COMMAND.previous, TOOL_COMMAND.resetOptions]),
  one(TOOL_COMMAND.applyPreset, 'app_control', 'app', { args: 'preset' }),
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

const EDIT_ROWS = [
  one('history.undo', 'edit_pixels', 'edit', { refuse: OWN_HISTORY }),
  one('history.redo', 'edit_pixels', 'edit', { refuse: OWN_HISTORY }),
  ...rows('edit_pixels', 'app', ['selection.select_all', 'selection.clear', 'selection.invert', 'selection.expand', 'selection.shrink']),
  one('selection.by_colour', 'edit_pixels', 'app', { args: 'byColour' }),
  ...rows('edit_pixels', 'app', ['selection.copy']),
  ...rows('edit_pixels', 'edit', ['selection.cut', 'selection.paste', 'selection.delete', 'preview.apply']),
  one('preview.cancel', 'edit_pixels', 'app'),
  ...rows('edit_pixels', 'edit', ['transform.flip_horizontal', 'transform.flip_vertical', 'transform.turn_clockwise', 'transform.turn_counter_clockwise']),
  one('transform.rotate', 'edit_pixels', 'edit', { args: 'rotate', dialog: 'rotate' }),
  one('transform.scale', 'edit_pixels', 'edit', { args: 'scale', dialog: 'scale' }),
  ...rows('edit_pixels', 'edit', ['canvas.crop_to_selection', 'canvas.trim']),
  one('canvas.size', 'edit_pixels', 'edit', { args: 'canvasSize', dialog: 'canvas_size' }),
  ...rows('edit_pixels', 'edit', ['layer.add', 'layer.duplicate', 'layer.merge', 'layer.flatten', 'layer.delete']),
  ...rows('edit_pixels', 'app', ['layer.select_above', 'layer.select_below']),
  ...rows('edit_pixels', 'edit', ['layer.toggle_visible', 'layer.toggle_locked', 'layer.solo', 'layer.move_up', 'layer.move_down', 'layer.move_top', 'layer.move_bottom', 'layer.show_all', 'layer.hide_others', 'layer.lock_others', 'layer.unlock_all'], { args: 'layer' }),
  ...rows('edit_pixels', 'edit', ['layer.set_lock'], { args: 'layerLock' }),
  ...rows('edit_pixels', 'edit', ['layer.set_colour'], { args: 'layerColour' }),
  one('palette.delete_swatch', 'edit_pixels', 'edit', { args: 'deleteSwatch', dialog: 'palette_delete' }),
  one('palette.merge_swatch', 'edit_pixels', 'edit', { args: 'mergeSwatch', dialog: 'palette_merge' }),
  one('palette.change_limit', 'edit_pixels', 'edit', { args: 'colourLimit', dialog: 'palette_limit' }),
  ...rows('edit_pixels', 'edit', ['palette.add_colour', 'palette.make_ramp', 'palette.make_ramp_by_lightness', 'palette.sort_selection']),
  one('palette.new_ramp', 'edit_pixels', 'edit', { args: 'swatch', dialog: 'ramp_builder' }),
  one('palette.gradient_between', 'edit_pixels', 'edit', { dialog: 'palette_gradient' }),
  one('palette.remove_unused', 'edit_pixels', 'edit', { dialog: 'palette_remove_unused' }),
  one('palette.unite_duplicates', 'edit_pixels', 'edit', { dialog: 'palette_unite' }),
  one('guide.add_here', 'edit_pixels', 'edit', { args: 'axis' }),
  one('guide.clear', 'edit_pixels', 'edit'),
];

const SHEET_ROWS = [
  ...rows('sheets_sprites', 'edit', ['frame.duplicate', 'sprite.duplicate', 'sprite.delete', 'sprite.move_earlier', 'sprite.move_later']),
  one('sprite.ask_delete', 'sheets_sprites', 'edit', { dialog: 'confirm' }),
  one('sprite.rename', 'sheets_sprites', 'app', { dialog: 'rename' }),
  ...rows('sheets_sprites', 'edit', ['sheet.arrange_grid', 'sheet.arrange_packed', 'sheet.arrange_manual', 'slice.add', 'slice.remove']),
  one('sheet.import', 'sheets_sprites', 'edit', { dialog: 'slice_grid' }),
  ...rows('sheets_sprites', 'edit', ['sprite.rename_many', 'sprite.duplicate_named', 'sprite.move_to_folder', 'sprite.set_palette'], { dialog: 'manager' }),
  ...rows('sheets_sprites', 'edit', ['sprite.set_pivot', 'sprite.resize', 'sprite.make_animation', 'sprite.cut_strip', 'sprite.slice'], { dialog: 'manager' }),
  one('sprite.compare', 'sheets_sprites', 'show', { dialog: 'manager' }),
  one('sprite.save_selection', 'sheets_sprites', 'app', { dialog: 'manager' }),
  ...rows('sheets_sprites', 'edit', ['sprite.trim', 'sprite.flip_horizontal', 'sprite.flip_vertical', 'sprite.turn_left', 'sprite.turn_right', 'sprite.turn_half']),
  ...rows('sheets_sprites', 'edit', ['sprite.move_to_start', 'sprite.move_to_end', 'sprite.sort_by_name', 'sprite.use_view_order']),
  ...rows('sheets_sprites', 'edit', ['sprite.add_to_sheet', 'sprite.remove_from_sheet']),
  one('sprite.move_to_sheet', 'sheets_sprites', 'edit', { args: 'sheet' }),
  one('sheet.align', 'sheets_sprites', 'edit', { args: 'align' }),
  ...rows('sheets_sprites', 'app', ['sprite.select_none', 'sprite.select_invert', 'sprite.select_unplaced', 'manager.clear_filters']),
  one('sprite.select_duplicates', 'sheets_sprites', 'app', { args: 'flipped' }),
  one('sprite.load_selection', 'sheets_sprites', 'app', { args: 'name' }),
  one('sprite.drop_selection', 'sheets_sprites', 'app', { args: 'name' }),
  one('sprite.select_by_trait', 'sheets_sprites', 'app', { args: 'trait' }),
];

const TIMELINE_ROWS = [
  ...rows('animation', 'edit', ['timeline.add_frame', 'timeline.duplicate_frames', 'timeline.split_to_sprites', 'timeline.make_spritesheet', 'timeline.delete_frames']),
  ...rows('animation', 'edit', ['timeline.move_frames_earlier', 'timeline.move_frames_later', 'timeline.add_tag']),
  ...rows('animation', 'edit', ['timeline.add_from_sprites', 'timeline.add_from_strip', 'timeline.add_from_sheet', 'timeline.new_direction_set'], { dialog: 'timeline' }),
  one('timeline.export_frames', 'animation', 'file', { dialog: 'export' }),
  one('timeline.select_all_frames', 'animation', 'app'),
  one('timeline.go_to_frame', 'animation', 'show', { args: 'frame' }),
  one('timeline.play_from', 'animation', 'show', { args: 'frame' }),
  one('timeline.set_duration', 'animation', 'edit', { args: 'duration' }),
  one('timeline.focus_duration', 'animation', 'app'),
  one('timeline.toggle_onion', 'animation', 'show'),
  ...rows('animation', 'show', ['tag.play'], { args: 'tag' }),
  ...rows('animation', 'app', ['tag.select_frames', 'tag.rename', 'tag.custom_colour'], { args: 'tag' }),
  ...rows('animation', 'edit', ['tag.set_direction', 'tag.set_colour', 'tag.set_range', 'tag.delete'], { args: 'tag' }),
];

const TILEMAP_ROWS = [
  ...rows('tilemaps', 'edit', ['tilemap.new_tileset', 'tilemap.new_tilemap'], { dialog: 'tilemap_new' }),
  ...rows('tilemaps', 'edit', ['tilemap.add_tile', 'tilemap.duplicate_tile', 'tilemap.make_unique', 'tilemap.replace_selection', 'tilemap.replace_everywhere']),
  ...rows('tilemaps', 'edit', ['tilemap.clear_cells', 'tilemap.flip_x', 'tilemap.flip_y', 'tilemap.turn', 'tilemap.layer_up', 'tilemap.layer_down']),
  one('tilemap.delete_tile', 'tilemaps', 'edit', { dialog: 'confirm' }),
  ...rows('tilemaps', 'app', ['tilemap.toggle_edit', 'tilemap.place_tiles', 'tilemap.edit_tile', 'terrain.toggle_brush']),
  one('collision.toggle_overlay', 'tilemaps', 'show'),
  one('animation.toggle_tiles', 'tilemaps', 'show'),
  one('tilemap.use_tile', 'tilemaps', 'app', { args: 'tile' }),
  one('tilemap.pick_tile_here', 'tilemaps', 'app', { args: 'pixel' }),
  one('tilemap.edit_tile_here', 'tilemaps', 'app', { args: 'pixel' }),
  one('timeline.delete', 'animation', 'edit'),
];

const FILE_ROWS = [
  ...rows('files_saving', 'file', ['file.save', 'file.save_all']),
  one('file.save_as', 'files_saving', 'file', { dialog: 'save_as' }),
  one('export.open', 'files_saving', 'file', { dialog: 'export' }),
  one('image.import', 'files_saving', 'file', { dialog: 'image_import' }),
  ...rows('files_saving', 'file', ['file.open', 'file.new', 'sprite.new', 'file.import_image', 'file.import_tiled'], { dialog: 'file' }),
  ...rows('files_saving', 'file', ['project.new', 'project.open', 'project.close', 'project.pack'], { dialog: 'project' }),
  ...rows('files_saving', 'file', ['tab.close', 'tab.close_others', 'tab.close_right'], { args: 'tab' }),
  ...rows('app_control', 'show', ['asset.reveal'], { args: 'path' }),
  one('asset.copy_path', 'app_control', 'app', { args: 'path' }),
];

const MANIFEST: Readonly<Record<string, ManifestEntry>> = Object.fromEntries([...VIEW_ROWS, ...EDIT_ROWS, ...SHEET_ROWS, ...TIMELINE_ROWS, ...TILEMAP_ROWS, ...FILE_ROWS]);

export { MANIFEST };
