/* @layer renderer-app @kind logic */
import type { NavigatorViewport } from '@drizztdourden08/tessera';
import type { PixelPoint } from '../../PixelViewport';

const panOfViewport = (next: NavigatorViewport): PixelPoint => ({
  x: next.x + next.width / 2,
  y: next.y + next.height / 2,
});

export { panOfViewport };
