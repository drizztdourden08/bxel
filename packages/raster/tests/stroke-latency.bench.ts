/* @layer tests @kind bench */
import type { CommandStep, Engine } from '@bxel/document';
import type { Point } from '@bxel/raster';
import { bench, describe } from 'vitest';
import { benchEngine, benchState, requestOf, spriteOf, strokeStep } from './bench-engine';
import { wanderPoints } from './bench-points';

const HEAVY = { iterations: 100, time: 0, warmupIterations: 60, warmupTime: 0 };
const SIDE = 2048;
const DRAG = 64;
const BRUSH = 4;

const state = benchState(SIDE);
const sprite = spriteOf(state);
const drag = wanderPoints(DRAG, SIDE);
const move = wanderPoints(2, SIDE);
const stepOf = (points: readonly Point[], index: number): CommandStep => ({
  ...strokeStep(sprite, points, BRUSH),
  options: { index, points, brush: { shape: 'circle', size: BRUSH } },
});
const stroke = (index: number): CommandStep => stepOf(drag, index);
const pointer = (index: number): CommandStep => stepOf(move, index);

const painted = (): Engine => {
  const engine = benchEngine(state);
  engine.execute(requestOf(state, strokeStep(sprite, wanderPoints(512, SIDE), 8), 'commit'));
  return engine;
};

const resting = painted();
const settled = painted();
settled.execute(requestOf(settled.state(), stroke(3), 'commit'));
let flip = 3;
const alternate = (): number => {
  flip = flip === 3 ? 4 : 3;
  return flip;
};

describe('stroke latency, 2048 sprite', () => {
  bench('commit of a 64 point stroke (target 16 ms)', () => {
    resting.execute(requestOf(resting.state(), stroke(alternate()), 'commit'));
  }, HEAVY);
  bench('preview of a 64 point stroke (target 8 ms)', () => {
    resting.execute({ ...requestOf(resting.state(), stroke(alternate()), 'preview'), previewPixels: 4096 });
  }, HEAVY);
  bench('preview of one pointer move (target 8 ms)', () => {
    resting.execute({ ...requestOf(resting.state(), pointer(alternate()), 'preview'), previewPixels: 4096 });
  }, HEAVY);
  bench('undo then redo of a 64 point stroke (target 16 ms)', () => {
    const at = { documentId: settled.documentId, expectedRevision: settled.state().revision };
    settled.undo(at);
    settled.redo({ ...at, expectedRevision: settled.state().revision });
  }, HEAVY);
});
