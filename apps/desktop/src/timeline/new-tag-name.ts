/* @layer renderer-app @kind logic */
import type { Animation } from '@bxel/document';
import { NEW_TAG_NAME } from './timeline.constants';

const newTagName = (animation: Animation): string => {
  const taken = new Set(animation.tags.flatMap((tag) => (tag.kind === 'span' ? [tag.name.toLowerCase()] : [])));
  let number = animation.tags.length + 1;
  while (taken.has(`${NEW_TAG_NAME} ${number}`.toLowerCase())) number += 1;
  return `${NEW_TAG_NAME} ${number}`;
};

export { newTagName };
