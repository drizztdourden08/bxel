/* @layer core @kind logic */
import type { PerfectTrail } from './perfect-trail.type';

const createTrail = (): PerfectTrail => ({ kept: [], last: null });

export { createTrail };
