/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { usePendingStore } from '../../stores/usePendingStore';

const floatOffset = (): Point | null => {
  const spec = usePendingStore.getState().pending?.spec;
  return spec?.kind === 'move' || spec?.kind === 'paste' ? spec.offset : null;
};

export { floatOffset };
