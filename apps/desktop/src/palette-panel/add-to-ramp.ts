/* @layer renderer-app @kind logic */
import { announce, toast } from '@drizztdourden08/brock-react';
import { membershipSteps } from '../palette-ramps/membership-steps';
import { currentPaletteTarget } from './current-palette-target';
import { PANEL_LABEL, PANEL_TEXT } from './palette-panel.constants';
import { runPanelSteps } from './run-panel-steps';

const addToRamp = (index: number, rampName: string): boolean => {
  const target = currentPaletteTarget();
  const ramp = target?.bank.ramps.find((each) => each.name === rampName);
  if (!target || !ramp) return false;
  const steps = membershipSteps(target.bank, { index, from: null, to: ramp.id, copy: true });
  if (steps.length === 0) {
    announce(PANEL_TEXT.alreadyInRamp(ramp.name));
    return false;
  }
  const outcome = runPanelSteps({ target, label: PANEL_LABEL.rampEdit, steps, done: PANEL_TEXT.rampChanged(ramp.name) });
  if (outcome.ok) announce(outcome.message);
  else toast(outcome.message, { variant: 'danger' });
  return outcome.ok;
};

export { addToRamp };
