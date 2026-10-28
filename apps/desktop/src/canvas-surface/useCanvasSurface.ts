/* @layer renderer-app @kind hook */
import { useBxelContext } from '../ui-context/useBxelContext';
import type { CanvasSurface } from './canvas-surface.type';
import { surfaceOfContext } from './surface-of-context';

const useCanvasSurface = (): CanvasSurface => useBxelContext(surfaceOfContext);

export { useCanvasSurface };
