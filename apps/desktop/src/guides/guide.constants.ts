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

const GUIDE_COLOURS: readonly { name: string; colour: string }[] = [
  { name: 'Red', colour: '#ff4d6a' },
  { name: 'Blue', colour: '#4da3ff' },
  { name: 'Green', colour: '#4dd98a' },
  { name: 'Yellow', colour: '#ffd24d' },
  { name: 'Violet', colour: '#b57bff' },
];

const GUIDE_COLOUR_TEXT = {
  menu: 'Guide colour',
  reset: 'Default colour',
  none: 'Point at a guide on the ruler to colour it.',
  label: 'Colour guide',
} as const;

export { DOUBLE_GUIDE_MS, GUIDE_AXES, GUIDE_COLOUR_TEXT, GUIDE_COLOURS, GUIDE_GRAB, GUIDE_LABEL, GUIDE_SNAP_REACH, RULER_ZONE };
