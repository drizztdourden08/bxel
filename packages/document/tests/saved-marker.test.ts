/* @layer core @kind test */
import type { DocumentEvent, Engine } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { documentId, heartEngine, patchStep, request } from './heart-engine';

const stroke = (engine: Engine, value: number): void => {
  expect(engine.execute(request([patchStep(value)], { baseRevision: engine.state().revision })).ok).toBe(true);
};

const undo = (engine: Engine): void => {
  expect(engine.undo({ documentId, expectedRevision: engine.state().revision }).ok).toBe(true);
};

const redo = (engine: Engine): void => {
  expect(engine.redo({ documentId, expectedRevision: engine.state().revision }).ok).toBe(true);
};

describe('the saved marker', () => {
  it('keeps every entry across a save so undo still steps back through them', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    stroke(engine, 2);
    engine.markSaved();
    expect(engine.canUndo()).toBe(true);
    expect(engine.canRedo()).toBe(false);
    undo(engine);
    undo(engine);
    expect(engine.canUndo()).toBe(false);
    expect(engine.canRedo()).toBe(true);
  });

  it('is dirty after undoing past the saved point and clean again after redoing to it', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    stroke(engine, 2);
    engine.markSaved();
    expect(engine.isClean()).toBe(true);
    undo(engine);
    expect(engine.isClean()).toBe(false);
    undo(engine);
    expect(engine.isClean()).toBe(false);
    redo(engine);
    redo(engine);
    expect(engine.isClean()).toBe(true);
  });

  it('is clean when undo returns to the opened state and dirty again after redo', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    expect(engine.isClean()).toBe(false);
    undo(engine);
    expect(engine.isClean()).toBe(true);
    redo(engine);
    expect(engine.isClean()).toBe(false);
  });

  it('can never be clean at the saved point once a new edit replaces the redo branch', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    engine.markSaved();
    undo(engine);
    stroke(engine, 2);
    expect(engine.isClean()).toBe(false);
    undo(engine);
    expect(engine.isClean()).toBe(false);
    redo(engine);
    expect(engine.isClean()).toBe(false);
  });
});

describe('moving the saved marker', () => {
  it('moves with a second save and keeps the older entries', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    engine.markSaved();
    stroke(engine, 2);
    engine.markSaved();
    undo(engine);
    expect(engine.isClean()).toBe(false);
    undo(engine);
    expect(engine.isClean()).toBe(false);
    redo(engine);
    redo(engine);
    expect(engine.isClean()).toBe(true);
  });

  it('forgets the saved point on markUnsaved and takes a new one on the next markSaved', () => {
    const { engine } = heartEngine();
    stroke(engine, 1);
    engine.markSaved();
    engine.markUnsaved();
    expect(engine.isClean()).toBe(false);
    undo(engine);
    expect(engine.isClean()).toBe(false);
    engine.markSaved();
    expect(engine.isClean()).toBe(true);
    redo(engine);
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
