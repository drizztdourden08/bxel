/* @layer core @kind test */
import type { DocumentEvent, Engine } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { heartEngine, patchStep, redoOnce, request, undoOnce } from './heart-engine';

const stroke = (engine: Engine, value: number): void => {
  expect(engine.execute(request([patchStep(value)], { baseRevision: engine.state().revision })).ok).toBe(true);
};

const backAndForth = (engine: Engine): void => {
  undoOnce(engine);
  expect(engine.isClean()).toBe(false);
  undoOnce(engine);
  expect(engine.isClean()).toBe(false);
  redoOnce(engine);
  redoOnce(engine);
  expect(engine.isClean()).toBe(true);
};

describe('K1 the saved marker', { tags: ['critical'] }, () => {
  it('keeps every entry across a save so undo still steps back through them', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    stroke(engine, 2);
    engine.markSaved();
    expect(engine.canUndo()).toBe(true);
    expect(engine.canRedo()).toBe(false);
    undoOnce(engine);
    undoOnce(engine);
    expect(engine.canUndo()).toBe(false);
    expect(engine.canRedo()).toBe(true);
  });

  it('is dirty after undoing past the saved point and clean again after redoing to it', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    stroke(engine, 2);
    engine.markSaved();
    expect(engine.isClean()).toBe(true);
    backAndForth(engine);
  });

  it('is clean when undo returns to the opened state and dirty again after redo', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    expect(engine.isClean()).toBe(false);
    undoOnce(engine);
    expect(engine.isClean()).toBe(true);
    redoOnce(engine);
    expect(engine.isClean()).toBe(false);
  });

  it('can never be clean at the saved point once a new edit replaces the redo branch', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    engine.markSaved();
    undoOnce(engine);
    stroke(engine, 2);
    expect(engine.isClean()).toBe(false);
    undoOnce(engine);
    expect(engine.isClean()).toBe(false);
    redoOnce(engine);
    expect(engine.isClean()).toBe(false);
  });
});

describe('K1 moving the saved marker', { tags: ['critical'] }, () => {
  it('moves with a second save and keeps the older entries', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    engine.markSaved();
    stroke(engine, 2);
    engine.markSaved();
    backAndForth(engine);
  });

  it('forgets the saved point on markUnsaved and takes a new one on the next markSaved', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    engine.markSaved();
    engine.markUnsaved();
    expect(engine.isClean()).toBe(false);
    undoOnce(engine);
    expect(engine.isClean()).toBe(false);
    engine.markSaved();
    expect(engine.isClean()).toBe(true);
    redoOnce(engine);
    expect(engine.isClean()).toBe(false);
  });

  it('announces each move of the saved point as a save event with no changes', () => {
    const { engine } = heartEngine();
    const seen: DocumentEvent[] = [];
    engine.subscribe((event) => seen.push(event));
    engine.markSaved();
    engine.markUnsaved();
    expect(seen.map((event) => [event.kind, event.label])).toEqual([['save', 'Save'], ['save', 'Unsaved']]);
    expect(seen.every((event) => event.revision === event.previousRevision)).toBe(true);
  });
});
