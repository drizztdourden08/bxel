/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { axisFromRuler } from '../../src/ruler/axis-from-ruler';
import type { RulerSpan } from '../../src/ruler/ruler.type';
import { spanAlong } from '../../src/ruler/span-along';
import { spanReversed } from '../../src/ruler/span-reversed';

const span = (reversed: boolean): RulerSpan => ({ origin: 10, zoom: 4, length: 200, count: 16, reversed });

describe('W7 the rulers under a mirrored view', { tags: ['standard'] }, () => {
  it('reverses only the horizontal ruler of a sprite or a tile', () => {
    expect(spanReversed('x', true, 'sprite')).toBe(true);
    expect(spanReversed('x', true, 'tile')).toBe(true);
    expect(spanReversed('y', true, 'sprite')).toBe(false);
    expect(spanReversed('x', true, 'map')).toBe(false);
    expect(spanReversed('x', false, 'sprite')).toBe(false);
  });

  it('reads a ruler position from the far edge when reversed', () => {
    expect(spanAlong(30, span(false))).toBe(30);
    expect(spanAlong(30, span(true))).toBe(170);
  });

  it('puts the mirror axis on the same pixel as the unmirrored ruler would', () => {
    const plain = axisFromRuler(spanAlong(22, span(false)), span(false), false);
    const flipped = axisFromRuler(spanAlong(178, span(true)), span(true), false);
    expect(flipped).toBe(plain);
  });
});
