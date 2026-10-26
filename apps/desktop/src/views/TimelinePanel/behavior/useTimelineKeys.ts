/* @layer renderer-app @kind hook */
import type { KeyboardEvent } from 'react';
import { isField } from './is-field';
import { runKeyAction } from './run-key-action';
import { timelineKeyAction } from './timeline-key-action';

const useTimelineKeys = (): ((event: KeyboardEvent<HTMLElement>) => void) => (event) => {
  if (event.defaultPrevented || isField(event.target)) return;
  const action = timelineKeyAction(event);
  if (!action) return;
  event.preventDefault();
  runKeyAction(action);
};

export { useTimelineKeys };
