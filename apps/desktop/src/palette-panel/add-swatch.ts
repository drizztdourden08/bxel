/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import { PANEL_LABEL, PANEL_TEXT } from './palette-panel.constants';
import type { PanelOutcome } from './palette-panel.type';
import { runPanelSteps } from './run-panel-steps';

const addSwatch = (target: EditorTarget, rgb: string): PanelOutcome => {
  const { bank } = target;
  if (bank.slots.length >= bank.cap) return { ok: false, message: PANEL_TEXT.full(bank.cap) };
  const steps = [{ name: COMMAND_NAME.swatchAdd, targets: null, options: { bankId: bank.id, rgb } }];
  return runPanelSteps({ target, label: PANEL_LABEL.add, steps, done: PANEL_TEXT.added(bank.slots.length) });
};

export { addSwatch };
