/* @layer renderer-app @kind logic */
import type { CanvasSurface } from '../canvas-surface/canvas-surface.type';
import type { SymmetryAxis } from '../stores/tool-store.type';
import { FLIPPING } from './span-reversed.constants';

const spanReversed = (axis: SymmetryAxis, mirror: boolean, surface: CanvasSurface): boolean => axis === 'x' && mirror && FLIPPING.includes(surface);

export { spanReversed };
