/* @layer renderer-app @kind constants */
import type { PivotAnchor } from './pivot-anchor.type';

const ANCHORS: readonly PivotAnchor[] = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'];

const ANCHOR_HALVES: Readonly<Record<PivotAnchor, { x: number; y: number }>> = {
  'top-left': { x: 0, y: 0 },
  top: { x: 1, y: 0 },
  'top-right': { x: 2, y: 0 },
  left: { x: 0, y: 1 },
  center: { x: 1, y: 1 },
  right: { x: 2, y: 1 },
  'bottom-left': { x: 0, y: 2 },
  bottom: { x: 1, y: 2 },
  'bottom-right': { x: 2, y: 2 },
};

export { ANCHOR_HALVES, ANCHORS };
