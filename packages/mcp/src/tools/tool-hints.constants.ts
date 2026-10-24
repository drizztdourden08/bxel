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
} as const satisfies Record<string, ToolHints>;

export { TOOL_HINTS };
