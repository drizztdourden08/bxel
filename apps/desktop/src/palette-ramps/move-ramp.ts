/* @layer renderer-app @kind logic */
import type { RampId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { PaletteTarget } from '../editor/editor.type';
import { PANEL_LABEL, PANEL_TEXT } from '../palette-panel/palette-panel.constants';
import type { PanelOutcome } from '../palette-panel/palette-panel.type';
import { runPanelSteps } from '../palette-panel/run-panel-steps';

const moveRamp = (target: PaletteTarget, rampId: RampId, toIndex: number): PanelOutcome => {
  const { ramps } = target.bank;
  const ramp = ramps.find((each) => each.id === rampId);
  if (!ramp || toIndex < 0 || toIndex >= ramps.length || ramps.indexOf(ramp) === toIndex) return { ok: false, message: '' };
  const steps = [{ name: PALETTE_COMMAND_NAME.rampMove, targets: null, options: { bankId: target.bank.id, rampId, toIndex } }];
  return runPanelSteps({ target, label: PANEL_LABEL.rampMove, steps, done: PANEL_TEXT.rampMoved(ramp.name, toIndex + 1, ramps.length) });
};

export { moveRamp };
