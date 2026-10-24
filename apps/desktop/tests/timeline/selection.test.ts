/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { addLayer } from '../../src/editor/add-layer';
import { NO_SELECTION } from '../../src/stores/timeline-store.constants';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { effectiveSelection } from '../../src/timeline/effective-selection';
import { goToCel } from '../../src/timeline/go-to-cel';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { jumpFrame } from '../../src/timeline/jump-frame';
import { moveCursor } from '../../src/timeline/move-cursor';
import { selectCel } from '../../src/timeline/select-cel';
import { selectFrames } from '../../src/timeline/select-frames';
import { timelineModel } from '../../src/timeline/timeline-model';
import { frameAt, freshDocument, layerIds, live, paintCel, pickCels, pickRange, revision, withFrames } from './timeline-harness';

beforeEach(freshDocument);

const rowMarks = (cells: readonly { selected: boolean }[]): string => cells.map((cell) => cell.selected).join();

const selectedMarks = (): string[] =>
  timelineModel(live(), useTimelineStore.getState().selection, null).rows.map((row) => rowMarks(row.cells));

describe('going to a cel', () => {
  it('goes to the clicked cel: its frame is current and its layer is active', () => {
    withFrames(3);
    addLayer();
    const bottom = layerIds()[0];
    if (!bottom) throw new Error('no layer');
    goToCel({ layerId: bottom, frameId: frameAt(2) });
    expect(live().frameId).toBe(frameAt(2));
    expect(live().layerId).toBe(bottom);
    expect(useToolStore.getState().layerId).toBe(bottom);
  });

  it('draws into the current frame, not the first', () => {
    withFrames(3);
    goToFrame(frameAt(2));
    expect(live().frameId).toBe(frameAt(2));
    paintCel(2, 4, 3);
    const { sprite, layer } = live();
    expect(layer.cels[frameAt(2)]).toBeDefined();
    expect(layer.cels[frameAt(0)]).toBeUndefined();
    expect(sprite.frames).toHaveLength(3);
  });

});

describe('picking ranges of cels', () => {
  it('extends a rectangle from the anchor with Shift', () => {
    withFrames(4);
    addLayer();
    addLayer();
    pickCels({ layer: 0, frame: 1 }, { layer: 1, frame: 3 });
    const { selection } = useTimelineStore.getState();
    expect(selection.frames).toEqual([frameAt(1), frameAt(2), frameAt(3)]);
    expect(selection.layers).toEqual(layerIds().slice(0, 2));
    expect(live().frameId).toBe(frameAt(3));
  });

  it('extends a frame range from the header and then covers every layer', () => {
    withFrames(4);
    addLayer();
    pickRange(1, 2);
    const { selection } = useTimelineStore.getState();
    expect(selection.frames).toEqual([frameAt(1), frameAt(2)]);
    expect(selection.layers).toEqual([]);
    expect(new Set(selectedMarks())).toEqual(new Set(['false,true,true,false']));
  });

  it('starts a new pick without Shift', () => {
    withFrames(4);
    pickRange(0, 2);
    goToFrame(frameAt(3));
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(3)]);
  });

  it('works on stale ids by dropping them', () => {
    const [a] = withFrames(2);
    const stale = { frames: [a as never, 'frm_gone' as never], layers: [], anchor: null };
    expect(effectiveSelection(live().sprite, stale, { layerId: live().layerId, frameId: frameAt(1) }).frames).toEqual([a]);
    expect(effectiveSelection(live().sprite, NO_SELECTION, { layerId: live().layerId, frameId: frameAt(1) })).toEqual({
      frames: [frameAt(1)],
      layers: [live().layerId],
    });
  });

  it('builds spans the same way in either direction', () => {
    withFrames(3);
    const { sprite } = live();
    const key = (frame: number) => ({ layerId: live().layerId, frameId: frameAt(frame) });
    const forward = selectCel(sprite, NO_SELECTION, key(2), false);
    const backward = selectCel(sprite, forward, key(0), true);
    expect(backward.frames).toEqual([frameAt(0), frameAt(1), frameAt(2)]);
    expect(selectFrames(sprite, backward, key(1), true).frames).toEqual([frameAt(1), frameAt(2)]);
  });
});

describe('moving the cursor', () => {
  it('steps by frame and layer and stops at the edges', () => {
    withFrames(3);
    moveCursor({ frames: 1, layers: 0 }, false);
    expect(live().frameId).toBe(frameAt(1));
    moveCursor({ frames: 5, layers: 0 }, false);
    expect(live().frameId).toBe(frameAt(2));
    moveCursor({ frames: -9, layers: 0 }, false);
    expect(live().frameId).toBe(frameAt(0));
    jumpFrame('last');
    expect(live().frameId).toBe(frameAt(2));
    jumpFrame('first');
    expect(live().frameId).toBe(frameAt(0));
  });

  it('extends the pick with Shift and does not touch the document', () => {
    withFrames(4);
    const before = revision();
    moveCursor({ frames: 1, layers: 0 }, false);
    moveCursor({ frames: 1, layers: 0 }, true);
    moveCursor({ frames: 1, layers: 0 }, true);
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(1), frameAt(2), frameAt(3)]);
    expect(revision()).toBe(before);
  });

  it('moves up and down the layers', () => {
    withFrames(1);
    addLayer();
    const [bottom, top] = layerIds();
    moveCursor({ frames: 0, layers: -1 }, false);
    expect(live().layerId).toBe(bottom);
    moveCursor({ frames: 0, layers: 1 }, false);
    expect(live().layerId).toBe(top);
  });
});
