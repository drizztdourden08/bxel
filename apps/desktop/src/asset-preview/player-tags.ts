/* @layer renderer-app @kind logic */
import type { PixelPlayerLoop, PixelPlayerTag } from '@drizztdourden08/tessera';
import type { PreviewTag } from '../asset-overview/asset-overview.type';
import { PLAYER_DIRECTION } from './asset-preview.constants';

const playerTags = (tags: readonly PreviewTag[]): readonly PixelPlayerTag[] => tags.map((tag) => ({ id: tag.id, name: tag.name, from: tag.from, to: tag.to }));

const tagLoop = (tag: PreviewTag): PixelPlayerLoop => ({ direction: PLAYER_DIRECTION[tag.direction], repeat: tag.repeat });

export { playerTags, tagLoop };
