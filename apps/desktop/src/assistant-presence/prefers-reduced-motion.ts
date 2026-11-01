/* @layer renderer-app @kind logic */
import { REDUCED_MOTION_QUERY } from './assistant-presence.constants';

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches;

export { prefersReducedMotion };
