/* @layer core @kind logic */
import type { SpriteId } from '../model/ids.type';
import type { Frame } from '../model/sprite.type';
import type { Draft } from './draft.type';
import { updateSprite } from './update-sprite';

const replaceFrame = (draft: Draft, spriteId: SpriteId, frame: Frame): void => {
  updateSprite(draft, spriteId, (sprite) => ({
    ...sprite,
    frames: sprite.frames.map((item) => (item.id === frame.id ? frame : item)),
  }));
};

export { replaceFrame };
