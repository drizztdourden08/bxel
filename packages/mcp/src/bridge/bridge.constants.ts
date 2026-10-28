/* @layer core @kind constants */
import type { ToolRouteName } from './bridge.type';

const CONTRACT_VERSION = 1;

const MCP_ROUTE = {
  hello: 'bxel:mcp:hello',
  bye: 'bxel:mcp:bye',
  showWindow: 'bxel:mcp:show_window',
  stopBxel: 'bxel:mcp:stop_bxel',
  getSession: 'bxel:mcp:get_session',
  listPlaces: 'bxel:mcp:list_places',
  listFiles: 'bxel:mcp:list_files',
  openFile: 'bxel:mcp:open_file',
  closeDocument: 'bxel:mcp:close_document',
  listDocuments: 'bxel:mcp:list_documents',
  getDocument: 'bxel:mcp:get_document',
  readPalette: 'bxel:mcp:read_palette',
  readPixels: 'bxel:mcp:read_pixels',
  renderPreview: 'bxel:mcp:render_preview',
  previewEdits: 'bxel:mcp:preview_edits',
  applyEdits: 'bxel:mcp:apply_edits',
  undo: 'bxel:mcp:undo',
  saveDocument: 'bxel:mcp:save_document',
  exportDocument: 'bxel:mcp:export_document',
  createDocument: 'bxel:mcp:create_document',
  listAssets: 'bxel:mcp:list_assets',
  splitLegacyFile: 'bxel:mcp:split_legacy_file',
  listMapLayers: 'bxel:mcp:list_map_layers',
  readMapCells: 'bxel:mcp:read_map_cells',
  getAnimation: 'bxel:mcp:get_animation',
  listCommands: 'bxel:mcp:list_commands',
  runCommand: 'bxel:mcp:run_command',
  getView: 'bxel:mcp:get_view',
  setView: 'bxel:mcp:set_view',
  getHistory: 'bxel:mcp:get_history',
  listLayout: 'bxel:mcp:list_layout',
  setLayout: 'bxel:mcp:set_layout',
  getSettings: 'bxel:mcp:get_settings',
  setSetting: 'bxel:mcp:set_setting',
  restartBxel: 'bxel:mcp:restart_bxel',
} as const;

const MCP_EVENT = {
  grant: 'bxel:mcp:grant',
} as const;

const TOOL_ROUTE: Readonly<Record<ToolRouteName, string>> = {
  show_window: MCP_ROUTE.showWindow,
  stop_bxel: MCP_ROUTE.stopBxel,
  get_session: MCP_ROUTE.getSession,
  list_places: MCP_ROUTE.listPlaces,
  list_files: MCP_ROUTE.listFiles,
  open_file: MCP_ROUTE.openFile,
  close_document: MCP_ROUTE.closeDocument,
  list_documents: MCP_ROUTE.listDocuments,
  get_document: MCP_ROUTE.getDocument,
  read_palette: MCP_ROUTE.readPalette,
  read_pixels: MCP_ROUTE.readPixels,
  render_preview: MCP_ROUTE.renderPreview,
  preview_edits: MCP_ROUTE.previewEdits,
  apply_edits: MCP_ROUTE.applyEdits,
  undo: MCP_ROUTE.undo,
  save_document: MCP_ROUTE.saveDocument,
  export_document: MCP_ROUTE.exportDocument,
  create_document: MCP_ROUTE.createDocument,
  list_assets: MCP_ROUTE.listAssets,
  split_legacy_file: MCP_ROUTE.splitLegacyFile,
  list_map_layers: MCP_ROUTE.listMapLayers,
  read_map_cells: MCP_ROUTE.readMapCells,
  get_animation: MCP_ROUTE.getAnimation,
  list_commands: MCP_ROUTE.listCommands,
  run_command: MCP_ROUTE.runCommand,
  get_view: MCP_ROUTE.getView,
  set_view: MCP_ROUTE.setView,
  get_history: MCP_ROUTE.getHistory,
  list_layout: MCP_ROUTE.listLayout,
  set_layout: MCP_ROUTE.setLayout,
  get_settings: MCP_ROUTE.getSettings,
  set_setting: MCP_ROUTE.setSetting,
  restart_bxel: MCP_ROUTE.restartBxel,
};

const MCP_ASK = {
  pair: 'bxel:mcp:pair',
  execute: 'bxel:mcp:execute',
  undo: 'bxel:mcp:undo-ask',
  read: 'bxel:mcp:read',
  open: 'bxel:mcp:open',
  close: 'bxel:mcp:close',
  save: 'bxel:mcp:save',
  export: 'bxel:mcp:export',
  create: 'bxel:mcp:create',
  window: 'bxel:mcp:window',
} as const;

const SESSION_TOKEN_PATTERN = /^[0-9a-f]{64}$/;

export { CONTRACT_VERSION, MCP_ASK, MCP_EVENT, MCP_ROUTE, SESSION_TOKEN_PATTERN, TOOL_ROUTE };
