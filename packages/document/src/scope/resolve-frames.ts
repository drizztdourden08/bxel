/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Frame, Sprite } from '../model/sprite.type';
import { nameKey } from '../validate/name-key';
import { findFrame } from '../read/find-frame';
import type { ResolveFramesInput } from './resolved-scope.type';

const framesOfTag = (sprite: Sprite, name: string): Frame[] => {
  const tag = sprite.tags.find((item) => nameKey(item.name) === nameKey(name));
  if (!tag) return [];
  const from = sprite.frames.findIndex((frame) => frame.id === tag.from);
  const to = sprite.frames.findIndex((frame) => frame.id === tag.to);
  if (from < 0 || to < 0) return [];
  return sprite.frames.slice(Math.min(from, to), Math.max(from, to) + 1);
};

const resolveFrames = ({ sprite, selector }: ResolveFramesInput): Frame[] => {
  switch (selector.by) {
    case 'ids':
      return selector.ids.map((id) => {
        const frame = findFrame(sprite, id);
        if (!frame) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Frame ${id} does not exist in sprite ${sprite.id}.`);
        return frame;
      });
    case 'range':
      return sprite.frames.slice(Math.max(selector.from, 0), Math.max(selector.to + 1, 0));
    case 'tag':
      return framesOfTag(sprite, selector.name);
    case 'all':
      return [...sprite.frames];
  }
};

export { resolveFrames };
