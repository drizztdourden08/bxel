/* @layer core @kind test */
import { findSprite } from '@bxel/document';
import type { CelId, Engine } from '@bxel/document';
import { expect } from 'vitest';
import { WIDE } from './cel-swap-engine';
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
  const sprite = findSprite(engine.state().artwork, WIDE);
  if (!sprite) throw new Error('the sprite is missing');
  return sprite;
};

const pixelsOf = (engine: Engine, id: CelId): number[] => [...(spriteOf(engine).cels[id]?.pixels ?? [])];

export { pixelsOf, redo, run, spriteOf, undo };
