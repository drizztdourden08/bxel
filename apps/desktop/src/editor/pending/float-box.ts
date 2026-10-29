/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import { usePendingStore } from '../../stores/usePendingStore';
import { currentTarget } from '../current-target';
import { regionBox } from './region-box';

const floatBox = (): Rect | null => {
  const pending = usePendingStore.getState().pending;
  const target = currentTarget();
  if (!pending || !target) return null;
  const { spec } = pending;
  if (spec.kind === 'move') return regionBox(target, pending.mask);
  return spec.kind === 'paste' ? { x: spec.clip.origin.x, y: spec.clip.origin.y, width: spec.clip.width, height: spec.clip.height } : null;
};

export { floatBox };
