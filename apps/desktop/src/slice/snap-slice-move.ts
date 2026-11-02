/* @layer renderer-app @kind logic */
import { guideScope } from '../guides/guide-scope';
import { snapOffset } from '../guides/snap-offset';
import { useViewStore } from '../stores/useViewStore';
import type { SliceDrag } from './slice-drag.type';

const snapSliceMove = (drag: SliceDrag, zoom: number): SliceDrag => {
  if (drag.kind !== 'move') return drag;
  const { snap, guides } = useViewStore.getState();
  const lines = snap && guides ? guideScope()?.lines() : undefined;
  if (!lines) return drag;
  const by = snapOffset(drag.origin, { x: drag.rect.x - drag.origin.x, y: drag.rect.y - drag.origin.y }, { lines, zoom });
  return { ...drag, rect: { ...drag.rect, x: drag.origin.x + by.x, y: drag.origin.y + by.y } };
};

export { snapSliceMove };
