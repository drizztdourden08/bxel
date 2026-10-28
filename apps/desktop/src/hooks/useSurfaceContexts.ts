/* @layer renderer-app @kind hook */
import { useSetAppContext } from '@drizztdourden08/brock-react';
import { hasPart } from '../surface/has-part';
import { WIDGET_CONTEXT } from '../surface/surface.constants';
import { useSurface } from './useSurface';

const useSurfaceContexts = (): void => {
  const surface = useSurface();
  useSetAppContext(WIDGET_CONTEXT.paint, hasPart(surface, 'paint'));
  useSetAppContext(WIDGET_CONTEXT.options, hasPart(surface, 'options'));
  useSetAppContext(WIDGET_CONTEXT.sheet, surface === 'sheet');
  useSetAppContext(WIDGET_CONTEXT.tileset, surface === 'map' || surface === 'tile');
  useSetAppContext(WIDGET_CONTEXT.view, surface !== 'none');
};

export { useSurfaceContexts };
