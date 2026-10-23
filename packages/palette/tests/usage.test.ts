/* @layer tests @kind test */
import { countUsage, reportPalette, type IndexBuffer } from '@bxel/palette';
import { describe, expect, it } from 'vitest';

const first: IndexBuffer = { pixels: Uint8Array.from([0, 0, 1, 1, 1, 3]), width: 3, height: 2 };
const second: IndexBuffer = { pixels: Uint8Array.from([3, 5, 200]), width: 3, height: 1 };

describe('countUsage', () => {
  it('counts per index across buffers', () => {
    const usage = countUsage([first, second]);
    expect(usage).toHaveLength(256);
    expect(usage[0]).toBe(2);
    expect(usage[1]).toBe(3);
    expect(usage[3]).toBe(2);
    expect(usage[5]).toBe(1);
    expect(usage[200]).toBe(1);
    expect(usage.reduce((sum, count) => sum + count, 0)).toBe(9);
  });

  it('counts nothing for no buffers', () => {
    expect(countUsage([]).every((count) => count === 0)).toBe(true);
  });
});

describe('reportPalette', () => {
  const palette = ['#000000', '#ff0000', '#00ff00', '#FF0000', '#0000ff'];

  it('splits used and unused slots and flags out of range indices', () => {
    const report = reportPalette({ palette, transparent: false, usage: countUsage([first, second]) });
    expect(report.used).toEqual([0, 1, 3]);
    expect(report.unused).toEqual([2, 4]);
    expect(report.outOfRange).toBe(2);
  });

  it('groups duplicate colours regardless of case', () => {
    const report = reportPalette({ palette, transparent: false, usage: countUsage([]) });
    expect(report.duplicates).toEqual([[1, 3]]);
  });

  it('ignores the transparent slot when looking for duplicates', () => {
    const report = reportPalette({
      palette: ['#000000', '#000000', '#000000'],
      transparent: true,
      usage: countUsage([]),
    });
    expect(report.duplicates).toEqual([[1, 2]]);
  });

  it('reports a clean palette', () => {
    const report = reportPalette({
      palette: ['#000000', '#ffffff'],
      transparent: false,
      usage: countUsage([{ pixels: Uint8Array.from([0, 1]), width: 2, height: 1 }]),
    });
    expect(report).toEqual({ used: [0, 1], unused: [], duplicates: [], outOfRange: 0 });
  });
});
