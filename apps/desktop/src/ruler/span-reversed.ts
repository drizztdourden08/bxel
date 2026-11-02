/* @layer renderer-app @kind logic */
import type { CanvasSurface } from '../canvas-surface/canvas-surface.type';
import type { SymmetryAxis } from '../stores/tool-store.type';

const FLIPPING: readonly CanvasSurface[] = ['sprite', 'tile'];

const spanReversed = (axis: SymmetryAxis, mirror: boolean, surface: CanvasSurface): boolean => axis === 'x' && mirror && FLIPPING.includes(surface);

export { spanReversed };
