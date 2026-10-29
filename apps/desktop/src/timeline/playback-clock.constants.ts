/* @layer renderer-app @kind constants */
import type { Clock } from './playback-clock.type';

const CLOCK: Clock = { elapsed: 0, last: null, shown: null };

export { CLOCK };
