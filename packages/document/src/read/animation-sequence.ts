/* @layer core @kind logic */
import type { AnimFlip, AnimSpanTag, Animation } from '../model/animation.type';
import type { TagId } from '../model/ids.type';
import type { AnimSequence } from './anim-sequence.type';
import type { AnimSpan } from './anim-span.type';
import { playOrder } from './play-order';

const wholeSpan = (animation: Animation): AnimSpan => ({
  first: 0,
  last: animation.frames.length - 1,
  direction: animation.loop.direction,
  repeat: animation.loop.repeat,
  flip: null,
});

const spanOf = (animation: Animation, tag: AnimSpanTag, flip: AnimFlip | null): AnimSpan => ({
  first: animation.frames.findIndex((frame) => frame.id === tag.from),
  last: animation.frames.findIndex((frame) => frame.id === tag.to),
  direction: tag.direction,
  repeat: tag.repeat,
  flip,
});

const tagSpan = (animation: Animation, tagId: TagId): AnimSpan | null => {
  const tag = animation.tags.find((item) => item.id === tagId);
  if (!tag) return null;
  if (tag.kind === 'span') return spanOf(animation, tag, null);
  const base = animation.tags.find((item) => item.id === tag.of);
  return base?.kind === 'span' ? spanOf(animation, base, tag.flip) : null;
};

const animationSequence = (animation: Animation, tagId: TagId | null = null): AnimSequence => {
  const span = tagId === null ? wholeSpan(animation) : tagSpan(animation, tagId);
  if (!span || span.first < 0 || span.last < 0) return { steps: [], repeat: 0, cycleMs: 0 };
  const steps = playOrder(span.first, span.last, span.direction).flatMap((index) => {
    const frame = animation.frames[index];
    return frame ? [{ index, frameId: frame.id, durationMs: frame.durationMs, flip: span.flip }] : [];
  });
  return { steps, repeat: span.repeat, cycleMs: steps.reduce((total, step) => total + step.durationMs, 0) };
};

export { animationSequence };
