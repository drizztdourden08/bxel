/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { addTag } from '../../src/timeline/add-tag';
import { changeTag } from '../../src/timeline/change-tag';
import { deleteTag } from '../../src/timeline/delete-tag';
import { moveFrames } from '../../src/timeline/move-frames';
import { selectTag } from '../../src/timeline/select-tag';
import { setTagRange } from '../../src/timeline/set-tag-range';
import { tagLanes } from '../../src/timeline/tag-lanes';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { frameIds, freshDocument, live, noticeText, pickRange, revision, withFrames } from './timeline-harness';

beforeEach(freshDocument);

const tags = () => live().sprite.tags;

describe('tags', () => {
  it('adds a tag over the picked frames only and picks it', () => {
    const [, b, c] = withFrames(4);
    pickRange(1, 2);
    const before = revision();
    addTag();
    expect(tags()).toHaveLength(1);
    expect(tags()[0]).toMatchObject({ from: b, to: c, direction: 'forward' });
    expect(useTimelineStore.getState().tagId).toBe(tags()[0]?.id);
    expect(revision()).toBe(before + 1);
    stepHistory('undo');
    expect(tags()).toHaveLength(0);
  });

  it('gives a second tag a name of its own', () => {
    withFrames(3);
    pickRange(0, 0);
    addTag();
    pickRange(1, 2);
    addTag();
    const names = tags().map((tag) => tag.name);
    expect(new Set(names).size).toBe(2);
  });

  it('renames and sets the loop mode without touching the range', () => {
    const [a, , c] = withFrames(3);
    pickRange(0, 2);
    addTag();
    const id = tags()[0]?.id;
    if (!id) throw new Error('no tag');
    expect(changeTag('Rename tag', id, { name: 'walk' })).toBe(true);
    expect(changeTag('Change tag', id, { direction: 'pingpong' })).toBe(true);
    expect(tags()[0]).toMatchObject({ name: 'walk', direction: 'pingpong', from: a, to: c });
  });

  it('refuses a name another tag has and changes nothing', () => {
    withFrames(3);
    pickRange(0, 0);
    addTag();
    pickRange(1, 1);
    addTag();
    const [first, second] = tags();
    if (!first || !second) throw new Error('no tags');
    const before = revision();
    expect(changeTag('Rename tag', second.id, { name: first.name })).toBe(false);
    expect(revision()).toBe(before);
    expect(noticeText()).toBeDefined();
    expect(new Set(tags().map((tag) => tag.name)).size).toBe(2);
  });

});

describe('tag ranges', () => {
  it('sets the range to the picked frames and leaves the other tags alone', () => {
    const [a, b, c, d] = withFrames(4);
    pickRange(0, 0);
    addTag();
    pickRange(2, 3);
    addTag();
    const [first, second] = tags();
    if (!first || !second) throw new Error('no tags');
    pickRange(1, 2);
    expect(setTagRange(first.id)).toBe(true);
    expect(tags()[0]).toMatchObject({ from: b, to: c });
    expect(tags()[1]).toMatchObject({ from: c, to: d });
    expect(frameIds()).toEqual([a, b, c, d]);
  });

  it('follows its frames when they move', () => {
    const [a, b, c] = withFrames(3);
    pickRange(0, 1);
    addTag();
    pickRange(2, 2);
    moveFrames(-2);
    expect(frameIds()).toEqual([c, a, b]);
    expect(tags()[0]).toMatchObject({ from: a, to: b });
  });

  it('deletes a tag in one step and leaves the frames', () => {
    withFrames(3);
    pickRange(0, 1);
    addTag();
    const id = tags()[0]?.id;
    if (!id) throw new Error('no tag');
    expect(deleteTag(id)).toBe(true);
    expect(tags()).toHaveLength(0);
    expect(frameIds()).toHaveLength(3);
    expect(useTimelineStore.getState().tagId).toBeNull();
    stepHistory('undo');
    expect(tags()).toHaveLength(1);
  });

  it('picks the frames of a tag when its bar is clicked', () => {
    const [, b, c] = withFrames(4);
    pickRange(1, 2);
    addTag();
    pickRange(3, 3);
    const id = tags()[0]?.id;
    if (!id) throw new Error('no tag');
    selectTag(id);
    expect(useTimelineStore.getState().selection.frames).toEqual([b, c]);
    expect(live().frameId).toBe(b);
  });

  it('reports an unknown tag in plain words', () => {
    withFrames(2);
    expect(changeTag('Rename tag', 'tag_none' as never, { name: 'x' })).toBe(false);
    expect(noticeText()).toBeDefined();
  });
});

describe('tag bars', () => {
  it('lays overlapping tags on separate lanes with marked ends', () => {
    withFrames(4);
    pickRange(0, 2);
    addTag();
    pickRange(1, 3);
    addTag();
    const lanes = tagLanes(live().sprite, null);
    expect(lanes).toHaveLength(2);
    expect(lanes[0]?.map((cell) => cell?.edge ?? null)).toEqual(['start', 'mid', 'end', null]);
    expect(lanes[1]?.map((cell) => cell?.edge ?? null)).toEqual([null, 'start', 'mid', 'end']);
    expect(lanes[0]?.[0]?.name).not.toBe('');
    expect(lanes[0]?.[1]?.name).toBe('');
  });

  it('puts a tag that ends before another begins on the same lane', () => {
    withFrames(4);
    pickRange(0, 1);
    addTag();
    pickRange(2, 3);
    addTag();
    expect(tagLanes(live().sprite, null)).toHaveLength(1);
  });
});
