/* @layer renderer-app @kind logic */
import { animationSequence } from '@bxel/document';
import type { AnimSequence, AnimSpanTag, AnimTag, Animation } from '@bxel/document';
import { PLAY_STEPS_MAX } from './animation-plays.constants';

const roundTo2 = (value: number): number => Math.round(value * 100) / 100;

const spanOf = (animation: Animation, tag: AnimTag | null): AnimSpanTag | null => {
  if (tag === null) return null;
  if (tag.kind === 'span') return tag;
  const base = animation.tags.find((each) => each.id === tag.of);
  return base?.kind === 'span' ? base : null;
};

const stepsOf = ({ steps }: AnimSequence, passes: number) => {
  const listed = [];
  for (let pass = 0; pass < passes && listed.length < PLAY_STEPS_MAX; pass += 1) {
    for (const step of steps) {
      if (listed.length >= PLAY_STEPS_MAX) break;
      listed.push({ index: step.index, frameId: step.frameId, flip: step.flip, ms: step.durationMs });
    }
  }
  return { listed, truncated: steps.length * passes > listed.length };
};

const nameOf = (animation: Animation, tag: AnimTag | null): string => {
  if (tag === null) return animation.name;
  if (tag.kind === 'span') return tag.name;
  return `${spanOf(animation, tag)?.name ?? tag.of} (mirrored)`;
};

const mirrorOf = (tag: AnimTag | null) => (tag?.kind === 'mirror' ? { mirrorOf: tag.of, flip: tag.flip } : { mirrorOf: null, flip: null });

const identityOf = (animation: Animation, tag: AnimTag | null) => ({
  tagId: tag?.id ?? null,
  name: nameOf(animation, tag),
  facing: tag?.facing ?? null,
  ...mirrorOf(tag),
  direction: spanOf(animation, tag)?.direction ?? animation.loop.direction,
});

const timingOf = (sequence: AnimSequence, passes: number) => {
  const totalMs = sequence.cycleMs * passes;
  return {
    passMs: sequence.cycleMs,
    totalMs,
    fps: totalMs > 0 ? roundTo2((sequence.steps.length * passes) / (totalMs / 1000)) : 0,
  };
};

const animationPlay = (animation: Animation, tag: AnimTag | null) => {
  const sequence = animationSequence(animation, tag?.id ?? null);
  const forever = sequence.repeat === 0;
  const passes = forever ? 1 : sequence.repeat;
  const { listed, truncated } = stepsOf(sequence, passes);
  return { ...identityOf(animation, tag), repeat: sequence.repeat, forever, steps: listed, truncated, ...timingOf(sequence, passes) };
};

export { animationPlay };
