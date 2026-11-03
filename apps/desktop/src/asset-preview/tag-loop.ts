/* @layer renderer-app @kind logic */
import type { PixelPlayerLoop } from '@drizztdourden08/tessera';
import type { PreviewTag } from '../asset-overview/asset-overview.type';

const tagLoop = (tag: PreviewTag): PixelPlayerLoop => ({ direction: tag.direction, repeat: tag.repeat });

export { tagLoop };
