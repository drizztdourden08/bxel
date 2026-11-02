/* @layer core @kind test */
import { decodeBrushPixels } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { entryPixels } from './entry-pixels';
import { heartEngine } from './heart-engine';
import { reopenHeart } from './reopen-heart';
import { apply, expectUndoRedo, plain, rejection } from './sheet-engine';

const PIXELS = entryPixels([1, 0, 0, 1]);

const addPattern = (name = 'Checker') => plain('pattern.add', { name, width: 2, height: 2, pixels: PIXELS });

describe('K1 pattern.add', { tags: ['critical'] }, () => {
  it('saves a pattern in the artwork as one undo step and lists it as an entity change', () => {
    const { engine } = heartEngine();
    const done = expectUndoRedo(engine, addPattern());
    const [pattern] = engine.state().artwork.patterns ?? [];
    expect(pattern).toMatchObject({ name: 'Checker', width: 2, height: 2 });
    expect([...decodeBrushPixels(pattern?.pixels ?? '')]).toEqual([1, 0, 0, 1]);
    expect(done.changes.patterns).toHaveLength(1);
  });

  it('refuses pixels that do not fill width by height', () => {
    const { engine } = heartEngine();
    const failed = rejection(engine, plain('pattern.add', { name: 'Bad', width: 3, height: 3, pixels: PIXELS }));
    expect(failed.code).toBe('INVALID_OPTION');
  });

  it('refuses a side above the pattern limit', () => {
    const { engine } = heartEngine();
    const pixels = entryPixels(new Array<number>(33).fill(0));
    expect(rejection(engine, plain('pattern.add', { name: 'Wide', width: 33, height: 1, pixels })).code).toBeDefined();
  });
});

describe('K1 pattern.update and pattern.delete', { tags: ['critical'] }, () => {
  it('renames, redraws and removes a saved pattern', () => {
    const { engine } = heartEngine();
    apply(engine, addPattern());
    const id = engine.state().artwork.patterns?.[0]?.id ?? '';
    apply(engine, plain('pattern.update', { pattern: id, name: 'Dots' }));
    expect(engine.state().artwork.patterns?.[0]?.name).toBe('Dots');
    apply(engine, plain('pattern.update', { pattern: id, width: 4, height: 1, pixels: entryPixels([1, 0, 1, 0]) }));
    expect(engine.state().artwork.patterns?.[0]).toMatchObject({ width: 4, height: 1 });
    apply(engine, plain('pattern.delete', { pattern: id }));
    expect(engine.state().artwork.patterns ?? []).toHaveLength(0);
  });

  it('refuses new dimensions that the pixels do not fill', () => {
    const { engine } = heartEngine();
    apply(engine, addPattern());
    const id = engine.state().artwork.patterns?.[0]?.id ?? '';
    expect(rejection(engine, plain('pattern.update', { pattern: id, width: 4 })).code).toBe('INVALID_OPTION');
  });
});

describe('K3 a saved pattern in a file', { tags: ['critical'] }, () => {
  it('survives save and reopen', () => {
    const { engine } = heartEngine();
    apply(engine, addPattern());
    const read = reopenHeart(engine.state());
    expect(read.patterns).toEqual(engine.state().artwork.patterns);
  });

  it('is absent from a file that never had one', () => {
    expect(reopenHeart().patterns).toBeUndefined();
  });
});
