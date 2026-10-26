/* @layer renderer-app @kind logic */
import { tagPlayOrder } from '@bxel/formats';
import type { ExportSprite } from '@bxel/formats';
import type { Clip } from './export-parts.type';

const framesAt = (sprite: ExportSprite, order: readonly number[]) => order.flatMap((index) => sprite.frames[index] ?? []);

const animationClips = (sprite: ExportSprite): Clip[] => {
  if (sprite.tags.length === 0) {
    return [{ name: '', frames: framesAt(sprite, tagPlayOrder(0, sprite.frames.length - 1, 'forward')), repeat: 0 }];
  }
  return sprite.tags.map((tag) => ({
    name: tag.name,
    frames: framesAt(sprite, tagPlayOrder(tag.from, tag.to, tag.direction)),
    repeat: tag.repeat,
  }));
};

export { animationClips };
