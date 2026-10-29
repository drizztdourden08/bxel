/* @layer renderer-app @kind logic */
import { currentTarget } from '../../../editor/current-target';
import { clearSelection } from '../../../editor/selection/clear-selection';
import { commitSelection } from '../../../editor/selection/commit-selection';
import { incomingMask } from '../../../editor/selection/incoming-mask';
import { mergeMask } from '../../../editor/selection/merge-mask';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { ActiveDrag } from './canvas-tools.type';

const finishDrag = (active: ActiveDrag): void => {
  if (active.kind === 'float') return;
  const target = currentTarget();
  const store = useSelectionStore.getState();
  if (active.kind === 'outline') {
    const moved = store.draft;
    store.setDraft(null);
    if (target && moved) commitSelection(target, moved);
    return;
  }
  const { shape, base, mode, hold } = active;
  const clicked = shape.from.x === shape.to.x && shape.from.y === shape.to.y;
  if (!target || clicked) {
    store.setDraft(null);
    if (clicked && mode === 'replace') clearSelection();
    return;
  }
  commitSelection(target, mergeMask(base, incomingMask(shape, target.sprite, hold), mode));
};

export { finishDrag };
