/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { MOVE_KEYS } from '../TimelinePanel.constants';
import type { Side } from '../sub-components/OnionHandles.type';
import { clampOnion } from './clamp-onion';

const onionKey = (side: Side) => (event: KeyboardEvent<HTMLElement>): void => {
  const step = MOVE_KEYS[event.key] ?? 0;
  if (step === 0) return;
  event.preventDefault();
  event.stopPropagation();
  const { onion, setOnion } = useTimelineStore.getState();
  const delta = side === 'before' ? -step : step;
  setOnion(side === 'before' ? { before: clampOnion(onion.before + delta) } : { after: clampOnion(onion.after + delta) });
};

export { onionKey };
