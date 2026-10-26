/* @layer renderer-app @kind logic */
import { RULER_ZONE } from './guide.constants';
import type { GuidePoint } from './guide.type';

const overRuler = (at: GuidePoint): boolean => document.elementFromPoint(at.clientX, at.clientY)?.closest(RULER_ZONE) != null;

export { overRuler };
