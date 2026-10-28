/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { TagId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { allowPress } from '../../src/editor/allow-press';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { addTag } from '../../src/timeline/add-tag';
import { changeTag } from '../../src/timeline/change-tag';
import { fpsOf } from '../../src/timeline/fps-of';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { playPlan } from '../../src/timeline/play-plan';
import { resetClock, tickClock } from '../../src/timeline/playback-clock';
import { playSteps } from '../../src/timeline/play-steps';
import { selectTag } from '../../src/timeline/select-tag';
import { setDuration } from '../../src/timeline/set-duration';
import { stopPlayback } from '../../src/timeline/stop-playback';
import { timeReadout } from '../../src/timeline/time-readout';
import { togglePlayback } from '../../src/timeline/toggle-playback';
import { animationOf, frameAt, frameIds, freshAnimation, live, pickRange, revision, run, target, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

const tagFrames = (first: number, last: number, direction: 'forward' | 'reverse' | 'pingpong' | 'pingpongReverse'): TagId => {
  pickRange(first, last);
  addTag();
  const id = animationOf().tags.at(-1)?.id;
  if (!id) throw new Error('no tag');
  changeTag('Change tag', id, { direction });
  return id;
};

const order = (tagId: TagId | null): number[] => {
  const ids = frameIds();
  return playSteps(animationOf(), tagId).steps.map((step) => ids.indexOf(step.frameId));
};

let now = 1000;

const begin = (): void => {
  resetClock();
  now = 1000;
  useTimelineStore.getState().play();
  tickClock(now);
};

const advance = (ms: number, step = 16): void => {
  const end = now + ms;
  while (now < end && useTimelineStore.getState().playing) {
    now = Math.min(end, now + step);
    tickClock(now);
  }
};

const shown = (): number => frameIds().indexOf(live().frame.id);

describe('the play order', () => {
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

describe('the play plan', () => {
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

describe('the clock', () => {
  it('walks the frames in order and wraps while looping', () => {
    withFrames(3);
    begin();
    const seen: number[] = [];
    for (const wait of [100, 100, 100, 100]) {
      advance(wait);
      seen.push(shown());
    }
    expect(seen).toEqual([1, 2, 0, 1]);
  });

  it('keeps a long frame for its whole duration', () => {
    withFrames(3);
    pickRange(1, 1);
    setDuration(300);
    goToFrame(frameAt(0));
    begin();
    advance(150);
    expect(shown()).toBe(1);
    advance(200);
    expect(shown()).toBe(1);
    advance(100);
    expect(shown()).toBe(2);
  });

  it('plays once and stops on the last frame when rewind is off', () => {
    withFrames(3);
    useTimelineStore.setState({ playMode: 'once', rewind: false });
    begin();
    advance(1000);
    expect(useTimelineStore.getState().playing).toBe(false);
    expect(shown()).toBe(2);
  });

  it('rewinds to the frame it began on when playing ends or is stopped', () => {
    withFrames(4);
    goToFrame(frameAt(1));
    begin();
    advance(250);
    expect(shown()).toBe(3);
    stopPlayback();
    expect(shown()).toBe(1);
    useTimelineStore.setState({ rewind: false });
    begin();
    advance(150);
    stopPlayback();
    expect(shown()).toBe(2);
  });

  it('plays a ping-pong tag out and back', () => {
    withFrames(5);
    const id = tagFrames(1, 3, 'pingpong');
    selectTag(id);
    goToFrame(frameAt(1));
    useTimelineStore.setState({ rewind: false });
    begin();
    const seen: number[] = [];
    for (let step = 0; step < 6; step += 1) {
      advance(100);
      seen.push(shown());
    }
    expect(seen).toEqual([2, 3, 2, 1, 2, 3]);
  });

  it('plays a mirrored tag with its flip', () => {
    withFrames(3);
    const id = tagFrames(0, 2, 'forward');
    const animation = animationOf().id;
    run('Mirror', [
      { name: COMMAND_NAME.animationUpdate, targets: null, options: { animation, directions: 'eight' } },
      { name: COMMAND_NAME.animationTagUpdate, targets: null, options: { animation, tag: { by: 'id', id }, facing: 'e' } },
      { name: COMMAND_NAME.animationTagAdd, targets: null, options: { animation, kind: 'mirror', of: { by: 'id', id }, flip: 'x', facing: 'w' } },
    ]);
    const mirror = animationOf().tags.find((tag) => tag.kind === 'mirror');
    expect(mirror?.kind).toBe('mirror');
    expect(playSteps(animationOf(), mirror?.id ?? null).steps.map((step) => step.flip)).toEqual(['x', 'x', 'x']);
  });

  it('follows a frame the user clicks while it plays', () => {
    withFrames(4);
    begin();
    advance(150);
    expect(shown()).toBe(1);
    goToFrame(frameAt(3));
    advance(20);
    expect(shown()).toBe(3);
  });

  it('pauses at once when there is one frame', () => {
    useTimelineStore.getState().play();
    tickClock(5);
    expect(useTimelineStore.getState().playing).toBe(false);
  });

  it('never changes the document', () => {
    withFrames(4);
    const before = { revision: revision(), animation: animationOf() };
    begin();
    advance(2000);
    expect(revision()).toBe(before.revision);
    expect(animationOf()).toBe(before.animation);
  });

  it('stops when the user starts to draw', () => {
    withFrames(3);
    useTimelineStore.getState().play();
    allowPress({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false }, target());
    expect(useTimelineStore.getState().playing).toBe(false);
  });

  it('keeps the picked frames through play and stop', () => {
    withFrames(5);
    pickRange(0, 2);
    const picked = [...useTimelineStore.getState().selection.frames];
    begin();
    advance(450);
    stopPlayback();
    expect(useTimelineStore.getState().selection.frames).toEqual(picked);
    expect(picked).toHaveLength(3);
  });

  it('toggles with one call and runs a speed multiplier', () => {
    withFrames(4);
    useTimelineStore.setState({ speed: 2, rewind: false });
    togglePlayback();
    expect(useTimelineStore.getState().playing).toBe(true);
    resetClock();
    now = 1000;
    tickClock(now);
    advance(100);
    expect(shown()).toBe(2);
    togglePlayback();
    expect(useTimelineStore.getState().playing).toBe(false);
  });

  it('holds 12 frames of 100 ms within one frame of drift after 60 seconds', () => {
    withFrames(12);
    begin();
    const start = now;
    for (let tick = 1; now - start < 60_000; tick += 1) {
      now = start + (tick * 1000) / 60;
      tickClock(now);
    }
    const elapsed = now - start;
    const expected = Math.floor((elapsed % 1200) / 100);
    expect(Math.abs(shown() - expected) <= 1 || Math.abs(shown() - expected) === 11).toBe(true);
    expect(useTimelineStore.getState().playing).toBe(true);
  });
});

describe('timing', () => {
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
