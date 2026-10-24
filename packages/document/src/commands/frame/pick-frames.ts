/* @layer core @kind logic */
import type { SpriteId } from '../../model/ids.type';
import type { Artwork } from '../../model/artwork.type';
import type { Frame } from '../../model/sprite.type';
import { requireSprite } from '../../read/require-sprite';
import type { FrameRef } from '../../schema/command-options.type';
import type { TargetIssue } from '../command-error.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import type { PickedFrame } from './frame.type';

const matches = (frame: Frame, index: number, ref: FrameRef): boolean =>
  ref.by === 'id' ? frame.id === ref.id : index === ref.index;

const describe = (ref: FrameRef): string => (ref.by === 'id' ? `Frame ${ref.id}` : `Frame at position ${ref.index}`);

const pickFrames = (artwork: Artwork, sprites: readonly SpriteId[], ref: FrameRef, path: string): PickedFrame[] => {
  if (ref.by === 'id' && sprites.length > 1) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'A frame id is valid with one sprite only. Use a frame position.', { path });
  }
  const picked: PickedFrame[] = [];
  const missing: TargetIssue[] = [];
  for (const spriteId of sprites) {
    const sprite = requireSprite(artwork, spriteId);
    const index = sprite.frames.findIndex((frame, position) => matches(frame, position, ref));
    const frame = sprite.frames[index];
    if (frame) picked.push({ sprite, frame, index });
    else missing.push({ spriteId, layerId: null, frameId: null, reason: 'the frame does not exist' });
  }
  if (missing.length > 0) {
    const code = sprites.length > 1 ? ERROR_CODE.INCOMPATIBLE_TARGETS : ERROR_CODE.TARGET_NOT_FOUND;
    throw fail(code, `${describe(ref)} does not exist in every target sprite.`, { details: missing, path });
  }
  return picked;
};

export { pickFrames };
