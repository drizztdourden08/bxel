/* @layer renderer-app @kind logic */
import { edgeScrollDelta } from '@drizztdourden08/tessera';
import { EDGE_SCROLL } from './edge-scroll.constants';
import type { Bounds, Pointer } from './edge-scroll-step.type';

const edgeScrollStep = (pointer: Pointer, bounds: Bounds): number => {
  if (pointer.y < bounds.y || pointer.y > bounds.y + bounds.height) return 0;
  return edgeScrollDelta(pointer, bounds, EDGE_SCROLL.edge, EDGE_SCROLL.speed).x;
};

export { edgeScrollStep };
