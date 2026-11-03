/* @layer renderer-app @kind logic */
import type { PixelPlayerTag } from '@drizztdourden08/tessera';
import type { PreviewTag } from '../asset-overview/asset-overview.type';

const playerTags = (tags: readonly PreviewTag[]): readonly PixelPlayerTag[] => tags.map((tag) => ({ id: tag.id, name: tag.name, from: tag.from, to: tag.to }));

export { playerTags };
