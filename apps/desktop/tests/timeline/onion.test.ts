/* @layer renderer-app @kind test */
import { flattenFrame } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { bankRgba } from '../../src/export/bank-rgba';
import { updateLayerFlag } from '../../src/editor/update-layer-flag';
import { ONION_DEFAULTS } from '../../src/stores/timeline-store.constants';
import type { OnionSettings } from '../../src/stores/timeline-store.type';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { onionPixels } from '../../src/timeline/onion-pixels';
import { onionPlan } from '../../src/timeline/onion-plan';
import { ONION_TINTS } from '../../src/timeline/onion.constants';
import type { OnionGhost } from '../../src/timeline/onion.type';
import { frameAt, freshDocument, live, paintCel, revision, withFrames } from './timeline-harness';

beforeEach(freshDocument);

const on = (patch: Partial<OnionSettings>): OnionSettings => ({ ...ONION_DEFAULTS, on: true, ...patch });

const ghost = (frame: number, side: OnionGhost['side'], tint: OnionGhost['tint']): OnionGhost => ({ frameId: frameAt(frame), side, tint });

const pixelsOf = (shown: number, behind: OnionGhost) => {
  const target = live();
  return onionPixels(target.sprite, target.bank, frameAt(shown), behind);
};

const alphaAt = (pixels: Uint8ClampedArray, x: number): number => pixels[x * 4 + 3] ?? 0;

describe('the onion skin plan', () => {
  it('plans nothing while it is off', () => {
    withFrames(3);
    expect(onionPlan(live().sprite, frameAt(1), { ...ONION_DEFAULTS, on: false })).toEqual([]);
  });

  it('plans the frames before and after, fading with the distance', () => {
    withFrames(5);
    const plan = onionPlan(live().sprite, frameAt(2), on({ before: 2, after: 1, opacity: 40 }));
    expect(plan.map((layer) => [layer.side, layer.frameId])).toEqual([
      ['before', frameAt(1)],
      ['before', frameAt(0)],
      ['after', frameAt(3)],
    ]);
    expect(plan.map((layer) => Number(layer.alpha.toFixed(2)))).toEqual([0.4, 0.2, 0.4]);
  });

  it('stops at the ends of the sprite', () => {
    withFrames(3);
    expect(onionPlan(live().sprite, frameAt(0), on({ before: 3, after: 3 })).map((layer) => layer.side)).toEqual(['after', 'after']);
    expect(onionPlan(live().sprite, frameAt(2), on({ before: 1, after: 1 })).map((layer) => layer.side)).toEqual(['before']);
  });

  it('plans nothing for zero frames each way', () => {
    withFrames(3);
    expect(onionPlan(live().sprite, frameAt(1), on({ before: 0, after: 0 }))).toEqual([]);
  });
});

describe('the onion skin pixels', () => {
  it('shows a neighbour only where the current frame is empty', () => {
    withFrames(2);
    paintCel(0, 1, 2);
    paintCel(0, 2, 2);
    paintCel(1, 2, 3);
    const pixels = pixelsOf(1, ghost(0, 'before', 'none'));
    expect(alphaAt(pixels, 1)).toBe(255);
    expect(alphaAt(pixels, 2)).toBe(0);
    expect(alphaAt(pixels, 0)).toBe(0);
  });

  it('keeps the colours of the palette without a tint', () => {
    withFrames(2);
    paintCel(0, 1, 2);
    const table = bankRgba(live().bank);
    const pixels = pixelsOf(1, ghost(0, 'before', 'none'));
    expect(Array.from(pixels.slice(4, 8))).toEqual(Array.from(table.slice(8, 12)));
  });

  it('tints before and after apart, or in grey', () => {
    withFrames(3);
    paintCel(0, 1, 2);
    paintCel(2, 1, 2);
    const before = pixelsOf(1, ghost(0, 'before', 'split'));
    const after = pixelsOf(1, ghost(2, 'after', 'split'));
    expect(Array.from(before.slice(4, 7))).toEqual([...ONION_TINTS.before]);
    expect(Array.from(after.slice(4, 7))).toEqual([...ONION_TINTS.after]);
    const grey = pixelsOf(1, ghost(0, 'before', 'grey'));
    expect(grey[4]).toBe(grey[5]);
    expect(grey[5]).toBe(grey[6]);
  });

  it('leaves out a hidden layer', () => {
    withFrames(2);
    paintCel(0, 1, 2);
    updateLayerFlag(live().layerId, 'visible', false);
    const pixels = pixelsOf(1, ghost(0, 'before', 'none'));
    expect(pixels.every((value) => value === 0)).toBe(true);
  });
});

describe('the onion skin is a preview only', () => {
  it('changes no pixel and no history when its settings change', () => {
    withFrames(3);
    paintCel(0, 1, 2);
    paintCel(1, 2, 3);
    const before = { revision: revision(), sprite: live().sprite, frame: Array.from(flattenFrame(live().sprite, frameAt(1))) };
    const view = useDocumentStore.getState().host.view(live().documentId);
    useTimelineStore.getState().setOnion({ on: true, before: 2, after: 2, opacity: 60, tint: 'grey' });
    pixelsOf(1, ghost(0, 'before', 'grey'));
    onionPlan(live().sprite, frameAt(1), useTimelineStore.getState().onion);
    expect(revision()).toBe(before.revision);
    expect(live().sprite).toBe(before.sprite);
    expect(Array.from(flattenFrame(live().sprite, frameAt(1)))).toEqual(before.frame);
    expect(useDocumentStore.getState().host.view(live().documentId)).toBe(view);
  });

  it('keeps only settings in the timeline store, never pixels', () => {
    withFrames(2);
    paintCel(0, 1, 2);
    useTimelineStore.getState().setOnion({ on: true });
    const state = useTimelineStore.getState();
    const holdsBytes = Object.values(state).some((value) => ArrayBuffer.isView(value));
    expect(holdsBytes).toBe(false);
    expect(Object.keys(state.onion).sort()).toEqual(['after', 'before', 'on', 'opacity', 'tint']);
  });
});
