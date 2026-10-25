/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { stepCursor } from '../../src/editor/step-cursor';

const size = { width: 4, height: 3 };

describe('stepping the keyboard drawing cursor', () => {
  it('moves one cell along the arrow', () => {
    expect(stepCursor({ x: 1, y: 1 }, 'ArrowRight', size)).toEqual({ x: 2, y: 1 });
    expect(stepCursor({ x: 1, y: 1 }, 'ArrowUp', size)).toEqual({ x: 1, y: 0 });
  });

  it('stops at every edge of the sprite', () => {
    expect(stepCursor({ x: 0, y: 0 }, 'ArrowLeft', size)).toEqual({ x: 0, y: 0 });
    expect(stepCursor({ x: 3, y: 2 }, 'ArrowRight', size)).toEqual({ x: 3, y: 2 });
    expect(stepCursor({ x: 3, y: 2 }, 'ArrowDown', size)).toEqual({ x: 3, y: 2 });
  });

  it('ignores a key that is not an arrow', () => {
    expect(stepCursor({ x: 1, y: 1 }, 'a', size)).toBeNull();
  });
});
