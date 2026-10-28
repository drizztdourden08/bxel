/* @layer renderer-app @kind logic */
import type { CommandStep } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import { currentBank } from './current-bank';
import { followHeld } from './follow-held';
import type { PanelOutcome } from './palette-panel.type';
import { runPanelSteps } from './run-panel-steps';

const reorderSwatches = (target: EditorTarget, label: string, step: CommandStep, done: string): PanelOutcome => {
  const before = target.bank;
  const outcome = runPanelSteps({ target, label, steps: [step], done });
  const after = currentBank(target);
  if (outcome.ok && after) followHeld(before, after);
  return outcome;
};

export { reorderSwatches };
