/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { RampStep } from '@bxel/palette';
import type { EditorTarget } from '../editor/editor.type';
import { PANEL_LABEL, PANEL_TEXT } from '../palette-panel/palette-panel.constants';
import type { PanelOutcome } from '../palette-panel/palette-panel.type';
import { runPanelSteps } from '../palette-panel/run-panel-steps';
import { RAMP_TEXT } from './palette-ramps.constants';
import { rampSteps } from './ramp-steps';

const applyRamp = (target: EditorTarget, steps: readonly RampStep[], name: string, raise: number | null = null): PanelOutcome => {
  const { bank } = target;
  const added = steps.filter((step) => step.reuses === null).length;
  const free = (raise ?? bank.cap) - bank.slots.length;
  if (steps.length < 2) return { ok: false, message: RAMP_TEXT.tooShort };
  if (added > free) return { ok: false, message: RAMP_TEXT.noRoom(added, free) };
  const resize = raise === null ? [] : [{ name: COMMAND_NAME.paletteResize, targets: null, options: { bankId: bank.id, cap: raise } }];
  return runPanelSteps({ target, label: PANEL_LABEL.ramp, steps: [...resize, ...rampSteps(bank, steps, name)], done: PANEL_TEXT.ramp(name, added) });
};

export { applyRamp };
