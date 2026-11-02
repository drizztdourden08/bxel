/* @layer renderer-app @kind logic */
import { guideLength } from './guide-length';
import { guideScope } from './guide-scope';
import type { GuideEdit } from './guide.type';
import { showGuides } from './show-guides';
import { snapGuide } from './snap-guide';

const applyGuide = ({ axis, from, to }: GuideEdit): boolean => {
  const scope = guideScope();
  const size = scope?.size();
  if (!scope || !size || !Number.isFinite(to)) return false;
  const next = snapGuide(to, guideLength(axis, size), false);
  if (next === from || (scope.lines()?.[axis] ?? []).includes(next)) return false;
  showGuides();
  if (from === null) scope.add(axis, next);
  else scope.move(axis, from, next);
  return true;
};

export { applyGuide };
