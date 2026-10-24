/* @layer core @kind test */
import { findSprite } from '@bxel/document';
import type { Engine } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { CEL_A, CEL_B, PIXELS_A, PIXELS_B, swapEngine, TURNED_A, TURNED_B, WIDE } from './cel-swap-engine';
import { documentId, request } from './heart-engine';

const run = (engine: Engine, name: string): void => {
  const result = engine.execute(request([{ name, targets: null, options: {} }], { baseRevision: engine.state().revision }));
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
};

const undo = (engine: Engine): void => {
  expect(engine.undo({ documentId, expectedRevision: engine.state().revision }).ok).toBe(true);
};

const redo = (engine: Engine): void => {
  expect(engine.redo({ documentId, expectedRevision: engine.state().revision }).ok).toBe(true);
};

const spriteOf = (engine: Engine) => {
  const sprite = findSprite(engine.state().project, WIDE);
  if (!sprite) throw new Error('the sprite is missing');
  return sprite;
};

const pixelsOf = (engine: Engine, id: typeof CEL_A): number[] => [...(spriteOf(engine).cels[id]?.pixels ?? [])];

describe('a cel replaced by a buffer of the same length', () => {
  it('undoes and redoes a same-size buffer swap exactly', () => {
    const engine = swapEngine();
    const original = engine.state().project;
    run(engine, 'test.rebuffer');
    expect(pixelsOf(engine, CEL_A)).toEqual([...PIXELS_B]);
    const swapped = engine.state().project;
    undo(engine);
    expect(engine.state().project).toEqual(original);
    redo(engine);
    expect(engine.state().project).toEqual(swapped);
    undo(engine);
    expect(engine.state().project).toEqual(original);
  });

  it.each(['test.raw-turn', 'test.resize'])('undoes and redoes a non-square swap by %s with the size and pivot', (name) => {
    const engine = swapEngine();
    const original = engine.state().project;
    run(engine, name);
    const turned = engine.state().project;
    const sprite = spriteOf(engine);
    expect([sprite.width, sprite.height, sprite.pivot]).toEqual([2, 4, { x2: 1, y2: 3 }]);
    expect(pixelsOf(engine, CEL_A)).toEqual([...TURNED_A]);
    expect(pixelsOf(engine, CEL_B)).toEqual([...TURNED_B]);
    undo(engine);
    expect(engine.state().project).toEqual(original);
    expect(pixelsOf(engine, CEL_A)).toEqual([...PIXELS_A]);
    redo(engine);
    expect(engine.state().project).toEqual(turned);
    undo(engine);
    expect(engine.state().project).toEqual(original);
  });

  it('records two geometry changes in one transaction in sequence', () => {
    const engine = swapEngine();
    const original = engine.state().project;
    run(engine, 'test.resize-twice');
    const done = engine.state().project;
    expect(spriteOf(engine).width).toBe(4);
    expect(pixelsOf(engine, CEL_B)).toEqual([...PIXELS_A]);
    undo(engine);
    expect(engine.state().project).toEqual(original);
    redo(engine);
    expect(engine.state().project).toEqual(done);
  });
});
