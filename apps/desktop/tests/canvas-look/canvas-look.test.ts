/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { CANVAS_DEFAULTS, PATTERN_CELLS, RANGES } from '../../src/canvas-look/canvas-look.constants';
import type { CanvasSettings } from '../../src/canvas-look/canvas-look.type';
import { checkerSize } from '../../src/canvas-look/checker-size';
import { gridLayers } from '../../src/canvas-look/grid-layers';
import { lookOf } from '../../src/canvas-look/look-of';
import { surroundKindOf } from '../../src/canvas-look/surround-kind-of';

const settingsWith = (patch: Partial<CanvasSettings>): CanvasSettings => ({ ...CANVAS_DEFAULTS, ...patch });

describe('K1 the canvas look', { tags: ['critical'] }, () => {
  it('turns the defaults into the resolved look', () => {
    const look = lookOf(CANVAS_DEFAULTS);
    expect(look.checkerSize).toBe(8);
    expect(look.surroundBits).toHaveLength(PATTERN_CELLS);
    expect(look.pixelLine).toEqual({ colour: '#ffffff', opacity: 0.15, every: 1, offsetX: 0, offsetY: 0 });
    expect(look.majorLine.every).toBe(8);
    expect(look.tileLine.every).toBe(16);
  });

  it('takes the checkerboard size from the preset or from the custom value', () => {
    expect(checkerSize({ checkerPreset: '16', checkerSize: 3 })).toBe(16);
    expect(checkerSize({ checkerPreset: 'custom', checkerSize: 3 })).toBe(3);
    expect(checkerSize({ checkerPreset: 'custom', checkerSize: 500 })).toBe(RANGES.checkerSize.max);
    expect(checkerSize({ checkerPreset: 'custom', checkerSize: 0 })).toBe(RANGES.checkerSize.min);
    expect(checkerSize({ checkerPreset: 'custom', checkerSize: Number.NaN })).toBe(CANVAS_DEFAULTS.checkerSize);
  });

  it('mends colours, opacity and spacing that are out of range', () => {
    const look = lookOf(settingsWith({ checkerA: 'red', gridOpacity: 4, gridMajorEvery: 1, gridTileSize: 99999, surroundScale: 0 }));
    expect(look.checkerA).toBe(CANVAS_DEFAULTS.checkerA);
    expect(look.pixelLine.opacity).toBe(1);
    expect(look.majorLine.every).toBe(RANGES.major.min);
    expect(look.tileLine.every).toBe(RANGES.tile.max);
    expect(look.surroundScale).toBe(RANGES.surroundScale.min);
  });

  it('uses the custom bits only for the custom pattern', () => {
    const custom = `1${'0'.repeat(PATTERN_CELLS - 1)}`;
    expect(lookOf(settingsWith({ surroundPattern: 'custom', surroundCustom: custom })).surroundBits).toBe(custom);
    expect(lookOf(settingsWith({ surroundPattern: 'solid', surroundCustom: custom })).surroundBits).toBe('0'.repeat(PATTERN_CELLS));
  });

  it('reads a pattern kind from text and falls back to the default', () => {
    expect(surroundKindOf('dots')).toBe('dots');
    expect(surroundKindOf('nonsense')).toBe(CANVAS_DEFAULTS.surroundPattern);
  });
});

describe('K1 the grid layers', { tags: ['critical'] }, () => {
  const look = lookOf(CANVAS_DEFAULTS);
  const all = { pixel: true, major: true, tile: true };

  it('draws the pixel grid only from the zoom it starts at', () => {
    expect(gridLayers(look, { pixel: true, major: false, tile: false }, 7, 8)).toEqual([]);
    expect(gridLayers(look, { pixel: true, major: false, tile: false }, 8, 8)).toEqual([look.pixelLine]);
  });

  it('adds the major and tile grids in order when their lines are far enough apart', () => {
    expect(gridLayers(look, all, 8, 8)).toEqual([look.pixelLine, look.majorLine, look.tileLine]);
    expect(gridLayers(look, all, 1, 8)).toEqual([look.majorLine, look.tileLine]);
    expect(gridLayers(look, all, 0.25, 8)).toEqual([]);
  });

  it('adds the isometric diamond grid after the tile grid, on the tile line', () => {
    const flags = { pixel: false, major: false, tile: true, iso: true };
    expect(gridLayers(look, flags, 8, 8)).toEqual([look.tileLine, { ...look.tileLine, iso: true }]);
    expect(gridLayers(look, { ...flags, tile: false }, 0.25, 8)).toEqual([]);
  });

  it('draws nothing when every grid is off', () => {
    expect(gridLayers(look, { pixel: false, major: false, tile: false }, 32, 8)).toEqual([]);
  });
});
