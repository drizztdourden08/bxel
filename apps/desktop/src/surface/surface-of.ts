/* @layer renderer-app @kind logic */
import type { SpriteMode } from '../stores/sprite-store.type';
import type { TileEditMode } from '../stores/tilemap-store.type';
import type { Surface } from './surface.type';

const surfaceOf = (hasDocument: boolean, mode: SpriteMode, tileMode: TileEditMode): Surface => {
  if (!hasDocument) return 'none';
  if (mode === 'sheet') return 'sheet';
  if (mode === 'sprite') return 'sprite';
  return tileMode === 'place' ? 'map' : 'tile';
};

export { surfaceOf };
