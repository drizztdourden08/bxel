/* @layer renderer-app @kind logic */
import { currentTarget } from '../../../editor/current-target';
import { clearSelection } from '../../../editor/selection/clear-selection';
import { incomingMask } from '../../../editor/selection/incoming-mask';
import { mergeMask } from '../../../editor/selection/merge-mask';
import { setSelection } from '../../../editor/selection/set-selection';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { ActiveDrag } from './canvas-tools.type';

const finishDrag = (active: ActiveDrag): void => {
  if (active.kind === 'float') return;
  const target = currentTarget();
  const { shape, base, mode } = active;
  const clicked = shape.from.x === shape.to.x && shape.from.y === shape.to.y;
  if (!target || clicked) {
    useSelectionStore.getState().setDraft(null);
    if (clicked && mode === 'replace') clearSelection();
    return;
  }
  setSelection(target, mergeMask(base, incomingMask(shape, target.sprite), mode));
};

export { finishDrag };
