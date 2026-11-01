/* @layer renderer-app @kind constants */
import type { ToolHandlers } from './assistant.type';
import { guardHandlers } from './guard-handlers';
import { applyEdits } from './tools/apply-edits';
import { closeDocument } from './tools/close-document';
import { createDocument } from './tools/create-document';
import { exportDocument } from './tools/export-document';
import { getAnimation } from './tools/get-animation';
import { getDocument } from './tools/get-document';
import { getHistory } from './tools/get-history';
import { getSettings } from './tools/get-settings';
import { getView } from './tools/get-view';
import { getSession } from './tools/get-session';
import { listCommands } from './tools/list-commands';
import { listLayout } from './tools/list-layout';
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
import { lintPixels } from './tools/lint-pixels';
import { buildRamp } from './tools/build-ramp';
import { renderPreview } from './tools/render-preview';
import { runCommand } from './tools/run-command';
import { saveDocument } from './tools/save-document';
import { setLayout } from './tools/set-layout';
import { setSetting } from './tools/set-setting';
import { setView } from './tools/set-view';
import { splitLegacyFile } from './tools/split-legacy-file';
import { undo } from './tools/undo';
import { duplicateFile } from './tools/duplicate-file';
import { exportPalette } from './tools/export-palette';
import { importFiles } from './tools/import-files';
import { importPaletteBank } from './tools/import-palette-bank';
import { createFolder } from './tools/create-folder';
import { findReferences } from './tools/find-references';
import { moveFiles } from './tools/move-files';
import { organise } from './tools/organise';
import { projectHealth } from './tools/project-health';
import { renameFile } from './tools/rename-file';
import { repairLinks } from './tools/repair-links';
import { trashFiles } from './tools/trash-files';
import { applyToolPreset } from './tools/apply-tool-preset';
import { deleteToolPreset } from './tools/delete-tool-preset';
import { listPresets } from './tools/list-presets';
import { listTools } from './tools/list-tools';
import { saveToolPreset } from './tools/save-tool-preset';
import { updateToolPreset } from './tools/update-tool-preset';


const RAW_HANDLERS: ToolHandlers = {
  get_session: getSession,
  list_places: listPlaces,
  list_files: listFiles,
  list_assets: listAssets,
  open_file: openFile,
  close_document: closeDocument,
  list_documents: listDocuments,
  get_document: getDocument,
  get_animation: getAnimation,
  read_palette: readPalette,
  read_pixels: readPixels,
  lint_pixels: lintPixels,
  build_ramp: buildRamp,
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
  list_commands: listCommands,
  run_command: runCommand,
  get_view: getView,
  set_view: setView,
  get_history: getHistory,
  list_layout: listLayout,
  set_layout: setLayout,
  get_settings: getSettings,
  set_setting: setSetting,
  find_references: findReferences,
  project_health: projectHealth,
  repair_links: repairLinks,
  organise,
  move_files: moveFiles,
  rename_file: renameFile,
  create_folder: createFolder,
  trash_files: trashFiles,
  duplicate_file: duplicateFile,
  import_files: importFiles,
  export_palette: exportPalette,
  import_palette: importPaletteBank,
  list_tools: listTools,
  list_presets: listPresets,
  apply_preset: applyToolPreset,
  save_preset: saveToolPreset,
  update_preset: updateToolPreset,
  delete_preset: deleteToolPreset,
};

const TOOL_HANDLERS: ToolHandlers = guardHandlers(RAW_HANDLERS);

export { TOOL_HANDLERS };
