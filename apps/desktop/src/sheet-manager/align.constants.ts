/* @layer renderer-app @kind constants */
import type { Point } from '@bxel/document';
import type { AlignBounds, AlignBox, AlignEdge, AlignMode } from './align.type';
import { middleOf } from './middle-of';

const ALIGN_AT: Readonly<Record<AlignEdge, (box: AlignBox, bounds: AlignBounds) => Point>> = {
  left: (box, bounds) => ({ x: bounds.left, y: box.y }),
  center: (box, bounds) => ({ x: middleOf(bounds.left, bounds.right, box.width), y: box.y }),
  right: (box, bounds) => ({ x: bounds.right - box.width, y: box.y }),
  top: (box, bounds) => ({ x: box.x, y: bounds.top }),
  middle: (box, bounds) => ({ x: box.x, y: middleOf(bounds.top, bounds.bottom, box.height) }),
  bottom: (box, bounds) => ({ x: box.x, y: bounds.bottom - box.height }),
};

const ALIGN_MODES: readonly AlignMode[] = ['left', 'center', 'right', 'top', 'middle', 'bottom', 'horizontal', 'vertical'];

const MIN_DISTRIBUTE = 3;

export { ALIGN_AT, ALIGN_MODES, MIN_DISTRIBUTE };
