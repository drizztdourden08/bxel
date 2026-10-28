/* @layer renderer-app @kind logic */
import { currentContext } from '../ui-context/current-context';
import type { CanvasSurface } from './canvas-surface.type';
import { surfaceOfContext } from './surface-of-context';

const currentCanvasSurface = (): CanvasSurface => surfaceOfContext(currentContext());

export { currentCanvasSurface };
