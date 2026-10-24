/* @layer renderer-app @kind logic */
import type { SymmetryAxis } from '../stores/tool-store.type';

const rulerPoint = (axis: SymmetryAxis, along: number, across: number): [number, number] => (axis === 'x' ? [along, across] : [across, along]);

export { rulerPoint };
