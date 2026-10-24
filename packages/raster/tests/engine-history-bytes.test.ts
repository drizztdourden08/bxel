/* @layer tests @kind test */
import type { TransactionResult } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { benchEngine, benchState, requestOf, spriteOf, strokeStep } from './bench-engine';
import { wanderPoints } from './bench-points';

const SIDE = 2048;
const MIB = 1024 * 1024;

const historyBytes = (result: TransactionResult): number => {
  if (!result.ok) throw new Error(result.error.message);
  return result.changes.sprites.flatMap((sprite) => sprite.cels).reduce((sum, cel) => sum + 2 * cel.rect.width * cel.rect.height, 0);
};

const commitBytes = (points: number, size: number): number => {
  const state = benchState(SIDE);
  const step = strokeStep(spriteOf(state), wanderPoints(points, SIDE), size);
  return historyBytes(benchEngine(state).execute(requestOf(state, step, 'commit')));
};

describe('history cost of a stroke on a 2048 by 2048 sprite', () => {
  test('a one point dab records only its own rectangle', () => {
    expect(commitBytes(1, 4)).toBeLessThanOrEqual(2 * 4 * 4);
  });

  test('a stroke across the canvas records no more than twice the sprite area', () => {
    const bytes = commitBytes(8192, 16);
    expect(bytes).toBeGreaterThan(4 * MIB);
    expect(bytes).toBeLessThanOrEqual(2 * SIDE * SIDE);
  });
});
