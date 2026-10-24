/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { heartEngine } from './heart-engine';
import { HEART, HEART_B, apply, expectUndoRedo, onSprites, rejection } from './sheet-engine';

const slicesOf = (engine: ReturnType<typeof heartEngine>['engine'], id = HEART) =>
  engine.state().artwork.sprites.find((sprite) => sprite.id === id)?.slices ?? [];

describe('slice.add', () => {
  it('adds a named slice with a pivot and a 9-slice center as one undo step', () => {
    const { engine } = heartEngine();
    const rect = { x: 1, y: 1, width: 6, height: 6 };
    const done = expectUndoRedo(
      engine,
      onSprites('slice.add', { name: 'body', rect, pivot: { x2: 6, y2: 12 }, center: { x: 2, y: 2, width: 2, height: 2 } }, [HEART], 'body'),
    );
    expect(slicesOf(engine)[0]).toMatchObject({ name: 'body', rect, pivot: { x2: 6, y2: 12 }, center: { x: 2, y: 2, width: 2, height: 2 } });
    expect(slicesOf(engine)[0]?.id).toBe(done.created['body']);
  });

  it('defaults the pivot and center to none', () => {
    const { engine } = heartEngine();
    apply(engine, onSprites('slice.add', { name: 'whole', rect: { x: 0, y: 0, width: 8, height: 8 } }, [HEART]));
    expect(slicesOf(engine)[0]).toMatchObject({ pivot: null, center: null });
  });

  it('refuses a slice outside the sprite, a bad pivot, a bad center and a taken name', () => {
    const { engine } = heartEngine();
    const rect = { x: 0, y: 0, width: 4, height: 4 };
    expect(rejection(engine, onSprites('slice.add', { name: 'a', rect: { x: 6, y: 0, width: 4, height: 4 } }, [HEART])).code).toBe('OUT_OF_BOUNDS');
    expect(rejection(engine, onSprites('slice.add', { name: 'a', rect: { x: 0, y: 0, width: 0, height: 4 } }, [HEART])).code).toBe('OUT_OF_BOUNDS');
    expect(rejection(engine, onSprites('slice.add', { name: 'a', rect, pivot: { x2: 9, y2: 0 } }, [HEART])).code).toBe('PIVOT_OUT_OF_RANGE');
    expect(rejection(engine, onSprites('slice.add', { name: 'a', rect, center: { x: 3, y: 3, width: 3, height: 1 } }, [HEART])).code).toBe('OUT_OF_BOUNDS');
    apply(engine, onSprites('slice.add', { name: 'a', rect }, [HEART]));
    expect(rejection(engine, onSprites('slice.add', { name: 'A', rect }, [HEART])).code).toBe('NAME_TAKEN');
  });

  it('adds the same slice to several sprites', () => {
    const { engine } = heartEngine();
    apply(engine, onSprites('slice.add', { name: 'core', rect: { x: 2, y: 2, width: 4, height: 4 } }, [HEART, HEART_B]));
    expect(slicesOf(engine, HEART_B).map((slice) => slice.name)).toEqual(['core']);
  });
});

describe('slice.update and slice.delete', () => {
  const rect = { x: 0, y: 0, width: 4, height: 4 };

  it('changes the fields it is given and keeps the rest', () => {
    const { engine } = heartEngine();
    apply(engine, onSprites('slice.add', { name: 'a', rect, pivot: { x2: 4, y2: 4 } }, [HEART]));
    expectUndoRedo(engine, onSprites('slice.update', { slice: { by: 'name', name: 'A' }, name: 'b', rect: { x: 1, y: 1, width: 5, height: 5 } }, [HEART]));
    expect(slicesOf(engine)[0]).toMatchObject({ name: 'b', rect: { x: 1, y: 1, width: 5, height: 5 }, pivot: { x2: 4, y2: 4 } });
  });

  it('clears a pivot with null and refuses an empty change or a shrink that breaks the center', () => {
    const { engine } = heartEngine();
    apply(engine, onSprites('slice.add', { name: 'a', rect, pivot: { x2: 4, y2: 4 }, center: { x: 1, y: 1, width: 2, height: 2 } }, [HEART]));
    apply(engine, onSprites('slice.update', { slice: { by: 'name', name: 'a' }, pivot: null }, [HEART]));
    expect(slicesOf(engine)[0]?.pivot).toBeNull();
    expect(rejection(engine, onSprites('slice.update', { slice: { by: 'name', name: 'a' } }, [HEART])).code).toBe('INVALID_OPTION');
    expect(rejection(engine, onSprites('slice.update', { slice: { by: 'name', name: 'a' }, rect: { x: 0, y: 0, width: 2, height: 2 } }, [HEART])).code).toBe('OUT_OF_BOUNDS');
    expect(rejection(engine, onSprites('slice.update', { slice: { by: 'name', name: 'zzz' }, name: 'q' }, [HEART])).code).toBe('TARGET_NOT_FOUND');
  });

  it('deletes a slice by id and by name', () => {
    const { engine } = heartEngine();
    const done = apply(engine, onSprites('slice.add', { name: 'a', rect }, [HEART], 'a'));
    apply(engine, onSprites('slice.add', { name: 'b', rect }, [HEART]));
    expectUndoRedo(engine, onSprites('slice.delete', { slice: { by: 'id', id: done.created['a'] } }, [HEART]));
    apply(engine, onSprites('slice.delete', { slice: { by: 'name', name: 'b' } }, [HEART]));
    expect(slicesOf(engine)).toEqual([]);
  });

  it('refuses a slice id for several sprites', () => {
    const { engine } = heartEngine();
    const done = apply(engine, onSprites('slice.add', { name: 'a', rect }, [HEART], 'a'));
    expect(rejection(engine, onSprites('slice.delete', { slice: { by: 'id', id: done.created['a'] } }, [HEART, HEART_B])).code).toBe('INVALID_OPTION');
  });
});
