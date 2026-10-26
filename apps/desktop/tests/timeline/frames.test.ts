/* @layer renderer-app @kind test */
import { findSprite } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { addFrame } from '../../src/timeline/add-frame';
import { deleteFrames } from '../../src/timeline/delete-frames';
import { dragFrame } from '../../src/timeline/drag-frame';
import { duplicateFrames } from '../../src/timeline/duplicate-frames';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { moveFrames } from '../../src/timeline/move-frames';
import { setDuration } from '../../src/timeline/set-duration';
import { stepFrame } from '../../src/timeline/step-frame';
import { animationOf, durations, frameAt, frameIds, freshAnimation, live, noticeText, paintFrame, pickRange, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

const spriteIds = (): (string | null)[] => animationOf().frames.map((frame) => frame.spriteId);

describe('adding a frame', () => {
  it('puts a blank frame of its own after the current one and picks it', () => {
    withFrames(2);
    addFrame();
    expect(frameIds()).toHaveLength(3);
    expect(useTimelineStore.getState().frameId).toBe(frameAt(1));
    const sprite = findSprite(live().artwork, spriteIds()[1] as never);
    expect(sprite?.role).toBe('frame');
    expect(spriteIds().filter((id) => id !== null)).toHaveLength(3);
  });

  it('is one undo step', () => {
    withFrames(2);
    addFrame();
    useDocumentStore.getState().host.undo(live().documentId);
    expect(frameIds()).toHaveLength(2);
    expect(live().artwork.sprites.filter((sprite) => sprite.role === 'frame')).toHaveLength(2);
  });
});

describe('duplicating frames', () => {
  it('copies the sprite each owned frame draws on, in order, and picks the copies', () => {
    withFrames(3);
    paintFrame(0, 1, 1, 2);
    paintFrame(1, 2, 2, 3);
    pickRange(0, 1);
    duplicateFrames();
    const ids = spriteIds();
    expect(ids).toHaveLength(5);
    expect(new Set(ids).size).toBe(5);
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(2), frameAt(3)]);
    const [original, , copy] = ids.map((id) => findSprite(live().artwork, id as never));
    expect(copy?.cels).not.toBe(original?.cels);
    expect(Object.values(copy?.cels ?? {})[0]?.pixels).toEqual(Object.values(original?.cels ?? {})[0]?.pixels);
  });
});

describe('deleting frames', () => {
  it('removes the picked frames and picks the next one', () => {
    withFrames(4);
    pickRange(1, 2);
    deleteFrames();
    expect(frameIds()).toHaveLength(2);
    expect(useTimelineStore.getState().frameId).toBe(frameAt(1));
  });

  it('keeps the last frame and says why', () => {
    withFrames(2);
    pickRange(0, 1);
    deleteFrames();
    expect(frameIds()).toHaveLength(2);
    expect(noticeText()).toMatch(/keeps at least one frame/);
  });
});

describe('moving frames', () => {
  it('moves the picked frames by their keys and by dragging', () => {
    const [a, b, c] = withFrames(3);
    moveFrames(1);
    expect(frameIds()).toEqual([b, a, c]);
    expect(dragFrame(2, 0)).toBe(true);
    expect(frameIds()).toEqual([c, b, a]);
    expect(moveFrames(-1, [c])).toBe(false);
  });
});

describe('timing', () => {
  it('sets the time of every picked frame at once', () => {
    withFrames(3);
    pickRange(0, 1);
    expect(setDuration(240)).toBe(true);
    expect(durations()).toEqual([240, 240, 100]);
  });

  it('refuses a time that is not a number', () => {
    withFrames(2);
    expect(setDuration(Number.NaN)).toBe(false);
    expect(durations()).toEqual([100, 100]);
  });
});

describe('moving along the frames', () => {
  it('steps to the neighbour and stays at the ends', () => {
    withFrames(3);
    stepFrame(1);
    expect(useTimelineStore.getState().frameId).toBe(frameAt(1));
    stepFrame(5);
    expect(useTimelineStore.getState().frameId).toBe(frameAt(2));
    stepFrame(-9);
    expect(useTimelineStore.getState().frameId).toBe(frameAt(0));
  });

  it('extends the pick with Shift and adds with Control', () => {
    withFrames(4);
    goToFrame(frameAt(2), true);
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(0), frameAt(1), frameAt(2)]);
    goToFrame(frameAt(3), false, true);
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(0), frameAt(1), frameAt(2), frameAt(3)]);
    goToFrame(frameAt(1), false, true);
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(0), frameAt(2), frameAt(3)]);
  });
});
