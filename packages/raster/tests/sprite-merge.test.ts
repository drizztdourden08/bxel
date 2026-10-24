/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { celAt } from '../src/commands/compose/cel-at';
import { applyTo, frameRows, fresh, heldNames, idle, named, names, onSheet, refusal, run, undoLast, walk } from './compose-world';

describe('sprite.merge', () => {
  test('puts the frames of the sprites in one animation and pads smaller ones to the largest', () => {
    const engine = fresh();
    applyTo(engine, 'sprite.merge', [walk, idle, run], { anchor: 'top-left' });
    expect(names(engine)).toEqual(['walk']);
    const merged = named(engine, 'walk');
    expect([merged.width, merged.height, merged.frames.length]).toEqual([4, 4, 4]);
    expect(frameRows(merged, 0, 0)).toEqual(['1...', '.2..', '..3.', '...4']);
    expect(frameRows(merged, 0, 2)).toEqual(['12..', '34..', '....', '....']);
    expect(frameRows(merged, 0, 3)).toEqual(['....', '.11.', '.11.', '....']);
  });

  test('joins layers by name, adds the ones that are new and leaves the rest of a frame empty', () => {
    const engine = fresh();
    applyTo(engine, 'sprite.merge', [walk, run], {});
    const merged = named(engine, 'walk');
    expect(merged.layers.map((layer) => layer.name)).toEqual(['Body', 'Ink']);
    expect(frameRows(merged, 1, 2)).toEqual(['....', '....', '....', '6...']);
    const ink = merged.layers[1];
    expect(ink ? celAt(merged, ink, merged.frames[0]?.id) : 'missing').toBeUndefined();
  });

  test('aligns a smaller sprite by the anchor and moves the pivot of the first sprite with it', () => {
    const engine = fresh();
    applyTo(engine, 'sprite.merge', [idle, walk], { anchor: 'bottom-right', name: 'both' });
    const merged = named(engine, 'both');
    expect(frameRows(merged, 0, 0)).toEqual(['....', '....', '..12', '..34']);
    expect(merged.pivot).toEqual({ x2: 6, y2: 6 });
  });

  test('tags the frames of a source that has more than one', () => {
    const engine = fresh();
    applyTo(engine, 'sprite.merge', [idle, walk, run], {});
    const merged = named(engine, 'idle');
    const at = (id: string): number => merged.frames.findIndex((frame) => frame.id === id);
    expect(merged.tags.map((tag) => [tag.name, at(tag.from), at(tag.to)])).toEqual([['walk', 1, 2]]);
  });

  test('keeps the sources on request and takes a free name', () => {
    const engine = fresh();
    applyTo(engine, 'sprite.merge', [walk, run], { keep: true });
    expect(names(engine)).toEqual(['walk', 'walk merged', 'idle', 'run']);
  });

  test('stands for the first source on its sheet and undoes in one step', () => {
    const engine = fresh();
    onSheet(engine, [walk, idle]);
    const before = engine.state().artwork;
    applyTo(engine, 'sprite.merge', [walk, idle], {});
    expect(heldNames(engine)).toEqual(['walk']);
    undoLast(engine);
    expect(engine.state().artwork).toEqual(before);
  });

  test('refuses one sprite and a name that another sprite has', () => {
    const engine = fresh();
    expect(refusal(engine, 'sprite.merge', [walk], {})).toBe('INVALID_OPTION');
    expect(refusal(engine, 'sprite.merge', [walk, idle], { name: 'run' })).toBe('NAME_TAKEN');
  });
});
