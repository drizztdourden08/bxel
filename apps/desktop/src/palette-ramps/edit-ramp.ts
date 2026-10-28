/* @layer renderer-app @kind logic */
import type { RampId, SwatchId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { EditorTarget } from '../editor/editor.type';
import { PANEL_LABEL, PANEL_TEXT } from '../palette-panel/palette-panel.constants';
import type { PanelOutcome } from '../palette-panel/palette-panel.type';
import { runPanelSteps } from '../palette-panel/run-panel-steps';
import type { RampChange } from './palette-ramps.type';

const editRamp = (target: EditorTarget, rampId: RampId, change: RampChange): PanelOutcome => {
  const ramp = target.bank.ramps.find((each) => each.id === rampId);
  if (!ramp) return { ok: false, message: '' };
  const swatches: readonly SwatchId[] | undefined = change.swatches;
  if (change.delete || (swatches !== undefined && swatches.length < 2)) {
    const steps = [{ name: PALETTE_COMMAND_NAME.rampDelete, targets: null, options: { bankId: target.bank.id, rampId } }];
    return runPanelSteps({ target, label: PANEL_LABEL.rampDelete, steps, done: PANEL_TEXT.rampDeleted(ramp.name) });
  }
  const options = { bankId: target.bank.id, rampId, ...(change.name === undefined ? {} : { name: change.name }), ...(swatches ? { swatches } : {}) };
  const steps = [{ name: PALETTE_COMMAND_NAME.rampUpdate, targets: null, options }];
  return runPanelSteps({ target, label: PANEL_LABEL.rampEdit, steps, done: PANEL_TEXT.rampChanged(change.name ?? ramp.name) });
};

export { editRamp };
