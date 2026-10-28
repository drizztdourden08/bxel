/* @layer core @kind constants */
import type { ToolHints } from './tool.type';

const SAFE_READ: ToolHints = { readOnly: true, destructive: false, idempotent: true };
const ACTION: ToolHints = { readOnly: false, destructive: false, idempotent: false };
const SAFE_ACTION: ToolHints = { readOnly: false, destructive: false, idempotent: true };
const DESTRUCTIVE: ToolHints = { readOnly: false, destructive: true, idempotent: false };

const TOOL_HINTS = {
  start_bxel: ACTION,
  show_window: SAFE_ACTION,
  stop_bxel: DESTRUCTIVE,
  get_session: SAFE_READ,
  list_places: SAFE_READ,
  list_files: SAFE_READ,
  open_file: SAFE_ACTION,
  close_document: DESTRUCTIVE,
  list_documents: SAFE_READ,
  get_document: SAFE_READ,
  read_palette: SAFE_READ,
  read_pixels: SAFE_READ,
  render_preview: SAFE_READ,
  preview_edits: SAFE_READ,
  apply_edits: ACTION,
  undo: ACTION,
  save_document: DESTRUCTIVE,
  export_document: DESTRUCTIVE,
  create_document: ACTION,
  list_assets: SAFE_READ,
  split_legacy_file: ACTION,
  list_map_layers: SAFE_READ,
  read_map_cells: SAFE_READ,
  get_animation: SAFE_READ,
  list_commands: SAFE_READ,
  run_command: ACTION,
  get_view: SAFE_READ,
  set_view: SAFE_ACTION,
  get_history: SAFE_READ,
  list_layout: SAFE_READ,
  set_layout: SAFE_ACTION,
  get_settings: SAFE_READ,
  set_setting: SAFE_ACTION,
  restart_bxel: DESTRUCTIVE,
} as const satisfies Record<string, ToolHints>;

export { TOOL_HINTS };
