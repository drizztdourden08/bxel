/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { PATTERN_CELLS, PATTERN_SIZE, SURROUND_KINDS } from '../../src/canvas-look/canvas-look.constants';
import { cellAt } from '../../src/canvas-look/cell-at';
import { cleanBits } from '../../src/canvas-look/clean-bits';
import { invertBits } from '../../src/canvas-look/invert-bits';
import { patternBits } from '../../src/canvas-look/pattern-bits';
import { setBit } from '../../src/canvas-look/set-bit';
import { stepCell } from '../../src/canvas-look/step-cell';

const row = (bits: string, y: number): string => bits.slice(y * PATTERN_SIZE, (y + 1) * PATTERN_SIZE);

describe('surround pattern presets', () => {
  it('gives every kind exactly 256 cells of zero and one', () => {
    SURROUND_KINDS.forEach((kind) => {
      const bits = patternBits(kind, '');
      expect(bits).toHaveLength(PATTERN_CELLS);
      expect(/^[01]+$/.test(bits)).toBe(true);
    });
  });

  it('draws diagonal stripes that shift one cell on each row', () => {
    const bits = patternBits('diagonal', '');
    expect(row(bits, 0)).toBe('1100110011001100');
    expect(row(bits, 1)).toBe('1001100110011001');
    expect(row(bits, 2)).toBe('0011001100110011');
    expect(row(bits, 4)).toBe(row(bits, 0));
  });

  it('draws horizontal stripes two rows thick and vertical stripes two columns thick', () => {
    const horizontal = patternBits('horizontal', '');
    expect(row(horizontal, 0)).toBe('1'.repeat(PATTERN_SIZE));
    expect(row(horizontal, 1)).toBe('1'.repeat(PATTERN_SIZE));
    expect(row(horizontal, 2)).toBe('0'.repeat(PATTERN_SIZE));
    const vertical = patternBits('vertical', '');
    expect(row(vertical, 0)).toBe('1100110011001100');
    expect(row(vertical, 7)).toBe(row(vertical, 0));
  });

  it('draws one dot every four cells and nothing for solid', () => {
    const dots = patternBits('dots', '');
    expect(row(dots, 0)).toBe('1000100010001000');
    expect(row(dots, 1)).toBe('0'.repeat(PATTERN_SIZE));
    expect(row(dots, 4)).toBe(row(dots, 0));
    expect(patternBits('solid', '')).toBe('0'.repeat(PATTERN_CELLS));
  });
});

describe('custom pattern bits', () => {
  it('uses the stored bits and ignores them for presets', () => {
    const custom = `1${'0'.repeat(PATTERN_CELLS - 1)}`;
    expect(patternBits('custom', custom)).toBe(custom);
    expect(patternBits('solid', custom)).toBe('0'.repeat(PATTERN_CELLS));
  });

  it('pads a short value, cuts a long one and turns anything else into zero', () => {
    expect(cleanBits('1')).toBe(`1${'0'.repeat(PATTERN_CELLS - 1)}`);
    expect(cleanBits('1x1')).toBe(`101${'0'.repeat(PATTERN_CELLS - 3)}`);
    expect(cleanBits('1'.repeat(PATTERN_CELLS + 10))).toBe('1'.repeat(PATTERN_CELLS));
    expect(cleanBits(undefined)).toBe('0'.repeat(PATTERN_CELLS));
    expect(cleanBits(42)).toBe('0'.repeat(PATTERN_CELLS));
  });

  it('sets, clears and inverts single cells', () => {
    const blank = '0'.repeat(PATTERN_CELLS);
    const one = setBit(blank, 17, true);
    expect(one.indexOf('1')).toBe(17);
    expect(setBit(one, 17, false)).toBe(blank);
    expect(setBit(blank, -1, true)).toBe(blank);
    expect(setBit(blank, PATTERN_CELLS, true)).toBe(blank);
    expect(invertBits(blank)).toBe('1'.repeat(PATTERN_CELLS));
    expect(invertBits(invertBits(one))).toBe(one);
  });
});

describe('pattern editor cells', () => {
  it('finds the cell under a point of a square canvas', () => {
    expect(cellAt(0, 0, 320)).toBe(0);
    expect(cellAt(319, 319, 320)).toBe(PATTERN_CELLS - 1);
    expect(cellAt(25, 45, 320)).toBe(2 * PATTERN_SIZE + 1);
    expect(cellAt(-1, 10, 320)).toBeNull();
    expect(cellAt(320, 10, 320)).toBeNull();
    expect(cellAt(10, 10, 0)).toBeNull();
  });

  it('steps the keyboard cursor and stops at the edges', () => {
    expect(stepCell(0, 'ArrowRight')).toBe(1);
    expect(stepCell(0, 'ArrowDown')).toBe(PATTERN_SIZE);
    expect(stepCell(0, 'ArrowLeft')).toBe(0);
    expect(stepCell(0, 'ArrowUp')).toBe(0);
    expect(stepCell(PATTERN_CELLS - 1, 'ArrowRight')).toBe(PATTERN_CELLS - 1);
    expect(stepCell(5, 'Home')).toBe(5);
  });
});
