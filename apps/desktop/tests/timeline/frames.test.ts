/* @layer renderer-app @kind test */
import { flattenFrame } from '@bxel/document';
import type { FrameId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { addFrame } from '../../src/timeline/add-frame';
import { deleteFrames } from '../../src/timeline/delete-frames';
import { dragFrame } from '../../src/timeline/drag-frame';
import { duplicateFrames } from '../../src/timeline/duplicate-frames';
import { moveFrames } from '../../src/timeline/move-frames';
import { setDuration } from '../../src/timeline/set-duration';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { durations, frameAt, frameIds, freshDocument, live, noticeText, paintCel, pickRange, revision, withFrames } from './timeline-harness';

beforeEach(freshDocument);

describe('adding a frame', () => {
  it('adds a blank frame after the current one, picks it and undoes in one step', () => {
    const [first] = frameIds();
    const before = revision();
    addFrame();
    const ids = frameIds();
    expect(ids).toHaveLength(2);
    expect(ids[0]).toBe(first);
    expect(live().frameId).toBe(ids[1]);
    expect(useTimelineStore.getState().selection.frames).toEqual([ids[1]]);
    expect(revision()).toBe(before + 1);
    stepHistory('undo');
    expect(frameIds()).toEqual([first]);
  });

  it('inserts after the current frame, not at the end', () => {
    const [a, b] = withFrames(2);
    pickRange(0, 0);
    addFrame();
    const ids = frameIds();
    expect(ids[0]).toBe(a);
    expect(ids[2]).toBe(b);
    expect(live().frameId).toBe(ids[1]);
  });
});

describe('duplicating frames', () => {
  it('copies a picked range after the range, with its pixels and durations, as one undo step', () => {
    const [a, b, c] = withFrames(3);
    paintCel(0, 1, 2);
    paintCel(1, 2, 3);
    pickRange(0, 1);
    setDuration(250);
    const before = revision();
    duplicateFrames();
    const ids = frameIds();
    expect(ids).toHaveLength(5);
    expect(ids.slice(0, 2)).toEqual([a, b]);
    expect(ids[4]).toBe(c);
    const { sprite } = live();
    expect(Array.from(flattenFrame(sprite, frameAt(2)))).toEqual(Array.from(flattenFrame(sprite, frameAt(0))));
    expect(Array.from(flattenFrame(sprite, frameAt(3)))).toEqual(Array.from(flattenFrame(sprite, frameAt(1))));
    expect(durations()).toEqual([250, 250, 250, 250, 100]);
    expect(useTimelineStore.getState().selection.frames).toEqual([ids[2], ids[3]]);
    expect(revision()).toBe(before + 1);
    stepHistory('undo');
    expect(frameIds()).toEqual([a, b, c]);
  });

  it('gives each copy its own pixels', () => {
    const [a] = withFrames(2);
    paintCel(0, 1, 2);
    pickRange(0, 0);
    duplicateFrames();
    const layer = live().sprite.layers[0];
    expect(layer?.cels[a as FrameId]).toBeDefined();
    expect(layer?.cels[frameAt(1)]).not.toBe(layer?.cels[a as FrameId]);
  });
});

describe('deleting frames', () => {
  it('deletes only the picked range, lands on the frame that took its place and undoes in one step', () => {
    const [a, b, c, d] = withFrames(4);
    pickRange(1, 2);
    const before = revision();
    deleteFrames();
    expect(frameIds()).toEqual([a, d]);
    expect(live().frameId).toBe(d);
    expect(revision()).toBe(before + 1);
    stepHistory('undo');
    expect(frameIds()).toEqual([a, b, c, d]);
  });

  it('refuses to delete every frame and changes nothing', () => {
    withFrames(3);
    pickRange(0, 2);
    const before = revision();
    deleteFrames();
    expect(frameIds()).toHaveLength(3);
    expect(revision()).toBe(before);
    expect(noticeText()).toBe('A sprite keeps at least one frame.');
  });
});

describe('moving frames', () => {
  it('moves one frame by a step and keeps it current', () => {
    const [a, b, c] = withFrames(3);
    pickRange(0, 0);
    expect(moveFrames(1)).toBe(true);
    expect(frameIds()).toEqual([b, a, c]);
    expect(live().frameId).toBe(a);
  });

  it('moves a picked range as one block in one undo step', () => {
    const [a, b, c, d] = withFrames(4);
    pickRange(0, 1);
    const before = revision();
    expect(moveFrames(2)).toBe(true);
    expect(frameIds()).toEqual([c, d, a, b]);
    expect(revision()).toBe(before + 1);
    stepHistory('undo');
    expect(frameIds()).toEqual([a, b, c, d]);
  });

  it('stops at the ends instead of failing', () => {
    const [a, b, c] = withFrames(3);
    pickRange(1, 2);
    expect(moveFrames(5)).toBe(false);
    expect(frameIds()).toEqual([a, b, c]);
    expect(moveFrames(-5)).toBe(true);
    expect(frameIds()).toEqual([b, c, a]);
  });

  it('moves a dragged frame by its drop place, and the whole range when the frame is in it', () => {
    const [a, b, c, d] = withFrames(4);
    pickRange(0, 0);
    expect(dragFrame(2, 0)).toBe(true);
    expect(frameIds()).toEqual([c, a, b, d]);
    pickRange(1, 2);
    expect(dragFrame(1, 2)).toBe(true);
    expect(frameIds()).toEqual([c, d, a, b]);
  });
});

describe('frame durations', () => {
  it('sets the duration of the picked range only', () => {
    withFrames(4);
    pickRange(1, 2);
    expect(setDuration(40)).toBe(true);
    expect(durations()).toEqual([100, 40, 40, 100]);
  });

  it('sets only the current frame when none is picked as a range', () => {
    withFrames(3);
    pickRange(2, 2);
    setDuration(500);
    expect(durations()).toEqual([100, 100, 500]);
  });

  it('keeps a duration inside the document limits and ignores a blank value', () => {
    withFrames(2);
    pickRange(0, 0);
    setDuration(0);
    expect(durations()[0]).toBe(1);
    setDuration(900_000);
    expect(durations()[0]).toBe(65_535);
    const before = revision();
    expect(setDuration(Number.NaN)).toBe(false);
    expect(revision()).toBe(before);
  });

  it('is one undo step for a range', () => {
    withFrames(3);
    pickRange(0, 2);
    const before = revision();
    setDuration(60);
    expect(revision()).toBe(before + 1);
    stepHistory('undo');
    expect(durations()).toEqual([100, 100, 100]);
  });
});
