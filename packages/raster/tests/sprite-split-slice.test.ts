/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { applyTo, frameRows, fresh, heldNames, idle, named, names, onSheet, refusal, run, undoLast, walk } from './compose-world';

describe('sprite.split', () => {
  test('makes one sprite for each frame, numbered from the first number', () => {
    const engine = fresh();
    applyTo(engine, 'sprite.split', [walk], { pattern: '{name}_{n:2}', start: 3 });
    expect(names(engine)).toEqual(['walk_03', 'walk_04', 'idle', 'run']);
    const second = named(engine, 'walk_04');
    expect(second.frames).toHaveLength(1);
    expect(second.pivot).toEqual({ x2: 4, y2: 8 });
    expect(frameRows(second, 0, 0)).toEqual(['....', '5555', '....', '6666']);
  });

  test('keeps the source on request', () => {
    const engine = fresh();
    applyTo(engine, 'sprite.split', [walk], { keep: true });
    expect(names(engine)).toEqual(['walk', 'walk_1', 'walk_2', 'idle', 'run']);
  });

  test('refuses a sprite with one frame and two frames that would get one name', () => {
    const engine = fresh();
    expect(refusal(engine, 'sprite.split', [idle], {})).toBe('INVALID_OPTION');
    expect(refusal(engine, 'sprite.split', [walk], { pattern: 'same' })).toBe('NAME_TAKEN');
  });

  test('puts the pieces on the sheet where the source was and undoes in one step', () => {
    const engine = fresh();
    onSheet(engine, [walk, run]);
    const before = engine.state().artwork;
    applyTo(engine, 'sprite.split', [walk], {});
    expect(heldNames(engine)).toEqual(['walk_1', 'walk_2', 'run']);
    undoLast(engine);
    expect(engine.state().artwork).toEqual(before);
  });
});

describe('sprite.slice', () => {
  test('cuts a grid by counts and names the sprites by their place in the grid', () => {
    const engine = fresh();
    applyTo(engine, 'sprite.slice', [run], { columns: 2, rows: 2, skipEmpty: false });
    expect(names(engine)).toEqual(['walk', 'idle', 'run_1', 'run_2', 'run_3', 'run_4']);
    const last = named(engine, 'run_4');
    expect([last.width, last.height, last.pivot]).toEqual([2, 2, { x2: 2, y2: 2 }]);
    expect(frameRows(last, 0, 0)).toEqual(['1.', '..']);
    expect(frameRows(last, 1, 0)).toEqual(['..', '..']);
    expect(frameRows(named(engine, 'run_1'), 0, 0)).toEqual(['..', '.1']);
    expect(frameRows(named(engine, 'run_3'), 1, 0)).toEqual(['..', '6.']);
  });

  test('skips cells that hold no pixel and keeps the numbers of the others', () => {
    const engine = fresh();
    applyTo(engine, 'sprite.slice', [run], { cellWidth: 4, cellHeight: 1 });
    expect(names(engine)).toEqual(['walk', 'idle', 'run_2', 'run_3', 'run_4']);
    expect(named(engine, 'run_2').width).toBe(4);
  });

  test('cuts by cell size, warns about the edge and numbers from the asked number', () => {
    const engine = fresh();
    const result = applyTo(engine, 'sprite.slice', [walk], { cellWidth: 3, cellHeight: 2, start: 0, pattern: '{name}-{n}', skipEmpty: false });
    expect(names(engine)).toEqual(['walk-0', 'walk-1', 'idle', 'run']);
    expect(result.warnings.map((warning) => warning.code)).toEqual(['SLICE_EDGE_LEFT_OUT']);
    const piece = named(engine, 'walk-0');
    expect([piece.width, piece.height, piece.frames.length]).toEqual([3, 2, 2]);
    expect(frameRows(piece, 0, 1)).toEqual(['...', '555']);
  });

  test('keeps the tags of an animated source in every piece', () => {
    const engine = fresh();
    applyTo(engine, 'sprite.merge', [walk, idle], { name: 'tagged', anchor: 'top-left' });
    applyTo(engine, 'sprite.slice', [named(engine, 'tagged').id], { columns: 2, rows: 1, skipEmpty: false });
    const piece = named(engine, 'tagged_1');
    expect(piece.tags.map((tag) => tag.name)).toEqual(['walk']);
    expect(piece.tags[0]?.from).toBe(piece.frames[0]?.id);
    expect(piece.tags[0]?.to).toBe(piece.frames[1]?.id);
  });

  test('refuses a grid that does not divide, one cell, a cell larger than the sprite and half a pair', () => {
    const engine = fresh();
    expect(refusal(engine, 'sprite.slice', [walk], { columns: 3, rows: 1 })).toBe('INVALID_OPTION');
    expect(refusal(engine, 'sprite.slice', [walk], { columns: 1, rows: 1 })).toBe('INVALID_OPTION');
    expect(refusal(engine, 'sprite.slice', [walk], { cellWidth: 9, cellHeight: 9 })).toBe('INVALID_OPTION');
    expect(refusal(engine, 'sprite.slice', [walk], { columns: 2 })).toBe('INVALID_OPTION');
  });

  test('is one undo step that gives the source back', () => {
    const engine = fresh();
    const before = engine.state().artwork;
    applyTo(engine, 'sprite.slice', [run], { columns: 2, rows: 2 });
    undoLast(engine);
    expect(engine.state().artwork).toEqual(before);
  });
});
