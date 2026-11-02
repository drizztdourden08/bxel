/* @layer renderer-app @kind constants */
import { any, file, isolated, never } from '../predicates.constants';
import { ONLY } from '../reasons.constants';
import { family } from './family';
import { PIXEL, SHEET, WRITE } from './groups.constants';
import type { RuleTable } from './rule-table.type';

const SHEET_EDITS = [
  'sprite.duplicate', 'sprite.delete', 'sprite.ask_delete', 'sprite.move_earlier', 'sprite.move_later', 'sprite.rename', 'sheet.arrange_grid', 'sheet.arrange_packed',
  'sheet.arrange_manual', 'sheet.import', 'slice.add', 'slice.remove', 'sprite.rename_many', 'sprite.duplicate_named', 'sprite.move_to_folder', 'sprite.set_palette',
  'sprite.set_pivot', 'sprite.resize', 'sprite.cut_strip', 'sprite.slice', 'sprite.trim', 'sprite.flip_horizontal', 'sprite.flip_vertical', 'sprite.turn_left',
  'sprite.turn_right', 'sprite.turn_half', 'sprite.move_to_start', 'sprite.move_to_end', 'sprite.use_view_order', 'sprite.add_to_sheet', 'sprite.remove_from_sheet',
  'sprite.move_to_sheet', 'sprite.paste_entries', 'sprite.distribute_rows', 'sprite.copy_to_sheet', 'sprite.folder_from_selection', 'sprite.make_tileset', 'sheet.align',
  'sprite.copy_animation_for_sheet', 'sprite.place_animation_frames', 'sprite.rows_per_tag',
];

const SHEET_VIEWS = [
  'sprite.isolate', 'sprite.compare', 'sprite.save_selection', 'sprite.sort_by_name', 'sprite.select_none', 'sprite.select_invert', 'sprite.select_same_size',
  'sprite.select_same_folder', 'sprite.open_entry', 'sprite.open_in_timeline', 'sprite.copy_entries', 'sprite.cut_entries', 'sprite.export_selection_sheet', 'sprite.export_selection_files', 'sprite.show_in_project', 'sprite.add_from_project', 'sprite.select_visible', 'sprite.select_duplicates', 'sprite.load_selection', 'sprite.drop_selection', 'sprite.select_by_trait', 'manager.clear_filters', 'sheet.toggle_pivots',
];

const SHEETS: RuleTable = {
  ...family(SHEET_EDITS, SHEET, [WRITE], ONLY.sheets),
  ...family(SHEET_VIEWS, SHEET, [], ONLY.sheets),
  ...family(['sprite.make_animation'], any(SHEET, file('sprite'), isolated), [WRITE], 'Sprites and sheets'),
  ...family(['sprite.back'], isolated, [], ONLY.sheets),
  ...family(['scope.set_broadcast'], PIXEL, [], ONLY.pixels),
  ...family(['frame.duplicate'], never),
};

export { SHEETS };
