/* @layer core @kind constants */
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

const TOOLS_WITHOUT_SESSION: readonly string[] = [TOOL_NAME.startBxel];

export { TOOL_NAME, TOOLS_WITHOUT_SESSION };
