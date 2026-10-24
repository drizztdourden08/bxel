/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { NAME_COLLATOR } from './manager.constants';

const tagOptions = (sprites: readonly Sprite[]): string[] =>
  [...new Set(sprites.flatMap((sprite) => sprite.tags.map((tag) => tag.name)))].sort((a, b) => NAME_COLLATOR.compare(a, b));

export { tagOptions };
