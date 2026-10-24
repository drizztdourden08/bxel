/* @layer tests @kind bench */
import { bench, describe } from 'vitest';
import { benchEngine, benchState, requestOf, spriteOf, strokeStep } from './bench-engine';
import { wanderPoints } from './bench-points';

const HEAVY = { iterations: 5, time: 0, warmupIterations: 2, warmupTime: 0 };
const BIG = 2048;
const SMALL = 256;

const bigState = benchState(BIG);
const bigStroke = strokeStep(spriteOf(bigState), wanderPoints(8192, BIG), 16);
const smallState = benchState(SMALL);
const smallStroke = strokeStep(spriteOf(smallState), wanderPoints(64, SMALL), 4);

const undoRequest = (engine: ReturnType<typeof benchEngine>) => ({
  documentId: engine.documentId,
  expectedRevision: engine.state().revision,
});

describe('engine stroke, 2048 sprite', () => {
  const resting = benchEngine(bigState);
  resting.execute(requestOf(bigState, bigStroke, 'commit'));
  bench('commit, fresh engine (target 150 ms)', () => {
    benchEngine(bigState).execute(requestOf(bigState, bigStroke, 'commit'));
  }, HEAVY);
  bench('commit then undo (target 200 ms)', () => {
    const engine = benchEngine(bigState);
    engine.execute(requestOf(bigState, bigStroke, 'commit'));
    engine.undo(undoRequest(engine));
  }, HEAVY);
  bench('undo then redo of a committed stroke (target 50 ms)', () => {
    resting.undo(undoRequest(resting));
    resting.redo(undoRequest(resting));
  }, HEAVY);
  bench('preview (target 100 ms)', () => {
    benchEngine(bigState).execute(requestOf(bigState, bigStroke, 'preview'));
  }, HEAVY);
});

describe('engine stroke, 256 sprite', () => {
  bench('commit, fresh engine (target 16 ms)', () => {
    benchEngine(smallState).execute(requestOf(smallState, smallStroke, 'commit'));
  }, HEAVY);
  bench('preview (target 8 ms)', () => {
    benchEngine(smallState).execute(requestOf(smallState, smallStroke, 'preview'));
  }, HEAVY);
});
