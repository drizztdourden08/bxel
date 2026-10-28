/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import { GUIDE_LABEL } from './guide.constants';
import type { GuideScope } from './guide.type';
import { runGuide } from './run-guide';
import { snapStep } from './snap-step';

const spriteGuideScope = (target: EditorTarget): GuideScope => ({
  lines: () => target.sprite.guides,
  size: () => ({ width: target.sprite.width, height: target.sprite.height }),
  step: snapStep,
  add: (axis, position) => void runGuide(GUIDE_LABEL.add, COMMAND_NAME.guideAdd, { axis, position }),
  move: (axis, from, to) => void runGuide(GUIDE_LABEL.move, COMMAND_NAME.guideMove, { axis, from, to }),
  remove: (axis, position) => void runGuide(GUIDE_LABEL.remove, COMMAND_NAME.guideRemove, { axis, position }),
  clear: () => void runGuide(GUIDE_LABEL.clear, COMMAND_NAME.guideClear, {}),
});

export { spriteGuideScope };
