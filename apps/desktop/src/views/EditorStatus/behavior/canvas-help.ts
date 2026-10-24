/* @layer renderer-app @kind logic */
import { TOOLS } from '../../../editor/tools.constants';
import type { ToolId } from '../../../editor/tool.type';
import type { SpriteMode } from '../../../stores/sprite-store.type';
import type { TileEditMode } from '../../../stores/tilemap-store.type';
import { MAP_TOOLS } from '../../../tilemap/map-tools.constants';
import type { HintSpec } from '../../ActionHint';
import { CANVAS_HELP_TEXT, COMMON_ROWS } from '../EditorStatus.constants';
import { helpRows } from './help-rows';

const canvasHelp = (tool: ToolId, mode: SpriteMode, tileMode: TileEditMode = 'place'): HintSpec => {
  const sheet = mode === 'sheet';
  const map = mode === 'tilemap' && tileMode === 'place';
  const label = (map ? MAP_TOOLS : TOOLS).find((each) => each.id === tool)?.label ?? tool;
  const description = map ? CANVAS_HELP_TEXT.map(label) : CANVAS_HELP_TEXT.tool(label);
  return {
    name: CANVAS_HELP_TEXT.name,
    description: sheet ? CANVAS_HELP_TEXT.sheet : description,
    shortcuts: [...helpRows(tool, sheet, map), ...COMMON_ROWS],
  };
};

export { canvasHelp };
