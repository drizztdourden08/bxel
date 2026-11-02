/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import type { Engine, TransactionResult } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { benchEngine, benchState, requestOf, spriteOf, strokeStep } from './bench-engine';
import { wanderPoints } from './bench-points';

const SIDE = 320;
const WANT: readonly string[] = ['153a180e0e4d', 'af72081ad457', '4ab83026b1cc', '247435d14039', '3658b1044494', '41a1ccb6c840', 'd02ecf8fcdd0', 'bffa5e81120a', '16740d06103e'];

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

describe('S2 stroke output on a 320 sprite', { tags: ['standard'] }, () => {
  test('every commit, preview, undo and redo stays byte for byte the same', () => {
    expect(run()).toEqual(WANT);
  });
});
