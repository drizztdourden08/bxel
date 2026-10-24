/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { NEW_TAG_NAME } from './timeline.constants';

const newTagName = (sprite: Sprite): string => {
  const taken = new Set(sprite.tags.map((tag) => tag.name.toLowerCase()));
  let number = sprite.tags.length + 1;
  while (taken.has(`${NEW_TAG_NAME} ${number}`.toLowerCase())) number += 1;
  return `${NEW_TAG_NAME} ${number}`;
};

export { newTagName };
