/* @layer renderer-app @kind logic */
import { pointerSupport } from '@drizztdourden08/brock-react';
import type { PointerEvent } from 'react';

const penPressure = (event: PointerEvent<HTMLElement>): number => {
  if (!pointerSupport().pressure || event.pointerType !== 'pen') return 1;
  return Math.min(1, Math.max(0, event.pressure));
};

export { penPressure };
