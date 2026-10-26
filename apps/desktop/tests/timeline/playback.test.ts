/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFrameId, TagId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { allowPress } from '../../src/editor/allow-press';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { addTag } from '../../src/timeline/add-tag';
import { advancePlayback } from '../../src/timeline/advance-playback';
import { changeTag } from '../../src/timeline/change-tag';
import { fpsOf } from '../../src/timeline/fps-of';
import { frameDelay } from '../../src/timeline/frame-delay';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { nextCursor } from '../../src/timeline/next-cursor';
import { playSteps } from '../../src/timeline/play-steps';
import { selectTag } from '../../src/timeline/select-tag';
import { setDuration } from '../../src/timeline/set-duration';
import { statusText, totalsText } from '../../src/timeline/totals-text';
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

const visited = (steps: number): number[] => {
  const ids = frameIds();
  const seen: number[] = [];
  useTimelineStore.getState().play();
  for (let step = 0; step < steps; step += 1) {
    if (!advancePlayback()) break;
    seen.push(ids.indexOf(live().frame.id));
  }
  return seen;
};

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

describe('stepping the cursor', () => {
  it('moves on, wraps when looping and stops at the end when not', () => {
    expect(nextCursor(3, 0, true)).toBe(1);
    expect(nextCursor(3, 2, true)).toBe(0);
    expect(nextCursor(3, 2, false)).toBeNull();
    expect(nextCursor(1, 0, true)).toBeNull();
  });
});

describe('playing', () => {
  it('walks the frames in order and wraps while looping', () => {
    withFrames(3);
    expect(visited(5)).toEqual([1, 2, 0, 1, 2]);
  });

  it('stops at the last frame when looping is off', () => {
    withFrames(3);
    useTimelineStore.getState().setLoop(false);
    expect(visited(6)).toEqual([1, 2]);
    expect(useTimelineStore.getState().playing).toBe(false);
  });

  it('plays a ping-pong tag out and back', () => {
    withFrames(5);
    const id = tagFrames(1, 3, 'pingpong');
    selectTag(id);
    goToFrame(frameAt(1));
    expect(visited(6)).toEqual([2, 3, 2, 1, 2, 3]);
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
    expect(visited(1)).toEqual([1]);
    goToFrame(frameAt(3));
    expect(visited(1)).toEqual([0]);
  });

  it('pauses at once when there is one frame', () => {
    useTimelineStore.getState().play();
    expect(advancePlayback()).toBe(false);
    expect(useTimelineStore.getState().playing).toBe(false);
  });

  it('never changes the document', () => {
    withFrames(4);
    const before = { revision: revision(), animation: animationOf() };
    visited(9);
    expect(revision()).toBe(before.revision);
    expect(animationOf()).toBe(before.animation);
  });

  it('stops when the user starts to draw', () => {
    withFrames(3);
    useTimelineStore.getState().play();
    allowPress({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false }, target());
    expect(useTimelineStore.getState().playing).toBe(false);
  });
});

describe('timing', () => {
  it('waits the duration of the frame on show', () => {
    withFrames(3);
    pickRange(1, 1);
    setDuration(240);
    expect(frameDelay()).toBe(240);
    pickRange(0, 0);
    expect(frameDelay()).toBe(100);
  });

  it('reads the frame rate from the durations of the frames that play', () => {
    withFrames(2);
    expect(fpsOf(playSteps(animationOf(), null))).toBe(10);
    pickRange(0, 1);
    setDuration(40);
    expect(fpsOf(playSteps(animationOf(), null))).toBe(25);
    expect(fpsOf({ steps: [], cycleMs: 0 })).toBe(0);
  });

  it('counts a repeated ping-pong frame twice in the totals', () => {
    withFrames(3);
    const id = tagFrames(0, 2, 'pingpong');
    pickRange(0, 0);
    setDuration(200);
    expect(totalsText(live(), id)).toBe('4 frames, 500 ms, 8 fps');
  });

  it('writes the status line', () => {
    withFrames(4);
    pickRange(1, 1);
    expect(statusText(live())).toBe('Frame 2 of 4, 100 ms');
    expect(frameIds().indexOf(live().frame.id as AnimFrameId)).toBe(1);
    expect(useDocumentStore.getState().activeId).not.toBeNull();
  });
});
