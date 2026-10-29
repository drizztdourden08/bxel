/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { indexAtX } from '../../../timeline/index-at-x';
import type { TrackLayout } from '../../../timeline/track-layout.type';
import type { Side } from '../sub-components/OnionHandles.type';
import { clampOnion } from './clamp-onion';

const onionDrag = (side: Side, layout: TrackLayout, current: number, last: number) => (event: PointerEvent<HTMLElement>): void => {
  if (event.buttons !== 1) return;
  const box = event.currentTarget.parentElement?.getBoundingClientRect();
  if (!box) return;
  const index = Math.min(last, Math.max(0, indexAtX(layout, event.clientX - box.left)));
  useTimelineStore.getState().setOnion(side === 'before' ? { before: clampOnion(current - index) } : { after: clampOnion(index - current) });
};

export { onionDrag };
