/* @layer renderer-app @kind logic */
import { pointerSupport } from '@drizztdourden08/brock-react';
import type { PointerEvent } from 'react';
import type { ClientPoint } from './canvas-tools.type';

const pointerSamples = (event: PointerEvent<HTMLElement>): readonly ClientPoint[] => {
  if (!pointerSupport().coalesced) return [event];
  const passed = event.nativeEvent.getCoalescedEvents();
  return passed.length > 0 ? passed : [event];
};

export { pointerSamples };
