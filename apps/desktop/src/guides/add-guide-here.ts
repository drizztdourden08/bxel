/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AxisArgs } from '../context-menu/menu-args.type';
import { currentTarget } from '../editor/current-target';
import { GUIDE_LABEL } from './guide.constants';
import { guideLength } from './guide-length';
import { runGuide } from './run-guide';
import { showGuides } from './show-guides';
import { snapGuide } from './snap-guide';

const addGuideHere = (args: Partial<AxisArgs>): void => {
  const target = currentTarget();
  if (!target || args.axis === undefined || args.position === undefined) return;
  showGuides();
  const position = snapGuide(args.position, guideLength(args.axis, target.sprite), false);
  runGuide(GUIDE_LABEL.add, COMMAND_NAME.guideAdd, { axis: args.axis, position });
};

export { addGuideHere };
