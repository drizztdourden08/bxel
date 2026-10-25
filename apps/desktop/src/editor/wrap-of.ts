/* @layer renderer-app @kind logic */
import type { Wrap } from '@bxel/raster';
import { useViewStore } from '../stores/useViewStore';
import { WRAP_OF } from './wrap.constants';

const wrapOf = (): Wrap => WRAP_OF[useViewStore.getState().tiled];

export { wrapOf };
