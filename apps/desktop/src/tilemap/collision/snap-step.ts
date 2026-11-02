/* @layer renderer-app @kind logic */
import type { ShapeSnap } from '../../stores/tileset-view-store.type';

const snapStep = (snap: ShapeSnap): number => (snap === 'half' ? 0.5 : 1);

export { snapStep };
