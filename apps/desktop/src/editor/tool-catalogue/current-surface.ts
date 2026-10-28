/* @layer renderer-app @kind logic */
import { currentContext } from '../../ui-context/current-context';
import { surfaceOfContext } from './surface-of-context';
import type { Surface } from './surface.type';

const currentSurface = (): Surface => surfaceOfContext(currentContext());

export { currentSurface };
