/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { CEL_A, CEL_B, PIXELS_A, PIXELS_B, swapEngine, TURNED_A, TURNED_B } from './cel-swap-engine';
import { pixelsOf, redo, run, spriteOf, undo } from './cel-swap-checks';

describe('a cel replaced by a buffer of the same length', () => {
  it('undoes and redoes a same-size buffer swap exactly', () => {
    const engine = swapEngine();
    const original = engine.state().artwork;
    run(engine, 'test.rebuffer');
    expect(pixelsOf(engine, CEL_A)).toEqual([...PIXELS_B]);
    const swapped = engine.state().artwork;
    undo(engine);
    expect(engine.state().artwork).toEqual(original);
    redo(engine);
    expect(engine.state().artwork).toEqual(swapped);
    undo(engine);
    expect(engine.state().artwork).toEqual(original);
  });

  it.each(['test.raw-turn', 'test.resize'])('undoes and redoes a non-square swap by %s with the size and pivot', (name) => {
    const engine = swapEngine();
    const original = engine.state().artwork;
    run(engine, name);
    const turned = engine.state().artwork;
    const sprite = spriteOf(engine);
    expect([sprite.width, sprite.height, sprite.pivot]).toEqual([2, 4, { x2: 1, y2: 3 }]);
    expect(pixelsOf(engine, CEL_A)).toEqual([...TURNED_A]);
    expect(pixelsOf(engine, CEL_B)).toEqual([...TURNED_B]);
    undo(engine);
    expect(engine.state().artwork).toEqual(original);
    expect(pixelsOf(engine, CEL_A)).toEqual([...PIXELS_A]);
    redo(engine);
    expect(engine.state().artwork).toEqual(turned);
    undo(engine);
    expect(engine.state().artwork).toEqual(original);
  });

  it('records two geometry changes in one transaction in sequence', () => {
    const engine = swapEngine();
    const original = engine.state().artwork;
    run(engine, 'test.resize-twice');
    const done = engine.state().artwork;
    expect(spriteOf(engine).width).toBe(4);
    expect(pixelsOf(engine, CEL_B)).toEqual([...PIXELS_A]);
    undo(engine);
    expect(engine.state().artwork).toEqual(original);
    redo(engine);
    expect(engine.state().artwork).toEqual(done);
  });
});
