/* @layer core @kind test */
import type { Engine, HistoryLimits } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { documentId, heartEngine, patchStep, request } from './heart-engine';

const stroke = (engine: Engine, value: number): void => {
  const result = engine.execute(request([patchStep(value)], { baseRevision: engine.state().revision }));
  expect(result.ok).toBe(true);
};

const undoAll = (engine: Engine): number => {
  let undone = 0;
  while (engine.canUndo()) {
    const result = engine.undo({ documentId, expectedRevision: engine.state().revision });
    expect(result.ok).toBe(true);
    undone += 1;
  }
  return undone;
};

const engineWith = (limits: HistoryLimits): Engine => heartEngine(limits).engine;

describe('history memory', () => {
  it('drops the oldest entries by count and keeps the newest', () => {
    const engine = engineWith({ maxBytes: 1_000_000, maxEntries: 3 });
    for (const value of [1, 2, 3, 4, 5]) stroke(engine, value);
    expect(undoAll(engine)).toBe(3);
  });

  it('drops the oldest entries by bytes', () => {
    const engine = engineWith({ maxBytes: 20, maxEntries: 1000 });
    for (const value of [1, 2, 3, 4, 5]) stroke(engine, value);
    expect(undoAll(engine)).toBe(2);
  });

  it('keeps the newest entry even when it alone passes the budget', () => {
    const engine = engineWith({ maxBytes: 1, maxEntries: 1000 });
    for (const value of [1, 2, 3]) stroke(engine, value);
    expect(undoAll(engine)).toBe(1);
  });

  it('loses the clean state when the saved entry is trimmed', () => {
    const engine = engineWith({ maxBytes: 1_000_000, maxEntries: 2 });
    stroke(engine, 1);
    engine.markSaved();
    expect(engine.isClean()).toBe(true);
    stroke(engine, 2);
    expect(engine.isClean()).toBe(false);
    stroke(engine, 3);
    engine.undo({ documentId, expectedRevision: engine.state().revision });
    engine.undo({ documentId, expectedRevision: engine.state().revision });
    expect(engine.isClean()).toBe(true);
    engine.redo({ documentId, expectedRevision: engine.state().revision });
    engine.redo({ documentId, expectedRevision: engine.state().revision });
    stroke(engine, 4);
    undoAll(engine);
    expect(engine.isClean()).toBe(false);
  });

  it('is clean again after undoing back to the saved point', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    engine.markSaved();
    stroke(engine, 2);
    expect(engine.isClean()).toBe(false);
    engine.undo({ documentId, expectedRevision: engine.state().revision });
    expect(engine.isClean()).toBe(true);
  });
});
