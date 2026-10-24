/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { currentPick } from '../../src/editor/current-pick';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { addTag } from '../../src/timeline/add-tag';
import { deleteInZone } from '../../src/timeline/delete-in-zone';
import { runKeyAction } from '../../src/views/TimelinePanel/behavior/run-key-action';
import { timelineKeyAction } from '../../src/views/TimelinePanel/behavior/timeline-key-action';
import { gridHtml } from './grid-html';
import { key } from './key-info';
import { frameAt, freshDocument, layerIds, live, pickRange, revision, withFrames } from './timeline-harness';

beforeEach(freshDocument);

const twoTags = (): void => {
  withFrames(4);
  pickRange(0, 1);
  addTag();
  pickRange(2, 3);
  addTag();
};

describe('keys on the frame headers', () => {
  it('steps along the headers with the arrows and extends with Shift', () => {
    expect(timelineKeyAction(key('ArrowRight'), 'head')).toEqual({ kind: 'frame', delta: 1, extend: false });
    expect(timelineKeyAction(key('ArrowLeft', { shiftKey: true }), 'head')).toEqual({ kind: 'frame', delta: -1, extend: true });
    expect(timelineKeyAction(key('End'), 'head')).toMatchObject({ kind: 'frame', delta: Number.POSITIVE_INFINITY });
    expect(timelineKeyAction(key('Home'), 'head')).toMatchObject({ kind: 'frame', delta: Number.NEGATIVE_INFINITY });
  });

  it('moves the frame with Alt and Left or Right', () => {
    expect(timelineKeyAction(key('ArrowRight', { altKey: true }), 'head')).toEqual({ kind: 'moveFrames', delta: 1 });
  });

  it('goes up to the tags and down to the cels, and leaves Enter and Space to the button', () => {
    expect(timelineKeyAction(key('ArrowUp'), 'head')).toEqual({ kind: 'zone', zone: 'tag' });
    expect(timelineKeyAction(key('ArrowDown'), 'head')).toEqual({ kind: 'zone', zone: 'cel' });
    expect(timelineKeyAction(key('Enter'), 'head')).toBeNull();
    expect(timelineKeyAction(key(' '), 'head')).toBeNull();
  });
});

describe('keys on the tag bars', () => {
  it('steps between tags, goes down to the headers and leaves Delete to the timeline command', () => {
    expect(timelineKeyAction(key('ArrowRight'), 'tag')).toEqual({ kind: 'tag', delta: 1 });
    expect(timelineKeyAction(key('ArrowLeft'), 'tag')).toEqual({ kind: 'tag', delta: -1 });
    expect(timelineKeyAction(key('ArrowDown'), 'tag')).toEqual({ kind: 'zone', zone: 'head' });
    expect(timelineKeyAction(key('Delete'), 'tag')).toBeNull();
    expect(timelineKeyAction(key('Enter'), 'tag')).toBeNull();
  });
});

describe('Control keys in the cels', () => {
  it('parks the cursor with Control and an arrow and adds its cel with Control and Space or Enter', () => {
    expect(timelineKeyAction(key('ArrowRight', { ctrlKey: true }), 'cel')).toEqual({ kind: 'park', by: { frames: 1, layers: 0 } });
    expect(timelineKeyAction(key(' ', { ctrlKey: true }), 'cel')).toEqual({ kind: 'addPick' });
    expect(timelineKeyAction(key('Enter', { metaKey: true }), 'cel')).toEqual({ kind: 'addPick' });
    expect(timelineKeyAction(key(' ', { ctrlKey: true }), 'head')).toBeNull();
    expect(timelineKeyAction(key('ArrowRight', { ctrlKey: true }), null)).toBeNull();
  });
});

