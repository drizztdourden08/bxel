/* @layer renderer-app @kind constants */
import type { ShapeSnap } from '../../../stores/tileset-view-store.type';

const NUDGE_BIG = 10;

const SNAP_CHOICES: readonly { value: ShapeSnap; label: string }[] = [
  { value: 'pixel', label: 'Pixel' },
  { value: 'half', label: 'Half pixel' },
];

export { NUDGE_BIG, SNAP_CHOICES };
