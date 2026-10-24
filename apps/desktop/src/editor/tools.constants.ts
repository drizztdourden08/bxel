/* @layer renderer-app @kind constants */
import type { LayerOp } from './layer-op.type';
import type { ToolDef, ToolId } from './tool.type';

const TOOLS: readonly ToolDef[] = [
  { id: 'pencil', label: 'Pencil', key: 'b' },
  { id: 'eraser', label: 'Eraser', key: 'e' },
  { id: 'fill', label: 'Fill', key: 'g' },
  { id: 'picker', label: 'Picker', key: 'i' },
];

const TOOL_BY_KEY: ReadonlyMap<string, ToolId> = new Map(TOOLS.map((tool) => [tool.key, tool.id]));

const SWAP_KEY = 'x';

const UNDO_KEY = 'z';

const REDO_KEY = 'y';

const LAYER_KEYS = {
  add: 'n',
  command: new Map<string, LayerOp>([
    ['e', 'merge'],
    ['arrowup', 'up'],
    ['arrowdown', 'down'],
  ]),
} as const;

const SECONDARY_BUTTON = 2;

const PRIMARY_BUTTON = 0;

export { LAYER_KEYS, PRIMARY_BUTTON, REDO_KEY, SECONDARY_BUTTON, SWAP_KEY, TOOL_BY_KEY, TOOLS, UNDO_KEY };
