/* @layer electron-main @kind constants */
import { MCP_TIMEOUT_MS } from '@bxel/mcp';
import type { ToolRouteName } from '@bxel/mcp';

const FOLDER_NAME = 'Bxel Assistant';

const QUIT_DELAY_MS = 250;

const { read, edit, saveExport } = MCP_TIMEOUT_MS;

const TOOL_TIMEOUT: Readonly<Record<ToolRouteName, number>> = {
  show_window: read,
  stop_bxel: saveExport,
  get_session: read,
  list_places: read,
  list_files: read,
  open_file: saveExport,
  close_document: edit,
  list_documents: read,
  get_document: read,
  read_palette: read,
  read_pixels: read,
  render_preview: read,
  preview_edits: edit,
  apply_edits: edit,
  undo: edit,
  save_document: saveExport,
  export_document: saveExport,
  create_document: edit,
  list_assets: read,
  split_legacy_file: saveExport,
  list_map_layers: read,
  read_map_cells: read,
};

const NATIVE_PAIR_TEXT = {
  title: 'A program wants to use Bxel',
  message: (program: string) => `${program} started Bxel without a window and wants to use it. Programs report their own name, and Bxel cannot check it.`,
  editDetail: 'Allow editing lets it change, save and export your files. Choose Not editing to decide on read only access next.',
  editAllow: 'Allow editing',
  editRefuse: 'Not editing',
  readDetail: 'Read only lets it look at documents, read pixels and preview edits.',
  readAllow: 'Allow read only',
  readRefuse: 'Deny',
} as const;

const MAIN_TEXT = {
  unknown: 'Bxel does not know this session. The helper pairs again on its own.',
  revoked: 'The owner disconnected this session. Restart the helper to ask again.',
  busy: 'Bxel did not answer in time. The edit either landed whole or not at all; read the revision.',
  disabled: 'Assistant access is off in Settings.',
  timeout: 'Approve the connection in Bxel within 25 seconds, then try again.',
  stopNotAllowed: 'Only the session that started a headless Bxel can stop it. The owner closes any other Bxel.',
  unsaved: 'Some documents have unsaved changes. Save them, or pass unsaved "recover" or "discard".',
  unnamed: 'Unnamed program',
  tray: (names: string) => `Bxel is running for ${names}`,
} as const;

export { FOLDER_NAME, MAIN_TEXT, NATIVE_PAIR_TEXT, QUIT_DELAY_MS, TOOL_TIMEOUT };
