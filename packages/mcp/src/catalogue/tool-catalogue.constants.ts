/* @layer core @kind constants */
import type { ToolName } from '../tools/tool.type';
import type { ToolEntry } from './catalogue.type';
import { fieldIs } from './field-is';

const read = (bundle: ToolEntry['bundle']): ToolEntry => ({ bundle, kind: 'read' });
const write = (bundle: ToolEntry['bundle']): ToolEntry => ({ bundle, kind: 'write' });

const STATE_FIELDS = ['select', 'tool', 'colours', 'symmetry', 'selection', 'mapSelection', 'dialog', 'tileset'] as const;

const setsState = (input: unknown): boolean =>
  typeof input === 'object' && input !== null && STATE_FIELDS.some((field) => Reflect.get(input, field) !== undefined);

const TOOL_CATALOGUE: Readonly<Record<ToolName, ToolEntry>> = {
  start_bxel: read('session'),
  show_window: read('session'),
  get_session: read('session'),
  stop_bxel: { bundle: 'session', kind: 'mixed', writes: fieldIs('unsaved', 'discard') },
  list_places: read('browse_files'),
  list_files: read('browse_files'),
  list_assets: read('browse_files'),
  list_documents: read('browse_files'),
  open_file: read('browse_files'),
  close_document: { bundle: 'browse_files', kind: 'mixed', writes: fieldIs('discard', true) },
  get_document: read('read_documents'),
  get_animation: read('read_documents'),
  read_palette: read('read_documents'),
  read_pixels: read('read_documents'),
  lint_pixels: read('read_documents'),
  anti_alias: read('read_documents'),
  build_ramp: read('read_documents'),
  list_map_layers: read('read_documents'),
  read_map_cells: read('read_documents'),
  render_preview: read('read_documents'),
  preview_edits: { bundle: 'read_documents', kind: 'read', routed: 'steps' },
  apply_edits: { bundle: 'edit_pixels', kind: 'write', routed: 'steps' },
  undo: write('edit_pixels'),
  save_document: write('files_saving'),
  export_document: write('files_saving'),
  create_document: write('files_saving'),
  split_legacy_file: write('files_saving'),
  list_commands: read('app_control'),
  run_command: { bundle: 'app_control', kind: 'mixed', writes: () => false, routed: 'command' },
  get_view: read('app_control'),
  set_view: { bundle: 'app_control', kind: 'mixed', writes: setsState },
  get_history: read('read_documents'),
  list_layout: read('layout'),
  set_layout: write('layout'),
  get_settings: read('settings'),
  set_setting: write('settings'),
  restart_bxel: { bundle: 'session', kind: 'write', special: 'mayRestart' },
  find_references: read('project_files'),
  project_health: read('project_files'),
  repair_links: write('project_files'),
  organise: write('project_files'),
  move_files: write('project_files'),
  rename_file: write('project_files'),
  create_folder: write('project_files'),
  trash_files: write('project_files'),
  duplicate_file: write('project_files'),
  import_files: write('project_files'),
  export_palette: write('files_saving'),
  import_palette: write('edit_pixels'),
  list_tools: read('app_control'),
  list_presets: read('app_control'),
  apply_preset: write('app_control'),
  save_preset: write('app_control'),
  update_preset: write('app_control'),
  delete_preset: write('app_control'),
};

export { TOOL_CATALOGUE };
