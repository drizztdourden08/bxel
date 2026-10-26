/* @layer core @kind constants */
import type { ToolName } from './tool.type';

const TOOL_NAME = {
  startBxel: 'start_bxel',
  showWindow: 'show_window',
  stopBxel: 'stop_bxel',
  getSession: 'get_session',
  listPlaces: 'list_places',
  listFiles: 'list_files',
  openFile: 'open_file',
  closeDocument: 'close_document',
  listDocuments: 'list_documents',
  getDocument: 'get_document',
  readPalette: 'read_palette',
  readPixels: 'read_pixels',
  renderPreview: 'render_preview',
  previewEdits: 'preview_edits',
  applyEdits: 'apply_edits',
  undo: 'undo',
  saveDocument: 'save_document',
  exportDocument: 'export_document',
  createDocument: 'create_document',
  listAssets: 'list_assets',
  splitLegacyFile: 'split_legacy_file',
  listMapLayers: 'list_map_layers',
  readMapCells: 'read_map_cells',
  getAnimation: 'get_animation',
} as const;

const TOOL_MODE = {
  start_bxel: 'read',
  show_window: 'read',
  stop_bxel: 'read',
  get_session: 'read',
  list_places: 'read',
  list_files: 'read',
  open_file: 'read',
  close_document: 'read',
  list_documents: 'read',
  get_document: 'read',
  read_palette: 'read',
  read_pixels: 'read',
  render_preview: 'read',
  preview_edits: 'read',
  apply_edits: 'edit',
  undo: 'edit',
  save_document: 'edit',
  export_document: 'edit',
  create_document: 'edit',
  list_assets: 'read',
  split_legacy_file: 'edit',
  list_map_layers: 'read',
  read_map_cells: 'read',
  get_animation: 'read',
} as const satisfies Record<ToolName, 'read' | 'edit'>;

const TOOLS_WITHOUT_SESSION: readonly string[] = [TOOL_NAME.startBxel];

const EDIT_FLAG_TOOLS: Readonly<Partial<Record<ToolName, { readonly field: string; readonly value: unknown }>>> = {
  close_document: { field: 'discard', value: true },
  stop_bxel: { field: 'unsaved', value: 'discard' },
};

export { EDIT_FLAG_TOOLS, TOOL_MODE, TOOL_NAME, TOOLS_WITHOUT_SESSION };
