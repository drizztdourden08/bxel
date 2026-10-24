/* @layer renderer-app @kind test */
import type { FrameId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { allowPress } from '../../src/editor/allow-press';
import { addTag } from '../../src/timeline/add-tag';
import { advancePlayback } from '../../src/timeline/advance-playback';
import { changeTag } from '../../src/timeline/change-tag';
import { fpsOf } from '../../src/timeline/fps-of';
import { frameDelay } from '../../src/timeline/frame-delay';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { nextCursor } from '../../src/timeline/next-cursor';
import { playSequence } from '../../src/timeline/play-sequence';
import { setDuration } from '../../src/timeline/set-duration';
import { statusText } from '../../src/timeline/status-text';
import type { PlayOptions } from '../../src/timeline/timeline.type';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { frameAt, frameIds, freshDocument, live, pickRange, revision, withFrames } from './timeline-harness';

beforeEach(freshDocument);

const options: PlayOptions = { pingPong: false, tagId: null };

const tagFrames = (first: number, last: number, direction: 'forward' | 'reverse' | 'pingpong'): void => {
  pickRange(first, last);
  addTag();
  const id = live().sprite.tags.at(-1)?.id;
  if (!id) throw new Error('no tag');
  changeTag('Change tag', id, { direction });
};

const visited = (steps: number): number[] => {
  const ids = frameIds();
  const seen: number[] = [];
  useTimelineStore.getState().play();
  for (let step = 0; step < steps; step += 1) {
    if (!advancePlayback()) break;
    seen.push(ids.indexOf(live().frameId));
  }
  return seen;
};

describe('the play sequence', () => {
  it('runs every frame forward when the frame is in no tag', () => {
    const ids = withFrames(3);
    expect(playSequence(live().sprite, ids[0] as FrameId, options)).toEqual(ids);
  });

  it('runs a tag in its own loop mode and nothing outside it', () => {
    const [a, b, c, d] = withFrames(4);
    tagFrames(1, 3, 'reverse');
    const { sprite } = live();
    expect(playSequence(sprite, b as FrameId, options)).toEqual([d, c, b]);
    expect(playSequence(sprite, a as FrameId, options)).toEqual([a, b, c, d]);
  });

  it('ping-pongs without repeating the end frames', () => {
    const [a, b, c] = withFrames(3);
    tagFrames(0, 2, 'pingpong');
    expect(playSequence(live().sprite, a as FrameId, options)).toEqual([a, b, c, b]);
  });

  it('lets the ping-pong switch override the loop mode', () => {
    const [a, b, c] = withFrames(3);
    expect(playSequence(live().sprite, a as FrameId, { pingPong: true, tagId: null })).toEqual([a, b, c, b]);
  });

  it('prefers the picked tag where tags overlap', () => {
    const [, b, c] = withFrames(3);
    tagFrames(0, 1, 'forward');
    tagFrames(1, 2, 'reverse');
    const [first, second] = live().sprite.tags;
    expect(playSequence(live().sprite, b as FrameId, { pingPong: false, tagId: first?.id ?? null }).length).toBe(2);
    expect(playSequence(live().sprite, b as FrameId, { pingPong: false, tagId: second?.id ?? null })).toEqual([c, b]);
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
    goToFrame(frameAt(0));
    expect(visited(5)).toEqual([1, 2, 0, 1, 2]);
  });

  it('stops at the last frame when looping is off', () => {
    withFrames(3);
    goToFrame(frameAt(0));
    useTimelineStore.getState().setLoop(false);
    expect(visited(6)).toEqual([1, 2]);
    expect(useTimelineStore.getState().playing).toBe(false);
  });

  it('stays inside the tag the playhead is in', () => {
    withFrames(5);
    tagFrames(1, 2, 'forward');
    goToFrame(frameAt(1));
    expect(visited(5)).toEqual([2, 1, 2, 1, 2]);
  });

  it('ping-pongs inside a tag', () => {
    withFrames(5);
    tagFrames(1, 3, 'pingpong');
    goToFrame(frameAt(1));
    expect(visited(6)).toEqual([2, 3, 2, 1, 2, 3]);
  });

  it('follows a frame the user clicks while it plays', () => {
    withFrames(4);
    goToFrame(frameAt(0));
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
    const before = { revision: revision(), sprite: live().sprite };
    const view = useDocumentStore.getState().host.view(live().documentId);
    visited(9);
    useTimelineStore.getState().setPingPong(true);
    visited(9);
    expect(revision()).toBe(before.revision);
    expect(live().sprite).toBe(before.sprite);
    expect(useDocumentStore.getState().host.view(live().documentId)).toBe(view);
  });

  it('stops when the user starts to draw', () => {
    withFrames(3);
    useTimelineStore.getState().play();
    allowPress({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false }, live());
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
    expect(fpsOf(live().sprite, frameIds())).toBe(10);
    pickRange(0, 0);
    setDuration(50);
    pickRange(1, 1);
    setDuration(150);
    expect(fpsOf(live().sprite, frameIds())).toBe(10);
    pickRange(0, 1);
    setDuration(40);
    expect(fpsOf(live().sprite, frameIds())).toBe(25);
    expect(fpsOf(live().sprite, [])).toBe(0);
  });

  it('counts a repeated ping-pong frame twice in the rate', () => {
    const [a, b, c] = withFrames(3);
    pickRange(0, 0);
    setDuration(200);
    expect(fpsOf(live().sprite, [a as FrameId, b as FrameId, c as FrameId, b as FrameId])).toBe(8);
  });

  it('writes the status line', () => {
    withFrames(4);
    pickRange(1, 1);
    expect(statusText(live(), options)).toBe('Frame 2 of 4, 100 ms, 10 fps');
  });
});
