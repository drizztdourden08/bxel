/* @layer renderer-app @kind logic */
import type { AnimSpanTag, Animation } from '@bxel/document';
import type { SpanRange } from './animation-export.type';

const animationSpanRange = (animation: Animation, tag: AnimSpanTag): SpanRange | null => {
  const from = animation.frames.findIndex((frame) => frame.id === tag.from);
  const to = animation.frames.findIndex((frame) => frame.id === tag.to);
  return from < 0 || to < 0 ? null : { first: Math.min(from, to), last: Math.max(from, to) };
};

export { animationSpanRange };
