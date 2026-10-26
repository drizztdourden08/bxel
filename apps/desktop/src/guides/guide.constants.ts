/* @layer renderer-app @kind constants */
import type { GuideAxis } from './guide.type';

const GUIDE_GRAB = 3;

const GUIDE_AXES: readonly GuideAxis[] = ['x', 'y'];

const RULER_ZONE = '[data-context-menu^="canvas.ruler"]';

const GUIDE_LABEL = {
  add: 'Add guide',
  move: 'Move guide',
  remove: 'Remove guide',
  clear: 'Clear guides',
} as const;

export { GUIDE_AXES, GUIDE_GRAB, GUIDE_LABEL, RULER_ZONE };
