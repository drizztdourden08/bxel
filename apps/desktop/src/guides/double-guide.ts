/* @layer renderer-app @kind logic */
import { DOUBLE_GUIDE_MS } from './guide.constants';
import type { GuideHit, LastGuideHit } from './guide.type';

const doubleGuide = (last: LastGuideHit | null, hit: GuideHit, now: number): boolean =>
  last !== null && last.axis === hit.axis && last.position === hit.position && now - last.at <= DOUBLE_GUIDE_MS;

export { doubleGuide };
