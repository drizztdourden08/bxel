/* @layer renderer-app @kind constants */
import { announce } from '@drizztdourden08/brock-react';
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { stepBrushSizeBy } from '../editor/step-brush-size';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';
import { COMMAND_GROUP } from './keymap.constants';
import { FILLED_TOOLS, INK_TOOLS } from './drawing-command-id.constants';
import { INK_KINDS } from './ink-kinds.constants';
import { OPTION_COMMAND } from './option-command-id.constants';
import { ruled } from './ruled';

const argOf = (context: CommandContext | undefined, key: string): unknown => {
  const args = context?.args;
  return typeof args === 'object' && args !== null && key in args ? (args as Record<string, unknown>)[key] : undefined;
};

const stepBy = (context?: CommandContext): void => {
  const delta = Number(argOf(context, 'delta'));
  if (Number.isFinite(delta) && delta !== 0) stepBrushSizeBy(Math.trunc(delta));
};

const setInkByName = (context?: CommandContext): void => {
  const ink = INK_KINDS.find((kind) => kind === argOf(context, 'ink'));
  const tool = useToolStore.getState().tool;
  if (!ink || !INK_TOOLS.some((name) => name === tool)) return;
  useDrawingStore.getState().setInk(tool, ink);
  announce(`Ink ${ink}`);
};

const toggleFilled = (): void => {
  const tool = FILLED_TOOLS.find((name) => name === useToolStore.getState().tool);
  if (!tool) return;
  const drawing = useDrawingStore.getState();
  drawing.setFilled(tool, !drawing.filled[tool]);
  announce(drawing.filled[tool] ? 'Outline' : 'Filled');
};

const EXTRA_DEFS: readonly CommandDef[] = [
  { id: OPTION_COMMAND.sizeStep, label: 'Change the brush size by a step', group: COMMAND_GROUP.brush, run: stepBy },
  { id: OPTION_COMMAND.inkSet, label: 'Set the ink of the tool', group: COMMAND_GROUP.brush, run: setInkByName },
  { id: OPTION_COMMAND.shapeToggleFilled, label: 'Toggle filled shapes', group: COMMAND_GROUP.brush, run: toggleFilled },
];

const OPTION_EXTRA_COMMANDS: readonly CommandDef[] = EXTRA_DEFS.map(ruled);

export { OPTION_EXTRA_COMMANDS };
