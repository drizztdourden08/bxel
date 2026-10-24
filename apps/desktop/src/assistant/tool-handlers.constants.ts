/* @layer renderer-app @kind constants */
import type { ToolHandlers } from './assistant.type';
import { applyEdits } from './tools/apply-edits';
import { closeDocument } from './tools/close-document';
import { createDocument } from './tools/create-document';
import { exportDocument } from './tools/export-document';
import { getDocument } from './tools/get-document';
import { getSession } from './tools/get-session';
import { listDocuments } from './tools/list-documents';
import { listAssets } from './tools/list-assets';
import { listFiles } from './tools/list-files';
import { listMapLayers } from './tools/list-map-layers';
import { listPlaces } from './tools/list-places';
import { openFile } from './tools/open-file';
import { previewEdits } from './tools/preview-edits';
import { readMapCells } from './tools/read-map-cells';
import { readPalette } from './tools/read-palette';
import { readPixels } from './tools/read-pixels';
import { renderPreview } from './tools/render-preview';
import { saveDocument } from './tools/save-document';
import { splitLegacyFile } from './tools/split-legacy-file';
import { undo } from './tools/undo';

const TOOL_HANDLERS: ToolHandlers = {
  get_session: getSession,
  list_places: listPlaces,
  list_files: listFiles,
  list_assets: listAssets,
  open_file: openFile,
  close_document: closeDocument,
  list_documents: listDocuments,
  get_document: getDocument,
  read_palette: readPalette,
  read_pixels: readPixels,
  render_preview: renderPreview,
  preview_edits: previewEdits,
  apply_edits: applyEdits,
  undo,
  save_document: saveDocument,
  export_document: exportDocument,
  create_document: createDocument,
  split_legacy_file: splitLegacyFile,
  list_map_layers: listMapLayers,
  read_map_cells: readMapCells,
};

export { TOOL_HANDLERS };
