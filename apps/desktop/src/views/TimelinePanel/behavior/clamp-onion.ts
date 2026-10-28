/* @layer renderer-app @kind logic */
import { ONION_LIMITS } from '../../../stores/timeline-store.constants';

const clampOnion = (value: number): number => Math.min(ONION_LIMITS.frames.max, Math.max(ONION_LIMITS.frames.min, value));

export { clampOnion };
