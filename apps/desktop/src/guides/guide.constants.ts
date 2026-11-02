/* @layer renderer-app @kind constants */
import type { GuideAxis } from './guide.type';

const GUIDE_GRAB = 3;

const GUIDE_SNAP_REACH = 4;

const DOUBLE_GUIDE_MS = 400;

const GUIDE_AXES: readonly GuideAxis[] = ['x', 'y'];

const RULER_ZONE = '[data-context-menu^="canvas.ruler"]';

const GUIDE_LABEL = {
  add: 'Add guide',
  move: 'Move guide',
  remove: 'Remove guide',
  clear: 'Clear guides',
} as const;

export { DOUBLE_GUIDE_MS, GUIDE_AXES, GUIDE_GRAB, GUIDE_LABEL, GUIDE_SNAP_REACH, RULER_ZONE };
