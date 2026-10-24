/* @layer renderer-app @kind hook */
import type { KeyboardEvent } from 'react';
import { isField } from './is-field';
import { runKeyAction } from './run-key-action';
import { timelineKeyAction } from './timeline-key-action';
import { zoneOf } from './zone-of';

const useTimelineKeys = () => (event: KeyboardEvent<HTMLElement>): void => {
  if (isField(event.target)) return;
  const action = timelineKeyAction(event, zoneOf(event.target));
  if (!action) return;
  event.preventDefault();
  event.stopPropagation();
  runKeyAction(action);
};

export { useTimelineKeys };
