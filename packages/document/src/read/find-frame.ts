/* @layer core @kind logic */
import type { FrameId } from '../model/ids.type';
import type { Frame, Sprite } from '../model/sprite.type';

const findFrame = (sprite: Sprite, id: FrameId): Frame | undefined =>
  sprite.frames.find((frame) => frame.id === id);

export { findFrame };
