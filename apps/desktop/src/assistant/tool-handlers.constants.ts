/* @layer renderer-app @kind constants */
import type { ToolHandlers } from './assistant.type';
import { applyEdits } from './tools/apply-edits';
import { closeDocument } from './tools/close-document';
import { createDocument } from './tools/create-document';
import { exportDocument } from './tools/export-document';
import { getDocument } from './tools/get-document';
import { getSession } from './tools/get-session';
import { listDocuments } from './tools/list-documents';
import { listFiles } from './tools/list-files';
import { listPlaces } from './tools/list-places';
import { openFile } from './tools/open-file';
import { previewEdits } from './tools/preview-edits';
import { readPalette } from './tools/read-palette';
import { readPixels } from './tools/read-pixels';
import { renderPreview } from './tools/render-preview';
import { saveDocument } from './tools/save-document';
import { undo } from './tools/undo';

const TOOL_HANDLERS: ToolHandlers = {
  get_session: getSession,
  list_places: listPlaces,
  list_files: listFiles,
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
};

export { TOOL_HANDLERS };
