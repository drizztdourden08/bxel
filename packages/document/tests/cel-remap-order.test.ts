/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { pixelsOf, redo, run, spriteOf, undo } from './cel-swap-checks';
import { CEL_A, CEL_B, swapEngine } from './cel-swap-engine';
import { request } from './heart-engine';

describe('entity ops stay ordered with remaps and change rects', () => {
  it('undoes a deleted cel and a later palette remap in one transaction exactly', () => {
    const engine = swapEngine();
    const original = engine.state().project;
    run(engine, 'test.delete-remap');
    const done = engine.state().project;
    expect(spriteOf(engine).cels[CEL_B]).toBeUndefined();
    expect(pixelsOf(engine, CEL_A).slice(0, 2)).toEqual([2, 1]);
    undo(engine);
    expect(engine.state().project).toEqual(original);
    redo(engine);
    expect(engine.state().project).toEqual(done);
  });

  it('reports the whole cel as changed after a non-square resize', () => {
    const engine = swapEngine();
    const result = engine.execute(
      request([{ name: 'test.resize', targets: null, options: {} }], { baseRevision: engine.state().revision }),
    );
    if (!result.ok) throw new Error(result.error.message);
    const rects = [];
    for (const change of result.changes.sprites) rects.push(...change.cels.map((cel) => cel.rect));
    expect(rects).toHaveLength(2);
    expect(rects.every((rect) => rect.x === 0 && rect.y === 0 && rect.width === 2 && rect.height === 4)).toBe(true);
  });
});
