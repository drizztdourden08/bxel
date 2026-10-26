/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { AnimFrame, Animation } from '../../model/animation.type';
import type { AnimationFrameAddOptions } from '../../schema/animation-options.type';
import { buildAnimFrame } from './build-anim-frame';
import type { FrameFields } from './build-anim-frame.type';
import { duplicateFrames } from './frames-duplicate';
import { spriteFrames } from './frames-sprite';
import { stripFrames } from './frames-strip';

const newFrames = (draft: Draft, animation: Animation, options: AnimationFrameAddOptions): AnimFrame[] => {
  const { source } = options;
  const fields: FrameFields = { durationMs: options.durationMs, offset: options.offset, pivot: options.pivot };
  switch (source.kind) {
    case 'empty':
      return Array.from({ length: source.count }, () => buildAnimFrame(draft.ids, { spriteId: null }, fields));
    case 'sprite':
      return spriteFrames(draft, animation, source, fields);
    case 'strip':
      return stripFrames(draft, animation, source, fields);
    case 'duplicate':
      return duplicateFrames(draft, animation, source, fields);
  }
};

export { newFrames };
