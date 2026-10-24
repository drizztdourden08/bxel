/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { usePendingStore } from '../../stores/usePendingStore';
import { currentTarget } from '../current-target';
import { fitOffset } from './fit-offset';

const setFloatOffset = (offset: Point): void => {
  const { pending, revise } = usePendingStore.getState();
  const spec = pending?.spec;
  const target = currentTarget();
  if (spec?.kind === 'move') revise({ ...spec, offset });
  else if (spec?.kind === 'paste' && target) revise({ ...spec, offset: fitOffset(spec.clip, offset, target.sprite) });
};

export { setFloatOffset };
