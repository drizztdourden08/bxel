/* @layer renderer-app @kind test */
import { flattenFrame } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { addLayer } from '../../src/editor/add-layer';
import { allowPress } from '../../src/editor/allow-press';
import { stepHistory } from '../../src/editor/step-history';
import { updateLayerFlag } from '../../src/editor/update-layer-flag';
import { celUseCounts } from '../../src/timeline/cel-use-counts';
import { clearCels } from '../../src/timeline/clear-cels';
import { layerRows } from '../../src/timeline/layer-rows';
import { linkCels } from '../../src/timeline/link-cels';
import { moveCels } from '../../src/timeline/move-cels';
import { unlinkCels } from '../../src/timeline/unlink-cels';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { celAt, frameAt, freshDocument, layerIds, live, noticeText, paintCel, pickCels, revision, withFrames } from './timeline-harness';

beforeEach(freshDocument);

const states = (layerAt: number): string[] => {
  const rows = layerRows(live(), useTimelineStore.getState().selection);
  return rows[rows.length - 1 - layerAt]?.cells.map((cell) => cell.state) ?? [];
};

describe('cel states', () => {
  it('shows empty, filled and linked cels', () => {
    withFrames(3);
    paintCel(0, 1, 2);
    paintCel(1, 2, 3);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 0 });
    expect(states(0)).toEqual(['filled', 'filled', 'empty']);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 2 });
    linkCels();
    expect(states(0)).toEqual(['linked', 'linked', 'linked']);
    const counts = celUseCounts(live().sprite);
    expect(counts.get(celAt(live().sprite, 0, 0) as never)).toBe(3);
  });
});

describe('linking cels', () => {
  it('links the first picked frame into the others of the same layer, in one undo step', () => {
    withFrames(3);
    paintCel(0, 1, 2);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 2 });
    const before = revision();
    expect(linkCels()).toBe(true);
    const { sprite } = live();
    const first = celAt(sprite, 0, 0);
    expect(first).toBeDefined();
    expect(celAt(sprite, 0, 1)).toBe(first);
    expect(celAt(sprite, 0, 2)).toBe(first);
    expect(revision()).toBe(before + 1);
    stepHistory('undo');
    expect(celAt(live().sprite, 0, 1)).toBeUndefined();
  });

  it('asks for two frames when only one is picked', () => {
    withFrames(2);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 0 });
    const before = revision();
    expect(linkCels()).toBe(false);
    expect(revision()).toBe(before);
    expect(noticeText()).toBe('Pick two or more frames to link cels across.');
  });

  it('links only the picked layers', () => {
    withFrames(2);
    addLayer();
    paintCel(0, 1, 2, 0);
    paintCel(0, 2, 3, 1);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 1 });
    linkCels();
    const { sprite } = live();
    expect(celAt(sprite, 0, 1)).toBe(celAt(sprite, 0, 0));
    expect(celAt(sprite, 1, 1)).toBeUndefined();
  });

  it('stops drawing on a linked cel and says to unlink first', () => {
    withFrames(2);
    paintCel(0, 1, 2);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 1 });
    linkCels();
    const plan = { kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false } as const;
    expect(allowPress(plan, live())).toBe(false);
    expect(noticeText()).toBe('This cel is shared with other frames. Unlink it in the timeline before drawing on it.');
    unlinkCels();
    expect(allowPress(plan, live())).toBe(true);
  });
});

describe('unlinking and clearing cels', () => {
  it('unlinks to independent copies with the same pixels', () => {
    withFrames(3);
    paintCel(0, 1, 2);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 2 });
    linkCels();
    pickCels({ layer: 0, frame: 1 }, { layer: 0, frame: 2 });
    expect(unlinkCels()).toBe(true);
    const { sprite } = live();
    expect(celAt(sprite, 0, 1)).not.toBe(celAt(sprite, 0, 0));
    expect(celAt(sprite, 0, 2)).not.toBe(celAt(sprite, 0, 1));
    expect(Array.from(flattenFrame(sprite, frameAt(1)))).toEqual(Array.from(flattenFrame(sprite, frameAt(0))));
  });

  it('clears only the picked frames of the picked layer', () => {
    withFrames(3);
    addLayer();
    for (const frameAt of [0, 1, 2]) {
      paintCel(frameAt, 1, 2, 0);
      paintCel(frameAt, 2, 3, 1);
    }
    pickCels({ layer: 1, frame: 1 }, { layer: 1, frame: 2 });
    const before = revision();
    expect(clearCels()).toBe(true);
    const { sprite } = live();
    expect([celAt(sprite, 1, 0) !== undefined, celAt(sprite, 1, 1) !== undefined, celAt(sprite, 1, 2) !== undefined]).toEqual([true, false, false]);
    expect([0, 1, 2].map((frameAt) => celAt(sprite, 0, frameAt) !== undefined)).toEqual([true, true, true]);
    expect(revision()).toBe(before + 1);
    stepHistory('undo');
    expect(celAt(live().sprite, 1, 1)).toBeDefined();
  });

  it('refuses to clear a locked layer and changes nothing', () => {
    withFrames(2);
    paintCel(0, 1, 2);
    const [layerId] = layerIds();
    if (!layerId) throw new Error('no layer');
    updateLayerFlag(layerId, 'locked', true);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 0 });
    const before = revision();
    expect(clearCels()).toBe(false);
    expect(revision()).toBe(before);
    expect(noticeText()).toContain('locked');
  });
});

describe('moving cels', () => {
  it('moves a picked block one frame over and keeps the pixels', () => {
    withFrames(4);
    paintCel(0, 1, 2);
    paintCel(1, 2, 3);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 1 });
    const celA = celAt(live().sprite, 0, 0);
    const celB = celAt(live().sprite, 0, 1);
    const before = revision();
    expect(moveCels({ frames: 1, layers: 0 })).toBe(true);
    const { sprite } = live();
    expect(celAt(sprite, 0, 0)).toBeUndefined();
    expect(celAt(sprite, 0, 1)).toBe(celA);
    expect(celAt(sprite, 0, 2)).toBe(celB);
    expect(revision()).toBe(before + 1);
    expect(useTimelineStore.getState().selection.frames).toEqual(sprite.frames.slice(1, 3).map((frame) => frame.id));
  });

  it('moves a cel up to another layer', () => {
    withFrames(1);
    addLayer();
    paintCel(0, 1, 2, 0);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 0 });
    const cel = celAt(live().sprite, 0, 0);
    expect(moveCels({ frames: 0, layers: 1 })).toBe(true);
    expect(celAt(live().sprite, 1, 0)).toBe(cel);
    expect(celAt(live().sprite, 0, 0)).toBeUndefined();
  });

  it('says so when there is no room and changes nothing', () => {
    withFrames(2);
    paintCel(1, 1, 2);
    pickCels({ layer: 0, frame: 1 }, { layer: 0, frame: 1 });
    const before = revision();
    expect(moveCels({ frames: 1, layers: 0 })).toBe(false);
    expect(revision()).toBe(before);
    expect(noticeText()).toBe('There is no room to move the cels that way.');
  });

  it('refuses to move into a locked layer', () => {
    withFrames(1);
    addLayer();
    paintCel(0, 1, 2, 0);
    const top = layerIds()[1];
    if (!top) throw new Error('no layer');
    updateLayerFlag(top, 'locked', true);
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 0 });
    const before = revision();
    expect(moveCels({ frames: 0, layers: 1 })).toBe(false);
    expect(revision()).toBe(before);
  });
});
