/* @layer core @kind constants */
import type { ToolName } from '../tools/tool.type';
import type { ToolEntry } from './catalogue.type';
import { fieldIs } from './field-is';

const read = (bundle: ToolEntry['bundle']): ToolEntry => ({ bundle, kind: 'read' });
const write = (bundle: ToolEntry['bundle']): ToolEntry => ({ bundle, kind: 'write' });

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
};

export { TOOL_CATALOGUE };
