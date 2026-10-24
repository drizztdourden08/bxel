/* @layer renderer-app @kind logic */
import { TOOLS } from '../../../editor/tools.constants';
import type { ToolId } from '../../../editor/tool.type';
import type { SpriteMode } from '../../../stores/sprite-store.type';
import type { HintSpec } from '../../ActionHint';
import { CANVAS_HELP_TEXT, COMMON_ROWS, SHEET_ROWS, TOOL_ROWS } from '../EditorStatus.constants';

const canvasHelp = (tool: ToolId, mode: SpriteMode): HintSpec => {
  const sheet = mode === 'sheet';
  const label = TOOLS.find((each) => each.id === tool)?.label ?? tool;
  return {
    name: CANVAS_HELP_TEXT.name,
    description: sheet ? CANVAS_HELP_TEXT.sheet : CANVAS_HELP_TEXT.tool(label),
    shortcuts: [...(sheet ? SHEET_ROWS : TOOL_ROWS[tool]), ...COMMON_ROWS],
  };
};

export { canvasHelp };
