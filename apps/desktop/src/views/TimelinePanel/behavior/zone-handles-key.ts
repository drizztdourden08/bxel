/* @layer renderer-app @kind logic */
import type { KeyboardEvent } from 'react';

const zoneHandlesKey = (event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey'>): boolean =>
  event.key === 'Escape' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a');

export { zoneHandlesKey };
