/* @layer renderer-app @kind logic */
import type { SpriteSize } from './new-sprite.type';

const gridOf = (grid: SpriteSize | undefined): SpriteSize | null =>
  grid === undefined || (grid.width === 1 && grid.height === 1) ? null : { width: grid.width, height: grid.height };

export { gridOf };
