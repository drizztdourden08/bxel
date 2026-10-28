/* @layer renderer-app @kind logic */
import type { AxisArgs } from '../context-menu/menu-args.type';
import { guideLength } from './guide-length';
import { guideScope } from './guide-scope';
import { showGuides } from './show-guides';
import { snapGuide } from './snap-guide';

const addGuideHere = (args: Partial<AxisArgs>): void => {
  const scope = guideScope();
  const size = scope?.size();
  if (!scope || !size || args.axis === undefined || args.position === undefined) return;
  showGuides();
  scope.add(args.axis, snapGuide(args.position, guideLength(args.axis, size), false, scope.step(args.axis)));
};

export { addGuideHere };
