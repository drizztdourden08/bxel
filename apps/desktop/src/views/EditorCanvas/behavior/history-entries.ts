/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { canStepHistory } from '../../../editor/can-step-history';
import { HISTORY_ITEMS } from '../../../editor/history.constants';

const historyEntries = (): readonly ContextMenuEntry[] => [
  { command: HISTORY_ITEMS.undo.command, ...unless(canStepHistory('undo'), HISTORY_ITEMS.undo.empty) },
  { command: HISTORY_ITEMS.redo.command, ...unless(canStepHistory('redo'), HISTORY_ITEMS.redo.empty) },
];

export { historyEntries };
