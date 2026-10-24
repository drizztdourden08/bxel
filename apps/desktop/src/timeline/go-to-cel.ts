/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import type { CelKey } from '../stores/timeline-store.type';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { selectCel } from './select-cel';

const goToCel = (key: CelKey, extend = false): void => {
  const target = currentTarget();
  if (!target) return;
  const timeline = useTimelineStore.getState();
  timeline.select(selectCel(target.sprite, timeline.selection, key, extend), key.frameId);
  useToolStore.getState().setLayer(key.layerId);
};

export { goToCel };
