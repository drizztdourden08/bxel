/* @layer renderer-app @kind logic */
import type { Tag } from '@bxel/document';
import { currentTarget } from '../editor/current-target';

const tagById = (tagId: string | undefined): Tag | undefined => currentTarget()?.sprite.tags.find((each) => each.id === tagId);

export { tagById };
