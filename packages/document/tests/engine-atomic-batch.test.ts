/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { documentId, heartEngine, patchStep, request } from './heart-engine';
import { snapshotProject } from './snapshot-project';

const undoRequest = (revision: number) => ({ documentId, expectedRevision: revision });

describe('atomic batch', () => {
  it('applies nothing when the third step is invalid', () => {
    const { engine } = heartEngine();
    const before = snapshotProject(engine.state().project);
    const result = engine.execute(request([patchStep(6), patchStep(5), patchStep(9)]));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.step).toBe(2);
    expect(snapshotProject(engine.state().project)).toBe(before);
    expect(engine.state().revision).toBe(1);
    expect(engine.canUndo()).toBe(false);
  });

  it('paints both hearts by layer name as one history entry', () => {
    const { engine } = heartEngine();
    const before = snapshotProject(engine.state().project);
    const result = engine.execute(request([patchStep(6)], { label: 'Mark both hearts' }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.revision).toBe(2);
    expect(result.changes.sprites).toHaveLength(2);
    for (const sprite of result.changes.sprites) {
      expect(sprite.cels.map((cel) => cel.rect)).toEqual([{ x: 2, y: 2, width: 2, height: 1 }]);
    }
    const after = snapshotProject(engine.state().project);
    expect(after).not.toBe(before);
    expect(engine.undo(undoRequest(2)).ok).toBe(true);
    expect(snapshotProject(engine.state().project)).toBe(before);
    expect(engine.state().revision).toBe(3);
    expect(engine.canUndo()).toBe(false);
    expect(engine.redo(undoRequest(3)).ok).toBe(true);
    expect(snapshotProject(engine.state().project)).toBe(after);
    expect(engine.state().revision).toBe(4);
  });

  it('leaves the locked Ink layer untouched', () => {
    const { engine } = heartEngine();
    engine.execute(request([patchStep(6)]));
    const heartB = engine.state().project.sprites.find((sprite) => sprite.name === 'heart-b');
    expect(heartB?.layers.find((layer) => layer.name === 'Ink')?.cels).toEqual({});
    expect(Object.keys(heartB?.cels ?? {})).toHaveLength(1);
  });
});

describe('history navigation', () => {
  it('reports nothing to undo or redo and stale expectations', () => {
    const { engine } = heartEngine();
    const empty = engine.undo(undoRequest(1));
    expect(empty.ok ? null : empty.error.code).toBe('NOTHING_TO_UNDO');
    engine.execute(request([patchStep(6)]));
    const stale = engine.undo(undoRequest(1));
    expect(stale.ok ? null : stale.error.code).toBe('STALE_REVISION');
    const none = engine.redo(undoRequest(2));
    expect(none.ok ? null : none.error.code).toBe('NOTHING_TO_REDO');
  });

  it('drops the redo branch on a new commit', () => {
    const { engine } = heartEngine();
    engine.execute(request([patchStep(6)]));
    engine.undo(undoRequest(2));
    expect(engine.canRedo()).toBe(true);
    engine.execute(request([patchStep(5)], { baseRevision: 3 }));
    expect(engine.canRedo()).toBe(false);
  });

  it('tells subscribers about each commit, undo and redo', () => {
    const { engine } = heartEngine();
    const kinds: string[] = [];
    engine.subscribe((event) => kinds.push(event.kind));
    engine.execute(request([patchStep(6)]));
    engine.undo(undoRequest(2));
    engine.redo(undoRequest(3));
    engine.markSaved();
    expect(kinds).toEqual(['commit', 'undo', 'redo', 'save']);
  });
});
