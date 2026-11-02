/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { entryPixels } from './entry-pixels';
import { entryValues } from './entry-values';
import { heartEngine } from './heart-engine';
import { reopenHeart } from './reopen-heart';
import { apply, expectUndoRedo, plain, rejection } from './sheet-engine';

const PIXELS = entryPixels([1, 2, 0, 3]);

const addBrush = (name = 'Corner') => plain('brush.add', { name, width: 2, height: 2, pixels: PIXELS });

describe('K1 brush.add', { tags: ['critical'] }, () => {
  it('saves a brush in the artwork as one undo step and lists it as an entity change', () => {
    const { engine } = heartEngine();
    const done = expectUndoRedo(engine, addBrush());
    const [brush] = engine.state().artwork.brushes ?? [];
    expect(brush).toMatchObject({ name: 'Corner', width: 2, height: 2 });
    expect(entryValues(brush?.pixels)).toEqual([1, 2, 0, 3]);
    expect(done.changes.brushes).toHaveLength(1);
  });

  it('refuses pixels that do not fill width by height', () => {
    const { engine } = heartEngine();
    const failed = rejection(engine, plain('brush.add', { name: 'Bad', width: 3, height: 3, pixels: PIXELS }));
    expect(failed.code).toBe('INVALID_OPTION');
  });
});

describe('K1 brush.update and brush.delete', { tags: ['critical'] }, () => {
  it('renames and removes a saved brush', () => {
    const { engine } = heartEngine();
    apply(engine, addBrush());
    const id = engine.state().artwork.brushes?.[0]?.id ?? '';
    apply(engine, plain('brush.update', { brush: id, name: 'Edge' }));
    expect(engine.state().artwork.brushes?.[0]?.name).toBe('Edge');
    apply(engine, plain('brush.delete', { brush: id }));
    expect(engine.state().artwork.brushes ?? []).toHaveLength(0);
  });
});

describe('K3 a saved brush in a file', { tags: ['critical'] }, () => {
  it('survives save and reopen', () => {
    const { engine } = heartEngine();
    apply(engine, addBrush());
    const read = reopenHeart(engine.state());
    expect(read.brushes).toEqual(engine.state().artwork.brushes);
  });

  it('is absent from a file that never had one', () => {
    expect(reopenHeart().brushes).toBeUndefined();
  });
});
