/* @layer renderer-app @kind logic */
import type { SwatchId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import type { EditorTarget } from '../editor/editor.type';
import { PANEL_LABEL, PANEL_TEXT } from '../palette-panel/palette-panel.constants';
import type { PanelOutcome } from '../palette-panel/palette-panel.type';
import { runPanelSteps } from '../palette-panel/run-panel-steps';
import { byLightness } from './by-lightness';
import { RAMP_TEXT } from './palette-ramps.constants';
import { rampName } from './ramp-name';

const makeRamp = (target: EditorTarget, indices: readonly number[], sortByLightness: boolean): PanelOutcome => {
  const { bank } = target;
  const ids = indices.flatMap((index): SwatchId[] => {
    const slot = bank.slots[index];
    return slot?.kind === 'color' ? [slot.id] : [];
  });
  if (ids.length < 2) return { ok: false, message: RAMP_TEXT.tooShort };
  const name = rampName(bank);
  const swatches = sortByLightness ? byLightness(bank, ids) : ids;
  const steps = [{ name: PALETTE_COMMAND_NAME.rampAdd, targets: null, options: { bankId: bank.id, name, swatches } }];
  return runPanelSteps({ target, label: PANEL_LABEL.ramp, steps, done: PANEL_TEXT.ramp(name, 0) });
};

export { makeRamp };
