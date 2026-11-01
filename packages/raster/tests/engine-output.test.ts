/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import type { Engine, TransactionResult } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { benchEngine, benchState, requestOf, spriteOf, strokeStep } from './bench-engine';
import { wanderPoints } from './bench-points';

const SIDE = 320;
const WANT = '366b6930d864 8994a5ac9ba2 795eaf81e323 a76cf90f6dde 85a5a1bdf226 7092cf565c68 35b5bc35463c be45ed73605a 41b4119579e6';

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
    expect(run().join(' ')).toBe(WANT);
  });
});
