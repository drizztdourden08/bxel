/* @layer renderer-app @kind logic */
import type { RampStep } from '@bxel/palette';
import type { EditorTarget } from '../editor/editor.type';
import { PANEL_LABEL, PANEL_TEXT } from '../palette-panel/palette-panel.constants';
import type { PanelOutcome } from '../palette-panel/palette-panel.type';
import { runPanelSteps } from '../palette-panel/run-panel-steps';
import { RAMP_TEXT } from './palette-ramps.constants';
import { rampSteps } from './ramp-steps';

const applyRamp = (target: EditorTarget, steps: readonly RampStep[], name: string): PanelOutcome => {
  const { bank } = target;
  const added = steps.filter((step) => step.reuses === null).length;
  const free = bank.cap - bank.slots.length;
  if (steps.length < 2) return { ok: false, message: RAMP_TEXT.tooShort };
  if (added > free) return { ok: false, message: RAMP_TEXT.noRoom(added, free) };
  return runPanelSteps({ target, label: PANEL_LABEL.ramp, steps: rampSteps(bank, steps, name), done: PANEL_TEXT.ramp(name, added) });
};

export { applyRamp };
