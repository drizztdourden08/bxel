/* @layer renderer-app @kind hook */
import { REORDER_ITEM_SELECTOR, useMoveFocus, useReorderDrag } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { moveRamp } from '../../../palette-ramps/move-ramp';
import type { PanelModel, RampReorder } from '../PalettePanel.type';
import { reportOutcome } from './report-outcome';

const useRampReorder = (panel: PanelModel): RampReorder => {
  const listRef = useRef<HTMLElement>(null);
  const focus = useMoveFocus(listRef);
  const { ramps } = panel.target.bank;
  const move = (from: number, to: number): void => {
    const ramp = ramps[from];
    if (!ramp || panel.lock.locked) return;
    focus.expect(ramp.id);
    reportOutcome(moveRamp(panel.target, ramp.id, to));
  };
  const drag = useReorderDrag({ listRef, selector: REORDER_ITEM_SELECTOR, axis: 'vertical', onDrop: move });
  return { listRef, drag, move, total: ramps.length };
};

export { useRampReorder };
