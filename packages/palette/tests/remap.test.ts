/* @layer tests @kind test */
import {
  applyRemap,
  buildRemoveTable,
  buildReorderTables,
  isPermutation,
  REMAP_SIZE,
  type IndexBuffer,
} from '@bxel/palette';
import { describe, expect, it } from 'vitest';

const palette = ['#000000', '#111111', '#222222', '#333333', '#444444'];

const buffer: IndexBuffer = {
  pixels: Uint8Array.from([0, 1, 2, 3, 4, 4, 3, 2, 1, 0, 2, 2]),
  width: 4,
  height: 3,
};

const render = (source: IndexBuffer, colors: readonly string[]): string[] =>
  [...source.pixels].map((slot) => colors[slot] ?? 'out of range');

describe('reorder tables', () => {
  const order = [0, 3, 1, 4, 2];

  it('builds full-size tables', () => {
    const { forward, inverse } = buildReorderTables(order);
    expect(forward).toHaveLength(REMAP_SIZE);
    expect(inverse).toHaveLength(REMAP_SIZE);
  });

  it('preserves appearance', () => {
    const { forward } = buildReorderTables(order);
    const reordered = order.map((previous) => palette[previous] ?? '');
    expect(render(applyRemap(buffer, forward), reordered)).toEqual(render(buffer, palette));
  });

  it('inverse undoes forward exactly', () => {
    const { forward, inverse } = buildReorderTables(order);
    const back = applyRemap(applyRemap(buffer, forward), inverse);
    expect(back.pixels).toEqual(buffer.pixels);
    for (let slot = 0; slot < REMAP_SIZE; slot += 1) {
      expect(inverse[forward[slot] ?? 0]).toBe(slot);
    }
  });

  it('leaves slots outside the permutation alone', () => {
    const { forward } = buildReorderTables(order);
    expect(forward[200]).toBe(200);
  });

  it('rejects anything that is not a permutation', () => {
    for (const bad of [[], [0, 0, 1], [0, 2], [1, 2, 3], [0, 1.5], [-1, 0]]) {
      expect(isPermutation(bad)).toBe(false);
      expect(() => buildReorderTables(bad)).toThrow();
    }
    expect(isPermutation([0])).toBe(true);
    expect(isPermutation(Array.from({ length: 256 }, (_, slot) => 255 - slot))).toBe(true);
    expect(isPermutation(Array.from({ length: 257 }, (_, slot) => slot))).toBe(false);
  });

  it('does not modify its input buffer', () => {
    const before = Uint8Array.from(buffer.pixels);
    applyRemap(buffer, buildReorderTables(order).forward);
    expect(buffer.pixels).toEqual(before);
  });
});

describe('remove tables', () => {
  it('merges a slot into another and closes the gap', () => {
    const table = buildRemoveTable({ slotCount: 5, removed: 1, replacement: 3 });
    expect([...table.slice(0, 5)]).toEqual([0, 2, 1, 2, 3]);
    const out = applyRemap(buffer, table);
    expect(out.pixels.every((slot) => slot < 4)).toBe(true);
  });

  it('keeps every other colour in a delete with replacement', () => {
    const table = buildRemoveTable({ slotCount: 5, removed: 2, replacement: 0 });
    const remaining = palette.filter((_, slot) => slot !== 2);
    const rendered = render(applyRemap(buffer, table), remaining);
    const expected = render(buffer, palette).map((color) => (color === '#222222' ? '#000000' : color));
    expect(rendered).toEqual(expected);
  });

  it('is not invertible', () => {
    const table = buildRemoveTable({ slotCount: 5, removed: 1, replacement: 0 });
    expect(new Set(table.slice(0, 5)).size).toBeLessThan(5);
  });

  it('rejects bad specs', () => {
    expect(() => buildRemoveTable({ slotCount: 5, removed: 2, replacement: 2 })).toThrow();
    expect(() => buildRemoveTable({ slotCount: 5, removed: 5, replacement: 0 })).toThrow();
    expect(() => buildRemoveTable({ slotCount: 5, removed: 0, replacement: -1 })).toThrow();
    expect(() => buildRemoveTable({ slotCount: 300, removed: 0, replacement: 1 })).toThrow();
  });
});
