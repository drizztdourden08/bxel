/* @layer core @kind logic */
import type { StepCommand } from '../schema/step-command.type';
import { buildApplyEditsTool } from './apply-edits-tool';
import { closeDocumentTool } from './close-document-tool';
import { createDocumentTool } from './create-document-tool';
import { exportDocumentTool } from './export-document-tool';
import { getAnimationTool } from './get-animation-tool';
import { getDocumentTool } from './get-document-tool';
import { getHistoryTool } from './get-history-tool';
import { getViewTool } from './get-view-tool';
import { getSessionTool } from './get-session-tool';
import { listAssetsTool } from './list-assets-tool';
import { listDocumentsTool } from './list-documents-tool';
import { getSettingsTool } from './get-settings-tool';
import { listCommandsTool } from './list-commands-tool';
import { listLayoutTool } from './list-layout-tool';
import { listFilesTool } from './list-files-tool';
import { listMapLayersTool } from './list-map-layers-tool';
import { listPlacesTool } from './list-places-tool';
import { openFileTool } from './open-file-tool';
import { buildPreviewEditsTool } from './preview-edits-tool';
import { readMapCellsTool } from './read-map-cells-tool';
import { readPaletteTool } from './read-palette-tool';
import { readPixelsTool } from './read-pixels-tool';
import { renderPreviewTool } from './render-preview-tool';
import { restartBxelTool } from './restart-bxel-tool';
import { runCommandTool } from './run-command-tool';
import { saveDocumentTool } from './save-document-tool';
import { setLayoutTool } from './set-layout-tool';
import { setSettingTool } from './set-setting-tool';
import { setViewTool } from './set-view-tool';
import { showWindowTool } from './show-window-tool';
import { startBxelTool } from './start-bxel-tool';
import { splitLegacyFileTool } from './split-legacy-file-tool';
import { stopBxelTool } from './stop-bxel-tool';
import type { ToolSpec } from './tool.type';
import { undoTool } from './undo-tool';

const buildTools = (commands: readonly StepCommand[]): readonly ToolSpec[] => [
  startBxelTool,
  showWindowTool,
  stopBxelTool,
  getSessionTool,
  listPlacesTool,
  listFilesTool,
  listAssetsTool,
  openFileTool,
  closeDocumentTool,
  listDocumentsTool,
  getDocumentTool,
  getAnimationTool,
  readPaletteTool,
  readPixelsTool,
  listMapLayersTool,
  readMapCellsTool,
  renderPreviewTool,
  buildPreviewEditsTool(commands),
  buildApplyEditsTool(commands),
  undoTool,
  saveDocumentTool,
  exportDocumentTool,
  createDocumentTool,
  splitLegacyFileTool,
  listCommandsTool,
  runCommandTool,
  getViewTool,
  setViewTool,
  getHistoryTool,
  listLayoutTool,
  setLayoutTool,
  getSettingsTool,
  setSettingTool,
  restartBxelTool,
];

export { buildTools };
