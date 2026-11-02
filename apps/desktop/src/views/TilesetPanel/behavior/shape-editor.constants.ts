/* @layer renderer-app @kind constants */
import type { ShapeSnap } from '../../../stores/tileset-view-store.type';

const NUDGE_BIG = 10;

const NUDGE_KEYS: Readonly<Record<string, readonly [number, number]>> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const SNAP_CHOICES: readonly { value: ShapeSnap; label: string }[] = [
  { value: 'pixel', label: 'Pixel' },
  { value: 'half', label: 'Half pixel' },
];

export { NUDGE_BIG, NUDGE_KEYS, SNAP_CHOICES };
