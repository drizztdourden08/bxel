/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import type { TagBar } from '../../../timeline/timeline.type';

const rovingTag = (bars: readonly TagBar[], tagId: TagId | null): TagId | null => (bars.find((bar) => bar.tagId === tagId) ?? bars[0])?.tagId ?? null;

export { rovingTag };
