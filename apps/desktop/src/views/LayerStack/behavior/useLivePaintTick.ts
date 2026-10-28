/* @layer renderer-app @kind hook */
import { useLivePaintStore } from '../../../stores/useLivePaintStore';

const useLivePaintTick = (follow: boolean): number => useLivePaintStore((state) => (follow ? state.tick : 0));

export { useLivePaintTick };