describe('running the lane keys', () => {
  it('steps the frame from the headers and picks it', () => {
    withFrames(4);
    runKeyAction({ kind: 'frame', delta: 1, extend: false });
    expect(live().frameId).toBe(frameAt(1));
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(1)]);
    runKeyAction({ kind: 'frame', delta: 1, extend: true });
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(1), frameAt(2)]);
    runKeyAction({ kind: 'frame', delta: Number.POSITIVE_INFINITY, extend: false });
    expect(live().frameId).toBe(frameAt(3));
    runKeyAction({ kind: 'frame', delta: Number.NEGATIVE_INFINITY, extend: false });
    expect(live().frameId).toBe(frameAt(0));
  });

  it('moves between the cels, the headers and the tags', () => {
    twoTags();
    runKeyAction({ kind: 'zone', zone: 'head' });
    expect(useTimelineStore.getState().zone).toBe('head');
    runKeyAction({ kind: 'zone', zone: 'tag' });
    expect(useTimelineStore.getState().zone).toBe('tag');
  });

  it('stays out of the tag bars when the sprite has no tag', () => {
    withFrames(2);
    runKeyAction({ kind: 'zone', zone: 'tag' });
    expect(useTimelineStore.getState().zone).toBe('cel');
  });

  it('steps from tag to tag and picks the frames of each', () => {
    twoTags();
    const [first, second] = live().sprite.tags;
    runKeyAction({ kind: 'tag', delta: -1 });
    expect(useTimelineStore.getState().tagId).toBe(first?.id);
    runKeyAction({ kind: 'tag', delta: 1 });
    expect(useTimelineStore.getState().tagId).toBe(second?.id);
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(2), frameAt(3)]);
    runKeyAction({ kind: 'tag', delta: 1 });
    expect(useTimelineStore.getState().tagId).toBe(second?.id);
  });

  it('parks the cursor without changing the pick, then adds the cursor cel', () => {
    withFrames(4);
    runKeyAction({ kind: 'cursor', by: { frames: 0, layers: 0 }, extend: false });
    const pick = useTimelineStore.getState().selection;
    runKeyAction({ kind: 'park', by: { frames: 2, layers: 0 } });
    expect(live().frameId).toBe(frameAt(2));
    expect(useTimelineStore.getState().selection).toEqual(pick);
    runKeyAction({ kind: 'addPick' });
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(0), frameAt(2)]);
    expect(layerIds()).toHaveLength(1);
  });
});

describe('the grid in the tab order', () => {
  it('has one stop on the tag bars, one on the frame headers and one on the cels', () => {
    twoTags();
    const html = gridHtml();
    expect(html.match(/data-timeline-zone="tag"/g)).toHaveLength(2);
    expect(html.match(/data-timeline-zone="head"/g)).toHaveLength(4);
    expect(html.match(/data-timeline-zone="head"[^>]*data-roving="yes"|data-roving="yes"[^>]*data-timeline-zone="head"/g)).toHaveLength(1);
    expect(html.match(/data-timeline-zone="tag"[^>]*data-roving="yes"|data-roving="yes"[^>]*data-timeline-zone="tag"/g)).toHaveLength(1);
    expect(html.match(/tabindex="0"/g)).toHaveLength(3);
  });

  it('puts the tag stop on the picked tag, or on the first tag when none is picked', () => {
    twoTags();
    const second = live().sprite.tags[1];
    expect(second).toBeDefined();
    expect(gridHtml()).toMatch(new RegExp(`${second?.name ?? ''}, Forward"[^>]*tabindex="0"|tabindex="0"[^>]*${second?.name ?? ''}, Forward"`));
    useTimelineStore.getState().selectTag(null);
    const first = live().sprite.tags[0];
    expect(gridHtml()).toMatch(new RegExp(`${first?.name ?? ''}, Forward"[^>]*tabindex="0"|tabindex="0"[^>]*${first?.name ?? ''}, Forward"`));
  });

  it('keeps the zone and the current pick for the export and the file preview', () => {
    withFrames(3);
    expect(currentPick().frameId).toBe(frameAt(0));
    expect(useTimelineStore.getState().zone).toBe('cel');
  });
});

describe('the Delete command of the timeline zone', () => {
  it('deletes the picked tag with one undo step', () => {
    twoTags();
    const before = revision();
    useTimelineStore.getState().setZone('tag');
    deleteInZone();
    expect(live().sprite.tags).toHaveLength(1);
    expect(revision()).toBe(before + 1);
    deleteInZone();
    expect(live().sprite.tags).toHaveLength(1);
  });

  it('leaves the tags alone when Delete comes from the frame headers', () => {
    twoTags();
    useTimelineStore.getState().setZone('head');
    deleteInZone();
    expect(live().sprite.tags).toHaveLength(2);
  });
});
