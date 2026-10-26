/* @layer renderer-app @kind logic */
import type { AnimTag, Animation, TagId } from '@bxel/document';

const tagById = (animation: Animation, tagId: TagId | null): AnimTag | undefined => animation.tags.find((tag) => tag.id === tagId);

export { tagById };
