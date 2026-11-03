/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';
import { runKeyAction } from './run-key-action';
import { timelineKeyAction } from './timeline-key-action';
import { zoneHandlesKey } from './zone-handles-key';

const keyOwner = (event: KeyboardEvent<HTMLElement>): boolean => {
  if (zoneHandlesKey(event)) return true;
  const action = timelineKeyAction(event);
  if (!action) return false;
  event.preventDefault();
  runKeyAction(action);
  return true;
};

export { keyOwner };
