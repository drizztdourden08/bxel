/* @layer renderer-app @kind hook */
import { useSyncExternalStore } from 'react';
import { livePaintTick, subscribeLivePaint } from '../../../editor/live-paint';

const never = (): (() => void) => () => undefined;

const zero = (): number => 0;

/** Counts the changes of the stroke being drawn, so the active layer's thumbnail follows the brush. Other rows never subscribe. */
const useLivePaintTick = (follow: boolean): number => useSyncExternalStore(follow ? subscribeLivePaint : never, follow ? livePaintTick : zero);

export { useLivePaintTick };
