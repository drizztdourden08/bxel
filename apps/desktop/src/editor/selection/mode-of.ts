/* @layer renderer-app @kind logic */
import type { CombineMode } from '@bxel/raster';
import type { ModifierKeys } from './mode-of.type';

const modeOf = (keys: ModifierKeys, chosen: CombineMode): CombineMode => {
  if (keys.shiftKey && keys.altKey) return 'intersect';
  if (keys.shiftKey) return 'add';
  if (keys.altKey) return 'subtract';
  return chosen;
};

export { modeOf };
