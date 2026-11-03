/* @layer renderer-app @kind logic */
import { ORIGIN_MAX } from './gradient-origin.constants';

const clampOrigin = (value: number): number => Math.min(ORIGIN_MAX, Math.max(0, Math.round(value)));

export { clampOrigin };
