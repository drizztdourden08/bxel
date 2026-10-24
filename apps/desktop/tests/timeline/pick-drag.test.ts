/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { addLayer } from '../../src/editor/add-layer';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { clearCels } from '../../src/timeline/clear-cels';
import { dragCels } from '../../src/timeline/drag-cels';
import { goToCel } from '../../src/timeline/go-to-cel';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { celAt, frameAt, freshDocument, layerIds, live, noticeText, paintCel, pickCels, revision, withFrames } from './timeline-harness';

beforeEach(freshDocument);

const cel = (layer: number, frame: number) => ({ layerId: layerIds()[layer] ?? layerIds()[0], frameId: frameAt(frame) }) as never;

const picked = () => useTimelineStore.getState().selection;

describe('adding cels to the pick with Control and click', () => {
  it('keeps the cels already picked and adds the clicked one, in frame order', () => {
    withFrames(4);
    pickCels({ layer: 0, frame: 2 }, { layer: 0, frame: 2 });
    goToCel(cel(0, 0), false, true);
    expect(picked().frames).toEqual([frameAt(0), frameAt(2)]);
    expect(picked().layers).toEqual(layerIds());
    expect(live().frameId).toBe(frameAt(0));
  });

  it('adds the layer of the clicked cel as well', () => {
    withFrames(2);
    addLayer();
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 0 });
    goToCel(cel(1, 1), false, true);
    expect(picked().layers).toHaveLength(2);
    expect(picked().frames).toEqual([frameAt(0), frameAt(1)]);
  });

  it('acts on frames that are not next to each other', () => {
    withFrames(3);
    for (const frame of [0, 1, 2]) paintCel(frame, frame + 1, 2);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 0 });
    goToCel(cel(0, 2), false, true);
    const before = revision();
    expect(clearCels()).toBe(true);
    expect([0, 1, 2].map((frame) => celAt(live().sprite, 0, frame) !== undefined)).toEqual([false, true, false]);
    expect(revision()).toBe(before + 1);
  });

  it('starts from the cursor cel when nothing was picked before', () => {
    withFrames(3);
    useTimelineStore.setState({ selection: { frames: [], layers: [], anchor: null } });
    goToCel(cel(0, 2), false, true);
    expect(picked().frames).toEqual([frameAt(0), frameAt(2)]);
  });

  it('adds frame headers to the pick the same way', () => {
    withFrames(4);
    goToFrame(frameAt(1));
    goToFrame(frameAt(3), false, true);
    expect(picked().frames).toEqual([frameAt(1), frameAt(3)]);
    expect(picked().layers).toEqual([]);
    expect(live().frameId).toBe(frameAt(3));
  });
});

describe('dragging a cel', () => {
  it('moves a cel to another frame in one undo step', () => {
    withFrames(3);
    paintCel(0, 1, 2);
    const moved = celAt(live().sprite, 0, 0);
    const before = revision();
    expect(dragCels(cel(0, 0), cel(0, 2))).toBe(true);
    expect(celAt(live().sprite, 0, 2)).toBe(moved);
    expect(celAt(live().sprite, 0, 0)).toBeUndefined();
    expect(revision()).toBe(before + 1);
    expect(live().frameId).toBe(frameAt(2));
  });

  it('moves a cel to another layer', () => {
    withFrames(2);
    addLayer();
    paintCel(1, 1, 2, 0);
    const moved = celAt(live().sprite, 0, 1);
    expect(dragCels(cel(0, 1), cel(1, 1))).toBe(true);
    expect(celAt(live().sprite, 1, 1)).toBe(moved);
    expect(celAt(live().sprite, 0, 1)).toBeUndefined();
  });

});

describe('dragging a pick', () => {
  it('moves the whole pick when the dragged cel is part of it', () => {
    withFrames(4);
    for (const frame of [0, 1]) paintCel(frame, frame + 4, 3);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 1 });
    const [first, second] = [0, 1].map((frame) => celAt(live().sprite, 0, frame));
    expect(dragCels(cel(0, 1), cel(0, 2))).toBe(true);
    expect([celAt(live().sprite, 0, 1), celAt(live().sprite, 0, 2)]).toEqual([first, second]);
  });

  it('moves only the dragged cel when it is outside the pick', () => {
    withFrames(4);
    paintCel(0, 1, 2);
    paintCel(2, 2, 3);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 0 });
    const dragged = celAt(live().sprite, 0, 2);
    const kept = celAt(live().sprite, 0, 0);
    expect(dragCels(cel(0, 2), cel(0, 3))).toBe(true);
    expect(celAt(live().sprite, 0, 3)).toBe(dragged);
    expect(celAt(live().sprite, 0, 0)).toBe(kept);
  });

  it('does nothing when the cel is dropped where it is', () => {
    withFrames(2);
    paintCel(0, 1, 2);
    const before = revision();
    expect(dragCels(cel(0, 0), cel(0, 0))).toBe(false);
    expect(revision()).toBe(before);
  });

  it('says so when the pick has no room to follow', () => {
    withFrames(3);
    paintCel(0, 1, 2);
    paintCel(1, 2, 3);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 1 });
    const before = revision();
    expect(dragCels(cel(0, 0), cel(0, 2))).toBe(false);
    expect(revision()).toBe(before);
    expect(noticeText()).toBe('There is no room to move the cels that way.');
  });
});
