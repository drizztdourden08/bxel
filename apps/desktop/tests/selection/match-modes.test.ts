/* @layer renderer-app @kind test */
import type { PaletteBank, RampId, Swatch, SwatchId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { matchRule } from '../../src/editor/selection/match-rule';
import { pointMask } from '../../src/editor/selection/point-mask';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { BLOCK, countOn, openRig } from './selection-harness';

const swatch = (id: string, rgb: `#${string}`): Swatch => ({ id: id as SwatchId, kind: 'color', rgb, name: id });

const BANK: PaletteBank = {
  id: 'bank' as PaletteBank['id'],
  name: 'test',
  cap: 8,
  transparent: true,
  slots: [{ id: 't' as SwatchId, kind: 'transparent' }, swatch('red', '#ff0000'), swatch('red2', '#f01010'), swatch('blue', '#0000ff'), swatch('green', '#00ff00')],
  ramps: [{ id: 'warm' as RampId, name: 'Warm', swatches: ['red' as SwatchId, 'green' as SwatchId] }],
};

describe('colour match rules', () => {
  it('exact takes only the same index', () => {
    const rule = matchRule('exact', BANK, 0);
    expect(rule(1, 1)).toBe(true);
    expect(rule(1, 2)).toBe(false);
  });

  it('similar takes colours within the palette distance', () => {
    expect(matchRule('similar', BANK, 20)(1, 2)).toBe(true);
    expect(matchRule('similar', BANK, 10)(1, 2)).toBe(false);
    expect(matchRule('similar', BANK, 255)(1, 3)).toBe(true);
    expect(matchRule('similar', BANK, 0)(1, 3)).toBe(false);
  });

  it('ramp takes colours that share a ramp with the picked one', () => {
    const rule = matchRule('ramp', BANK, 0);
    expect(rule(1, 4)).toBe(true);
    expect(rule(1, 3)).toBe(false);
  });
});

describe('the wand and Select by colour with the match options', () => {
  it('exact stays the default and matches one colour', () => {
    const rig = openRig();
    rig.paint({ x: 2, y: 2, width: 2, height: 1 }, 1);
    rig.paint({ x: 4, y: 2, width: 2, height: 1 }, 2);
    expect(countOn(pointMask(rig.target(), 'wand', { x: 2, y: 2 }))).toBe(2);
  });

  it('ignore transparent leaves the empty canvas alone', () => {
    const rig = openRig();
    rig.paint({ x: 2, y: 2, width: 2, height: 1 }, 1);
    expect(countOn(pointMask(rig.target(), 'colour', { x: 10, y: 10 }))).toBeGreaterThan(100);
    useSelectionStore.getState().setIgnoreTransparent(true);
    expect(countOn(pointMask(rig.target(), 'colour', { x: 10, y: 10 }))).toBe(0);
  });

  it('in selection only keeps the result inside the existing selection', () => {
    const rig = openRig();
    rig.paint({ x: 0, y: 0, width: 32, height: 32 }, 1);
    rig.select(BLOCK);
    useSelectionStore.getState().setInSelection(true);
    expect(countOn(pointMask(rig.target(), 'colour', { x: 5, y: 5 }))).toBe(BLOCK.width * BLOCK.height);
  });

  it('the distance is held between 0 and 255', () => {
    useSelectionStore.getState().setDistance(900);
    expect(useSelectionStore.getState().distance).toBe(255);
    useSelectionStore.getState().setDistance(-4);
    expect(useSelectionStore.getState().distance).toBe(0);
  });
});
