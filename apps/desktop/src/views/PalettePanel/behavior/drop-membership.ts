/* @layer renderer-app @kind logic */
import type { RampId } from '@bxel/document';
import type { DragEvent } from 'react';
import { PANEL_LABEL, PANEL_TEXT } from '../../../palette-panel/palette-panel.constants';
import { runPanelSteps } from '../../../palette-panel/run-panel-steps';
import { membershipSteps } from '../../../palette-ramps/membership-steps';
import { RAMP_DRAG_TYPE } from '../PalettePanel.constants';
import type { PanelModel, RampDrag } from '../PalettePanel.type';
import { reportOutcome } from './report-outcome';

const dropMembership = (panel: PanelModel, to: RampId | null, event: DragEvent<HTMLElement>): void => {
  const text = event.dataTransfer.getData(RAMP_DRAG_TYPE);
  if (text === '' || panel.lock.locked) return;
  event.preventDefault();
  const drag = JSON.parse(text) as RampDrag;
  const steps = membershipSteps(panel.target.bank, { index: drag.index, from: drag.from, to, copy: event.ctrlKey });
  if (steps.length === 0) return;
  const name = panel.target.bank.ramps.find((ramp) => ramp.id === (to ?? drag.from))?.name ?? '';
  reportOutcome(runPanelSteps({ target: panel.target, label: PANEL_LABEL.rampEdit, steps, done: PANEL_TEXT.rampChanged(name) }));
};

export { dropMembership };
