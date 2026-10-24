/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { deleteInZone } from '../../src/timeline/delete-in-zone';
import { runKeyAction } from '../../src/views/TimelinePanel/behavior/run-key-action';
import { timelineKeyAction } from '../../src/views/TimelinePanel/behavior/timeline-key-action';
import { key } from './key-info';
import { frameAt, frameIds, freshDocument, layerIds, live, paintCel, pickCels, pickRange, withFrames } from './timeline-harness';

beforeEach(freshDocument);

describe('timeline keys', () => {
  it('plays and pauses on Enter and Space in the grid only', () => {
    expect(timelineKeyAction(key('Enter'), 'cel')).toEqual({ kind: 'play' });
    expect(timelineKeyAction(key(' '), 'cel')).toEqual({ kind: 'play' });
    expect(timelineKeyAction(key('Enter'), null)).toBeNull();
    expect(timelineKeyAction(key(' '), null)).toBeNull();
  });

  it('steps a frame with comma and period wherever the timeline has focus', () => {
    expect(timelineKeyAction(key(','), null)).toEqual({ kind: 'cursor', by: { frames: -1, layers: 0 }, extend: false });
    expect(timelineKeyAction(key('.'), 'cel')).toEqual({ kind: 'cursor', by: { frames: 1, layers: 0 }, extend: false });
  });

  it('moves the cursor with the arrows and extends with Shift', () => {
    expect(timelineKeyAction(key('ArrowRight'), 'cel')).toEqual({ kind: 'cursor', by: { frames: 1, layers: 0 }, extend: false });
    expect(timelineKeyAction(key('ArrowUp', { shiftKey: true }), 'cel')).toEqual({ kind: 'cursor', by: { frames: 0, layers: 1 }, extend: true });
  });

  it('moves frames with Alt and Left or Right, and cels with Alt and Shift', () => {
    expect(timelineKeyAction(key('ArrowLeft', { altKey: true }), 'cel')).toEqual({ kind: 'moveFrames', delta: -1 });
    expect(timelineKeyAction(key('ArrowUp', { altKey: true }), 'cel')).toBeNull();
    expect(timelineKeyAction(key('ArrowRight', { altKey: true, shiftKey: true }), 'cel')).toEqual({
      kind: 'moveCels',
      by: { frames: 1, layers: 0 },
    });
  });

  it('jumps with Home and End and leaves Delete to the timeline command', () => {
    expect(timelineKeyAction(key('Home'), 'cel')).toEqual({ kind: 'edge', end: 'first' });
    expect(timelineKeyAction(key('End'), 'cel')).toEqual({ kind: 'edge', end: 'last' });
    expect(timelineKeyAction(key('Delete'), 'cel')).toBeNull();
  });

  it('leaves the chords with Ctrl or Meta to the app', () => {
    expect(timelineKeyAction(key('ArrowLeft', { ctrlKey: true }), 'head')).toBeNull();
    expect(timelineKeyAction(key(',', { metaKey: true }), 'cel')).toBeNull();
    expect(timelineKeyAction(key('x'), 'cel')).toBeNull();
  });
});

describe('running a key', () => {
  it('plays and pauses', () => {
    withFrames(2);
    runKeyAction({ kind: 'play' });
    expect(useTimelineStore.getState().playing).toBe(true);
    runKeyAction({ kind: 'play' });
    expect(useTimelineStore.getState().playing).toBe(false);
  });

  it('steps the frame', () => {
    withFrames(3);
    runKeyAction({ kind: 'cursor', by: { frames: 1, layers: 0 }, extend: false });
    expect(live().frameId).toBe(frameAt(1));
    runKeyAction({ kind: 'edge', end: 'last' });
    expect(live().frameId).toBe(frameAt(2));
  });

  it('moves the picked frames with Alt and an arrow', () => {
    const [a, b, c] = withFrames(3);
    pickRange(0, 0);
    runKeyAction({ kind: 'moveFrames', delta: 1 });
    expect(frameIds()).toEqual([b, a, c]);
  });

  it('clears and moves the picked cels', () => {
    withFrames(3);
    paintCel(0, 1, 2);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 0 });
    const cel = live().layer.cels[frameAt(0)];
    runKeyAction({ kind: 'moveCels', by: { frames: 1, layers: 0 } });
    expect(live().layer.cels[frameAt(1)]).toBe(cel);
    expect(live().layer.cels[frameAt(0)]).toBeUndefined();
    useTimelineStore.getState().setZone('cel');
    deleteInZone();
    expect(live().layer.cels[frameAt(1)]).toBeUndefined();
    expect(layerIds()).toHaveLength(1);
  });
});
