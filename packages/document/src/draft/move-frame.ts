/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { FrameId, SpriteId } from '../model/ids.type';
import type { Draft } from './draft.type';
import { orderTags } from './order-tags';
import { updateSprite } from './update-sprite';

const moveFrame = (draft: Draft, spriteId: SpriteId, frameId: FrameId, to: number): void => {
  updateSprite(draft, spriteId, (sprite) => {
    const frame = sprite.frames.find((item) => item.id === frameId);
    if (!frame) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Frame ${frameId} does not exist in sprite ${spriteId}.`);
    const rest = sprite.frames.filter((item) => item.id !== frameId);
    const frames = [...rest.slice(0, to), frame, ...rest.slice(to)];
    return { ...sprite, frames, tags: orderTags(sprite.tags, frames) };
  });
};

export { moveFrame };
