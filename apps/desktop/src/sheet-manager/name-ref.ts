/* @layer renderer-app @kind logic */
import type { Animation, TagId } from '@bxel/document';
import type { TagRef } from './tag-ref.type';

const nameRef = (animation: Animation, id: TagId | null): TagRef | null | undefined => {
  if (id === null) return null;
  const tag = animation.tags.find((each) => each.id === id);
  if (tag?.kind !== 'span') return undefined;
  return tag.facing === undefined ? { by: 'name', name: tag.name } : { by: 'name', name: tag.name, facing: tag.facing };
};

export { nameRef };
