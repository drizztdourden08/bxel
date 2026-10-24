/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import type { CelKey } from '../stores/timeline-store.type';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { addCel } from './add-cel';
import { currentSelection } from './current-selection';
import { selectCel } from './select-cel';

const goToCel = (key: CelKey, extend = false, add = false): void => {
  const target = currentTarget();
  if (!target) return;
  const timeline = useTimelineStore.getState();
  const next = add ? addCel(target.sprite, currentSelection(target), key) : selectCel(target.sprite, timeline.selection, key, extend);
  timeline.select(next, key.frameId);
  useToolStore.getState().setLayer(key.layerId);
};

export { goToCel };
