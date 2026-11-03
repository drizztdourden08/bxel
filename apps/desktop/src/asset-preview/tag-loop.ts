/* @layer renderer-app @kind logic */
import type { PixelPlayerLoop } from '@drizztdourden08/tessera';
import type { PreviewTag } from '../asset-overview/asset-overview.type';
import { PLAYER_DIRECTION } from './asset-preview.constants';

const tagLoop = (tag: PreviewTag): PixelPlayerLoop => ({ direction: PLAYER_DIRECTION[tag.direction], repeat: tag.repeat });

export { tagLoop };
