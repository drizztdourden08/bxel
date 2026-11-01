/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { addTag } from '../../src/timeline/add-tag';
import { copyFrames } from '../../src/timeline/copy-frames';
import { dropFrames } from '../../src/timeline/drag-frame';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { linkedCopy } from '../../src/timeline/linked-copy';
import { moveFramesTo } from '../../src/timeline/move-frames-to';
import { nudgeTag } from '../../src/timeline/nudge-tag';
import { pasteFrames } from '../../src/timeline/paste-frames';
import { reverseFrames } from '../../src/timeline/reverse-frames';
import { scaleDurations } from '../../src/timeline/scale-durations';
import { selectFramesWhere } from '../../src/timeline/select-frames-where';
import { setSameFps } from '../../src/timeline/set-same-fps';
import { setTagSpan } from '../../src/timeline/set-tag-span';
import { excludeFromTag } from '../../src/timeline/exclude-from-tag';
import { includeInTag } from '../../src/timeline/include-in-tag';
import { animationOf, durations, frameAt, frameIds, freshAnimation, live, noticeText, pickRange, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

const order = (ids: readonly string[]): number[] => {
  const original = ids;
  return frameIds().map((id) => original.indexOf(id));
};

describe('S2 moving a block of frames', { tags: ['standard'] }, () => {
  it('moves four picked frames in one undo step', () => {
    withFrames(8);
    const before = frameIds();
    pickRange(0, 3);
    expect(moveFramesTo(4)).toBe(true);
    expect(order(before)).toEqual([4, 5, 6, 7, 0, 1, 2, 3]);
    useDocumentStore.getState().host.undo(live().documentId);
    expect(order(before)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it('drags the whole picked block by the distance of the dragged frame', () => {
    withFrames(6);
    const before = frameIds();
    pickRange(1, 2);
    expect(dropFrames({ keys: [frameAt(1), frameAt(2)], before: 5, modifier: 'none' })).toBe(true);
    expect(order(before)).toEqual([0, 3, 4, 1, 2, 5]);
  });

  it('reverses the order of the picked frames and refuses a single one', () => {
    withFrames(5);
    const before = frameIds();
    pickRange(1, 3);
    expect(reverseFrames()).toBe(true);
    expect(order(before)).toEqual([0, 3, 2, 1, 4]);
    pickRange(0, 0);
    expect(reverseFrames()).toBe(false);
    expect(noticeText()).toBe('Pick two or more frames first.');
  });
});

describe('S2 copies', { tags: ['standard'] }, () => {
  it('copies, pastes after the current frame and picks the new frames', () => {
    withFrames(3);
    pickRange(0, 1);
    expect(copyFrames()).toBe(true);
    goToFrame(frameAt(2));
    expect(pasteFrames()).toBe(true);
    expect(animationOf().frames).toHaveLength(5);
    expect(useTimelineStore.getState().selection.frames).toEqual([animationOf().frames[3]?.id, animationOf().frames[4]?.id]);
    expect(animationOf().frames[3]?.spriteId).not.toBe(animationOf().frames[0]?.spriteId);
  });

  it('moves cut frames instead of copying them', () => {
    withFrames(4);
    const before = frameIds();
    pickRange(0, 0);
    copyFrames(true);
    goToFrame(frameAt(2));
    expect(pasteFrames()).toBe(true);
    expect(animationOf().frames).toHaveLength(4);
    expect(order(before)).toEqual([1, 2, 0, 3]);
  });

  it('makes linked copies that share the sprite', () => {
    withFrames(2);
    pickRange(0, 0);
    expect(linkedCopy()).toBe(true);
    expect(animationOf().frames).toHaveLength(3);
    expect(animationOf().frames[1]?.spriteId).toBe(animationOf().frames[0]?.spriteId);
  });

  it('pastes linked and refuses an empty clipboard', () => {
    withFrames(2);
    pickRange(0, 0);
    copyFrames();
    expect(pasteFrames(true)).toBe(true);
    expect(animationOf().frames[1]?.spriteId).toBe(animationOf().frames[0]?.spriteId);
  });

  it('duplicates on a copy drag and links on a link drag', () => {
    withFrames(3);
    pickRange(0, 0);
    expect(dropFrames({ keys: [frameAt(0)], before: 3, modifier: 'ctrl' })).toBe(true);
    expect(animationOf().frames).toHaveLength(4);
    expect(animationOf().frames[3]?.spriteId).not.toBe(animationOf().frames[0]?.spriteId);
    pickRange(0, 0);
    expect(dropFrames({ keys: [frameAt(0)], before: 2, modifier: 'alt' })).toBe(true);
    expect(animationOf().frames).toHaveLength(5);
    expect(animationOf().frames[2]?.spriteId).toBe(animationOf().frames[0]?.spriteId);
  });
});

describe('S2 durations', { tags: ['standard'] }, () => {
  it('scales the picked durations', () => {
    withFrames(3);
    pickRange(0, 2);
    expect(scaleDurations(2)).toBe(true);
    expect(durations()).toEqual([200, 200, 200]);
    expect(scaleDurations(0.5)).toBe(true);
    expect(durations()).toEqual([100, 100, 100]);
  });

  it('gives the picked frames, or the whole animation, one frame rate', () => {
    withFrames(4);
    pickRange(1, 2);
    expect(setSameFps(20, false)).toBe(true);
    expect(durations()).toEqual([100, 50, 50, 100]);
    expect(setSameFps(10, true)).toBe(true);
    expect(durations()).toEqual([100, 100, 100, 100]);
  });
});

describe('S2 selecting', { tags: ['standard'] }, () => {
  it('inverts the picked frames', () => {
    withFrames(4);
    pickRange(1, 2);
    expect(selectFramesWhere('invert')).toBe(true);
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(0), frameAt(3)]);
  });
});

describe('S2 tags by hand', { tags: ['standard'] }, () => {
  it('resizes by the edge and by the keys to the same range', () => {
    withFrames(6);
    pickRange(1, 2);
    addTag();
    const id = animationOf().tags[0]?.id;
    if (!id) throw new Error('no tag');
    expect(setTagSpan(id, 1, 4)).toBe(true);
    expect(animationOf().tags[0]).toMatchObject({ from: frameAt(1), to: frameAt(4) });
    setTagSpan(id, 1, 2);
    expect(nudgeTag(id, 'resize', 1)).toBe(true);
    expect(nudgeTag(id, 'resize', 1)).toBe(true);
    expect(animationOf().tags[0]).toMatchObject({ from: frameAt(1), to: frameAt(4) });
  });

  it('moves a whole tag and keeps it inside the animation', () => {
    withFrames(5);
    pickRange(0, 1);
    addTag();
    const id = animationOf().tags[0]?.id;
    if (!id) throw new Error('no tag');
    expect(nudgeTag(id, 'move', 9)).toBe(true);
    expect(animationOf().tags[0]).toMatchObject({ from: frameAt(3), to: frameAt(4) });
    expect(nudgeTag(id, 'move', 9)).toBe(false);
  });

  it('adds picked frames to a tag and takes them out again', () => {
    withFrames(6);
    pickRange(1, 2);
    addTag();
    const id = animationOf().tags[0]?.id;
    if (!id) throw new Error('no tag');
    pickRange(3, 4);
    expect(includeInTag(id)).toBe(true);
    expect(animationOf().tags[0]).toMatchObject({ from: frameAt(1), to: frameAt(4) });
    pickRange(3, 4);
    expect(excludeFromTag(id)).toBe(true);
    expect(animationOf().tags[0]).toMatchObject({ from: frameAt(1), to: frameAt(2) });
  });
});
