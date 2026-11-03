/* @layer renderer-app @kind test */
import { findBank } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { ONION_DEFAULTS } from '../../src/stores/timeline-store.constants';
import type { OnionSettings } from '../../src/stores/timeline-store.type';
import { addTag } from '../../src/timeline/add-tag';
import { edgeMask } from '../../src/timeline/edge-mask';
import { hexRgb } from '../../src/timeline/hex-rgb';
import { onionPixels } from '../../src/timeline/onion-pixels';
import { onionPlan } from '../../src/timeline/onion-plan';
import { playPlan } from '../../src/timeline/play-plan';
import { onionBand } from '../../src/views/TimelinePanel/behavior/onion-band';
import { animationOf, frameAt, frameIds, freshAnimation, live, paintFrame, pickRange, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

const settings = (patch: Partial<OnionSettings> = {}): OnionSettings => ({ ...ONION_DEFAULTS, on: true, ...patch });

const planFor = (index: number, patch: Partial<OnionSettings>, mode: 'loop' | 'once' = 'loop', tagId: Parameters<typeof playPlan>[0]['tagId'] = null) => {
  const animation = animationOf();
  const plan = playPlan({ animation, tagId, picked: [], rangePicked: false, loopRange: null, mode, subtags: false });
  return onionPlan(animation, frameAt(index), plan, { onion: settings(patch), mode }).map((layer) => [frameIds().indexOf(layer.frameId), layer.side, Math.round(layer.alpha * 100)]);
};

describe('S2 the onion plan', { tags: ['standard'] }, () => {
  it('shows nothing while it is off', () => {
    withFrames(4);
    const animation = animationOf();
    const plan = playPlan({ animation, tagId: null, picked: [], rangePicked: false, loopRange: null, mode: 'loop', subtags: false });
    expect(onionPlan(animation, frameAt(1), plan, { onion: { ...ONION_DEFAULTS, on: false }, mode: 'loop' })).toEqual([]);
  });

  it('reaches up to eight frames each way with a linear falloff', () => {
    withFrames(20);
    const layers = planFor(10, { before: 8, after: 8, opacity: 80, wrap: false });
    expect(layers.filter((layer) => layer[1] === 'before')).toHaveLength(8);
    expect(layers.filter((layer) => layer[1] === 'after')).toHaveLength(8);
    expect(layers[0]).toEqual([9, 'before', 80]);
    expect(layers[7]).toEqual([2, 'before', 10]);
  });

  it('keeps every ghost as solid as the nearest one under a flat falloff', () => {
    withFrames(6);
    const layers = planFor(2, { before: 2, after: 2, opacity: 50, falloff: 'flat', wrap: false });
    expect(layers.map((layer) => layer[2])).toEqual([50, 50, 50, 50]);
  });

  it('stops at the ends without wrap and ghosts the other end with it', () => {
    withFrames(4);
    expect(planFor(0, { before: 1, after: 0, wrap: false })).toEqual([]);
    expect(planFor(0, { before: 1, after: 0, wrap: true })).toEqual([[3, 'before', 40]]);
    expect(planFor(0, { before: 1, after: 0, wrap: true }, 'once')).toEqual([]);
  });

  it('stays inside a tag unless the scope is the whole animation', () => {
    withFrames(6);
    pickRange(2, 3);
    addTag();
    const id = animationOf().tags[0]?.id ?? null;
    expect(planFor(2, { before: 2, after: 2, wrap: false }, 'loop', id).map((layer) => layer[0])).toEqual([3]);
    expect(planFor(2, { before: 2, after: 2, wrap: false, scope: 'all' }, 'loop', id).map((layer) => layer[0])).toEqual([1, 0, 3, 4]);
  });

  it('skips a frame that shows the same sprite as the current one when asked', () => {
    withFrames(3);
    expect(planFor(1, { before: 1, after: 1, wrap: false, skipRepeats: true })).toHaveLength(2);
  });
});

describe('S2 the ghost pixels', { tags: ['standard'] }, () => {
  const ghostOf = (patch: { style: 'filled' | 'outline'; behind: boolean }) => {
    const { artwork, animation, frame } = live();
    const bank = findBank(artwork, animation.bankId);
    if (!bank) throw new Error('no bank');
    return onionPixels({ artwork, animation, bank }, frame.id, { frameId: frameAt(0), flip: null, side: 'before', tint: 'split', colour: '#102030', ...patch });
  };

  it('tints a ghost with the colour of its side', () => {
    withFrames(2);
    paintFrame(0, 3, 3, 2);
    paintFrame(1, 6, 6, 3);
    const out = ghostOf({ style: 'filled', behind: true });
    const at = (3 * live().animation.width + 3) * 4;
    expect([out[at], out[at + 1], out[at + 2], out[at + 3]]).toEqual([16, 32, 48, 255]);
  });

  it('draws over the current frame only when the ghost is in front', () => {
    withFrames(2);
    paintFrame(0, 3, 3, 2);
    paintFrame(1, 3, 3, 3);
    const at = (3 * live().animation.width + 3) * 4;
    expect(ghostOf({ style: 'filled', behind: true })[at + 3]).toBe(0);
    expect(ghostOf({ style: 'filled', behind: false })[at + 3]).toBe(255);
  });

  it('keeps only the edge pixels in outline style', () => {
    const side = 5;
    const solid = new Uint8Array(side * side).fill(1);
    const mask = edgeMask(solid, side, side);
    expect(mask.reduce((total, bit) => total + bit, 0)).toBe(16);
    expect(mask[2 * side + 2]).toBe(0);
    expect(mask[0]).toBe(1);
    expect(hexRgb('#e04848')).toEqual([224, 72, 72]);
    expect(hexRgb('nonsense')).toEqual([128, 128, 128]);
  });
});

describe('S2 the onion range on the ruler', { tags: ['standard'] }, () => {
  it('spans the frames before and after the current one, kept inside the strip', () => {
    expect(onionBand(settings({ before: 2, after: 1 }), 3, 9)).toEqual({ from: 1, to: 4 });
    expect(onionBand(settings({ before: 3, after: 3 }), 1, 4)).toEqual({ from: 0, to: 4 });
  });

  it('shows no band while the onion skin is off or no frame is current', () => {
    expect(onionBand({ ...settings(), on: false }, 2, 9)).toBeNull();
    expect(onionBand(settings(), -1, 9)).toBeNull();
  });
});
