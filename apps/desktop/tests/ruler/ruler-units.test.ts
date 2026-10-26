/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { unitOf } from '../../src/ruler/unit-of';
import { tileSizeOf } from '../../src/ruler/tile-size-of';
import { rulerTicks } from '../../src/ruler/ruler-ticks';
import { unitScale } from '../../src/ruler/unit-scale';

const ticksIn = (unit: 'pixels' | 'tiles' | 'percent', count: number, zoom: number, tile = 16) =>
  rulerTicks({ origin: 0, zoom, length: count * zoom, count, unit: unitScale(unit, count, tile) });

describe('ruler units', () => {
  it('counts pixels as before, with the plain number as the label', () => {
    const ticks = ticksIn('pixels', 32, 4);
    expect(ticks.filter((tick) => tick.label).map((tick) => tick.text)).toEqual(['0', '20']);
  });

  it('counts tiles of the grid size and puts a label on each tile', () => {
    const ticks = ticksIn('tiles', 64, 8, 16);
    expect(ticks.map((tick) => tick.text)).toEqual(['0', '1', '2', '3', '4']);
    expect(ticks.map((tick) => tick.at)).toEqual([0, 128, 256, 384, 512]);
    expect(ticks.every((tick) => tick.label)).toBe(true);
  });

  it('ends a partial tile with its fraction and no label', () => {
    const ticks = ticksIn('tiles', 40, 8, 16);
    const last = ticks[ticks.length - 1];
    expect(last?.text).toBe('2.5');
    expect(last?.label).toBe(false);
    expect(last?.at).toBe(320);
  });

  it('counts percent of the image and ends on 100%', () => {
    const ticks = ticksIn('percent', 64, 8);
    expect(ticks.filter((tick) => tick.label).map((tick) => tick.text)).toEqual(['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%']);
    expect(ticks[ticks.length - 1]?.at).toBeCloseTo(512, 6);
  });

  it('reads a stored unit and a stored tile size defensively', () => {
    expect(unitOf('tiles')).toBe('tiles');
    expect(unitOf('feet')).toBe('pixels');
    expect(unitOf(undefined)).toBe('pixels');
    expect(tileSizeOf(16)).toBe(16);
    expect(tileSizeOf(0)).toBe(2);
    expect(tileSizeOf('big')).toBe(16);
  });
});
