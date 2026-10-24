/* @layer core @kind logic */
import { GIF_LIMITS } from './gif-limits.constants';

const gifDelayCs = (delayMs: number): number =>
  Math.min(GIF_LIMITS.MAX_DELAY_CS, Math.max(1, Math.floor((delayMs + 5) / GIF_LIMITS.MS_PER_CS)));

export { gifDelayCs };
