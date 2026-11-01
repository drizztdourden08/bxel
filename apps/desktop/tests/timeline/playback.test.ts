/* @layer renderer-app @kind test */
import type { TagId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { changeTag } from '../../src/timeline/change-tag';
import { fpsOf } from '../../src/timeline/fps-of';
import { playPlan } from '../../src/timeline/play-plan';
import { playSteps } from '../../src/timeline/play-steps';
import { setDuration } from '../../src/timeline/set-duration';
import { timeReadout } from '../../src/timeline/time-readout';
import { tagFrames } from './playback-harness';
import { animationOf, frameAt, frameIds, freshAnimation, live, pickRange, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

const order = (tagId: TagId | null): number[] => {
  const ids = frameIds();
  return playSteps(animationOf(), tagId).steps.map((step) => ids.indexOf(step.frameId));
};

describe('S2 the play order', { tags: ['standard'] }, () => {
  it('runs every frame forward when no tag is picked', () => {
    withFrames(3);
    expect(order(null)).toEqual([0, 1, 2]);
  });

  it('runs a tag in its own loop mode and nothing outside it', () => {
    withFrames(4);
    const id = tagFrames(1, 3, 'reverse');
    expect(order(id)).toEqual([3, 2, 1]);
  });

  it('ping-pongs without repeating the end frames', () => {
    withFrames(4);
    const id = tagFrames(0, 3, 'pingpong');
    expect(order(id)).toEqual([0, 1, 2, 3, 2, 1]);
  });

  it('ping-pongs backwards from the last frame', () => {
    withFrames(3);
    const id = tagFrames(0, 2, 'pingpongReverse');
    expect(order(id)).toEqual([2, 1, 0, 1]);
  });

  it('plays the whole animation when the picked tag is gone', () => {
    withFrames(3);
    expect(order('tag_gone' as TagId)).toEqual([0, 1, 2]);
  });
});

describe('S2 the play plan', { tags: ['standard'] }, () => {
  const planOf = (extra: Partial<Parameters<typeof playPlan>[0]> = {}) =>
    playPlan({ animation: animationOf(), tagId: null, picked: [], rangePicked: false, loopRange: null, mode: 'loop', subtags: false, ...extra });
  const indices = (plan: ReturnType<typeof planOf>): number[] => plan.steps.map((step) => frameIds().indexOf(step.frameId));

  it('bounces the range out and back in ping-pong preview', () => {
    withFrames(4);
    expect(indices(planOf({ mode: 'pingpong' }))).toEqual([0, 1, 2, 3, 2, 1]);
  });

  it('plays only the picked frames, in order', () => {
    withFrames(5);
    expect(indices(planOf({ rangePicked: true, picked: [frameAt(3), frameAt(1)] }))).toEqual([1, 3]);
  });

  it('plays a loop range of the ruler before anything else', () => {
    withFrames(5);
    expect(indices(planOf({ loopRange: { from: frameAt(3), to: frameAt(1) }, rangePicked: true, picked: [frameAt(0)] }))).toEqual([1, 2, 3]);
  });

  it('repeats a tag and plays tags inside the whole animation under subtags', () => {
    withFrames(5);
    const id = tagFrames(1, 2, 'forward');
    changeTag('Change tag', id, { repeat: 2 });
    expect(indices(planOf({ tagId: id, subtags: true }))).toEqual([1, 2, 1, 2]);
    expect(indices(planOf({ tagId: id }))).toEqual([1, 2]);
    expect(indices(planOf({ subtags: true }))).toEqual([0, 1, 2, 1, 2, 3, 4]);
  });
});

describe('S2 timing', { tags: ['standard'] }, () => {
  it('reads the frame rate from the durations of the frames that play', () => {
    withFrames(2);
    expect(fpsOf(playSteps(animationOf(), null))).toBe(10);
    pickRange(0, 1);
    setDuration(40);
    expect(fpsOf(playSteps(animationOf(), null))).toBe(25);
    expect(fpsOf({ steps: [], cycleMs: 0 })).toBe(0);
  });

  it('writes the time readout of the range in the chosen units', () => {
    withFrames(4);
    pickRange(1, 1);
    expect(timeReadout(live(), 'ms')).toEqual({ clock: '100 / 400 ms', fps: '10 fps' });
    expect(timeReadout(live(), 'seconds').clock).toBe('0.10 / 0.40 s');
    expect(timeReadout(live(), 'ticks').clock).toBe('1 / 5 ticks');
    expect(frameIds().indexOf(live().frame.id)).toBe(1);
    expect(useDocumentStore.getState().activeId).not.toBeNull();
  });

  it('counts a repeated ping-pong frame twice in the plan', () => {
    withFrames(3);
    const id = tagFrames(0, 2, 'pingpong');
    pickRange(0, 0);
    setDuration(200);
    useTimelineStore.getState().selectTag(id);
    const plan = playPlan({ animation: animationOf(), tagId: id, picked: [], rangePicked: false, loopRange: null, mode: 'loop', subtags: false });
    expect(plan.steps).toHaveLength(4);
    expect(plan.cycleMs).toBe(500);
  });
});
