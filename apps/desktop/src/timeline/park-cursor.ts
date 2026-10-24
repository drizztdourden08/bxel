/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { cursorCel } from './cursor-cel';
import type { CelMove } from './timeline.type';

const parkCursor = (by: CelMove): void => {
  const target = currentTarget();
  const key = target ? cursorCel(target, by) : null;
  if (!key) return;
  const timeline = useTimelineStore.getState();
  timeline.select(timeline.selection, key.frameId);
  useToolStore.getState().setLayer(key.layerId);
};

export { parkCursor };
