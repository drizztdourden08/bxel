/* @layer renderer-app @kind logic */
import type { DocumentEventKind } from '@bxel/document';
import { MAX_STEP_NAMES } from './workspace.constants';
import type { HistorySteps } from './workspace.type';

const trackSteps = (steps: HistorySteps, kind: DocumentEventKind, name: string): HistorySteps => {
  if (kind === 'commit') return { undo: [...steps.undo, name].slice(-MAX_STEP_NAMES), redo: [] };
  if (kind === 'undo') {
    const moved = steps.undo.at(-1);
    return moved === undefined ? steps : { undo: steps.undo.slice(0, -1), redo: [...steps.redo, moved] };
  }
  if (kind !== 'redo') return steps;
  const moved = steps.redo.at(-1);
  return moved === undefined ? steps : { undo: [...steps.undo, moved], redo: steps.redo.slice(0, -1) };
};

export { trackSteps };
