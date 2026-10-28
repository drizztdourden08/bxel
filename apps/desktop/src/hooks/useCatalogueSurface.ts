/* @layer renderer-app @kind hook */
import { surfaceOfContext } from '../editor/tool-catalogue/surface-of-context';
import type { Surface } from '../editor/tool-catalogue/surface.type';
import { useBxelContext } from '../ui-context/useBxelContext';

const useCatalogueSurface = (): Surface => useBxelContext(surfaceOfContext);

export { useCatalogueSurface };
