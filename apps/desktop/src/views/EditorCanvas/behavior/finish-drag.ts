/* @layer renderer-app @kind logic */
import { currentTarget } from '../../../editor/current-target';
import { clearSelection } from '../../../editor/selection/clear-selection';
import { commitSelection } from '../../../editor/selection/commit-selection';
import { incomingMask } from '../../../editor/selection/incoming-mask';
import { isMarqueeClick } from '../../../editor/selection/is-marquee-click';
import { marqueeRule } from '../../../editor/selection/marquee-rule';
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
  const clicked = isMarqueeClick(shape, marqueeRule());
  if (!target || clicked) {
    store.setDraft(null);
    if (clicked && mode === 'replace') clearSelection();
    return;
  }
  commitSelection(target, mergeMask(base, incomingMask(shape, target.sprite, hold), mode));
};

export { finishDrag };
