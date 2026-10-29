/* @layer renderer-app @kind logic */
import { animationSequence } from '@bxel/document';
import type { AnimStep, Animation, TagId } from '@bxel/document';
import type { PlanInput, PlayPlan } from './play-plan.type';
import { tagById } from './tag-by-id';

const frameStep = (animation: Animation, index: number): AnimStep[] => {
  const frame = animation.frames[index];
  return frame ? [{ index, frameId: frame.id, durationMs: frame.durationMs, flip: null }] : [];
};

const forwardSteps = (animation: Animation, indices: readonly number[]): AnimStep[] => indices.flatMap((index) => frameStep(animation, index));

const repeated = (steps: readonly AnimStep[], times: number): AnimStep[] => Array.from({ length: Math.max(1, times) }, () => steps).flat();

const tagSteps = (animation: Animation, tagId: TagId, subtags: boolean): AnimStep[] => {
  const tag = tagById(animation, tagId);
  const steps = animationSequence(animation, tagId).steps;
  const base = tag?.kind === 'mirror' ? tagById(animation, tag.of) : tag;
  return subtags && base?.kind === 'span' ? repeated(steps, base.repeat) : [...steps];
};

const spanStarts = (animation: Animation): { id: TagId; first: number; last: number }[] =>
  animation.tags.flatMap((tag) => {
    if (tag.kind !== 'span') return [];
    const first = animation.frames.findIndex((frame) => frame.id === tag.from);
    const last = animation.frames.findIndex((frame) => frame.id === tag.to);
    return first < 0 || last < first ? [] : [{ id: tag.id, first, last }];
  });

const subtagSteps = (animation: Animation): AnimStep[] => {
  const spans = spanStarts(animation);
  const steps: AnimStep[] = [];
  let at = 0;
  while (at < animation.frames.length) {
    const span = spans.filter((each) => each.first === at).sort((a, b) => b.last - a.last)[0];
    if (span) {
      steps.push(...tagSteps(animation, span.id, true));
      at = span.last + 1;
    } else {
      steps.push(...frameStep(animation, at));
      at += 1;
    }
  }
  return steps;
};

const indexOf = (animation: Animation, id: string): number => animation.frames.findIndex((frame) => frame.id === id);

const rangeIndices = (from: number, to: number): number[] => Array.from({ length: Math.abs(to - from) + 1 }, (_, step) => Math.min(from, to) + step);

const baseSteps = (input: PlanInput): AnimStep[] => {
  const { animation, loopRange, picked } = input;
  if (loopRange) {
    const from = indexOf(animation, loopRange.from);
    const to = indexOf(animation, loopRange.to);
    if (from >= 0 && to >= 0) return forwardSteps(animation, rangeIndices(from, to));
  }
  if (input.rangePicked) {
    const indices = picked.map((id) => indexOf(animation, id)).filter((index) => index >= 0).sort((a, b) => a - b);
    if (indices.length > 0) return forwardSteps(animation, indices);
  }
  if (input.tagId !== null && tagById(animation, input.tagId)) return tagSteps(animation, input.tagId, input.subtags);
  return input.subtags ? subtagSteps(animation) : [...animationSequence(animation, null).steps];
};

const bounced = (steps: readonly AnimStep[]): AnimStep[] => [...steps, ...steps.slice(1, -1).reverse()];

const planOf = (steps: readonly AnimStep[]): PlayPlan => {
  const starts: number[] = [];
  let total = 0;
  for (const step of steps) {
    starts.push(total);
    total += step.durationMs;
  }
  return { steps, starts, cycleMs: total };
};

const playPlan = (input: PlanInput): PlayPlan => {
  const steps = baseSteps(input);
  return planOf(input.mode === 'pingpong' ? bounced(steps) : steps);
};

export { playPlan };
