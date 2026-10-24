/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { insertFrame } from '../../draft/insert-frame';
import type { FrameId } from '../../model/ids.type';
import { DEFAULT_FRAME_DURATION_MS } from '../../model/limits.constants';
import { requireSprite } from '../../read/require-sprite';
import type { CommandInput } from '../command-def.type';
import { registerCreatedRef } from '../register-created-ref';
import type { FrameSpec } from './frame.type';
import { pickFrames } from './pick-frames';

const addFrames = (draft: Draft, input: CommandInput, spec: FrameSpec): void => {
  const anchors = spec.after ? pickFrames(draft.artwork, input.sprites, spec.after, 'options.after') : [];
  const sources = spec.copyOf ? pickFrames(draft.artwork, input.sprites, spec.copyOf, 'options.copyOf') : [];
  const created: FrameId[] = [];
  for (const spriteId of input.sprites) {
    const anchor = anchors.find((picked) => picked.sprite.id === spriteId);
    const source = sources.find((picked) => picked.sprite.id === spriteId);
    const frame = {
      id: draft.ids.next('frm') as FrameId,
      durationMs: spec.durationMs ?? source?.frame.durationMs ?? DEFAULT_FRAME_DURATION_MS,
    };
    const at = anchor ? anchor.index + 1 : requireSprite(draft.artwork, spriteId).frames.length;
    insertFrame(draft, { spriteId, frame, at, copyOf: source?.frame.id, linked: spec.linked });
    created.push(frame.id);
  }
  registerCreatedRef(draft, input, created, 'frame');
};

export { addFrames };
