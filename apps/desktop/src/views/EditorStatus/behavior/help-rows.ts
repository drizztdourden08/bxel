/* @layer renderer-app @kind logic */
import type { ToolId } from '../../../editor/tool.type';
import type { HintShortcut } from '../../ActionHint';
import { MAP_ROWS, SHEET_ROWS, TOOL_ROWS } from '../EditorStatus.constants';

const helpRows = (tool: ToolId, sheet: boolean, map: boolean): readonly HintShortcut[] => {
  if (sheet) return SHEET_ROWS;
  return map ? MAP_ROWS[tool] : TOOL_ROWS[tool];
};

export { helpRows };
