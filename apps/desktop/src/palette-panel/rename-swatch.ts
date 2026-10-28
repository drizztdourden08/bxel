/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import { PANEL_LABEL, PANEL_TEXT } from './palette-panel.constants';
import type { PanelOutcome } from './palette-panel.type';
import { runPanelSteps } from './run-panel-steps';

const renameSwatch = (target: EditorTarget, index: number, name: string): PanelOutcome => {
  const slot = target.bank.slots[index];
  const trimmed = name.trim();
  if (slot?.kind !== 'color' || trimmed === '' || trimmed === slot.name) return { ok: true, message: '' };
  const steps = [{ name: COMMAND_NAME.swatchUpdate, targets: null, options: { bankId: target.bank.id, swatchId: slot.id, name: trimmed } }];
  return runPanelSteps({ target, label: PANEL_LABEL.rename, steps, done: PANEL_TEXT.renamed(trimmed) });
};

export { renameSwatch };
