/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import type { Engine, TransactionResult } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { benchEngine, benchState, requestOf, spriteOf, strokeStep } from './bench-engine';
import { wanderPoints } from './bench-points';

const SIDE = 320;
const WANT = '13613620b4fa 19e296260b5f bbcca439268d b0158ddc0d7e 75813983cddc c46da8054fda da544c636637 005e835ec98c e3c68b3d605d';

const digest = (value: unknown): string =>
  createHash('sha1')
    .update(JSON.stringify(value, (_key, item: unknown) => (item instanceof Uint8Array ? Buffer.from(item).toString('hex') : item)))
    .digest('hex')
    .slice(0, 12);

const stage = (engine: Engine, result: TransactionResult): string => {
  if (!result.ok) throw new Error(result.error.message);
  return digest([result, engine.state().artwork, engine.state().revision]);
};

const history = (engine: Engine, direction: 'undo' | 'redo'): TransactionResult =>
  engine[direction]({ documentId: engine.documentId, expectedRevision: engine.state().revision });

const run = (): string[] => {
  const state = benchState(SIDE);
  const engine = benchEngine(state);
  const sprite = spriteOf(state);
  const request = (points: number, size: number, mode: 'commit' | 'preview') =>
    requestOf(engine.state(), strokeStep(sprite, wanderPoints(points, SIDE), size), mode);
  const out: string[] = [];
  out.push(stage(engine, engine.execute(request(200, 6, 'commit'))));
  out.push(stage(engine, engine.execute({ ...request(90, 3, 'preview'), previewPixels: SIDE * SIDE })));
  out.push(stage(engine, engine.execute({ ...request(90, 30, 'preview'), previewPixels: 64 })));
  out.push(stage(engine, engine.execute(request(90, 9, 'commit'))));
  out.push(stage(engine, engine.execute(request(2, 2, 'commit'))));
  out.push(stage(engine, history(engine, 'undo')));
  out.push(stage(engine, history(engine, 'undo')));
  out.push(stage(engine, history(engine, 'redo')));
  out.push(stage(engine, engine.execute(request(300, 12, 'commit'))));
  return out;
};

describe('stroke output on a 320 sprite', () => {
  test('every commit, preview, undo and redo stays byte for byte the same', () => {
    expect(run().join(' ')).toBe(WANT);
  });
});
