/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { AnimFrame, Animation } from '../../model/animation.type';
import { findSprite } from '../../read/find-sprite';
import type { DuplicateFrameSource } from './anim-source.type';
import { buildAnimFrame } from './build-anim-frame';
import type { FrameFields } from './build-anim-frame.type';
import { ownedCopy } from './owned-copy';
import { pickAnimFrame } from './pick-anim-frame';

const duplicateFrames = (draft: Draft, animation: Animation, source: DuplicateFrameSource, fields: FrameFields): AnimFrame[] => {
  const { frame } = pickAnimFrame(animation, source.frame, 'options.source.frame');
  const original = frame.spriteId === null ? undefined : findSprite(draft.artwork, frame.spriteId);
  const spriteId = original?.role === 'frame' ? ownedCopy(draft, animation.name, original).id : frame.spriteId;
  return [
    buildAnimFrame(
      draft.ids,
      { spriteId, clip: frame.clip },
      {
        durationMs: fields.durationMs ?? frame.durationMs,
        offset: fields.offset ?? frame.offset,
        pivot: fields.pivot ?? frame.pivot ?? undefined,
      },
    ),
  ];
};

export { duplicateFrames };
