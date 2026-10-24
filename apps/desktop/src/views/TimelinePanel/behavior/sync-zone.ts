/* @layer renderer-app @kind logic */
import type { FocusEvent } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { zoneOf } from './zone-of';

const syncZone = (event: FocusEvent<HTMLElement>): void => {
  const zone = zoneOf(event.target);
  if (zone !== null && zone !== useTimelineStore.getState().zone) useTimelineStore.getState().setZone(zone);
};

export { syncZone };
