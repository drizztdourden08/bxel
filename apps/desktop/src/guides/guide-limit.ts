/* @layer renderer-app @kind logic */
import { guideLength } from './guide-length';
import { guideScope } from './guide-scope';
import type { GuideAxis } from './guide.type';

const guideLimit = (axis: GuideAxis): number => {
  const size = guideScope()?.size();
  return size ? guideLength(axis, size) : 0;
};

export { guideLimit };
