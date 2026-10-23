/* @layer tests @kind logic */
import { findSprite } from '@bxel/document';
import type { CelId, CommandError, Engine, Project, SpriteId, TransactionFailed, TransactionOk, TransactionResult } from '@bxel/document';
import { expect } from 'vitest';
import { toRows } from './to-rows';

const okOf = (result: TransactionResult): TransactionOk => {
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
  return result;
};

const failureOf = (result: TransactionResult): TransactionFailed => {
  if (result.ok) throw new Error('the transaction was expected to fail');
  return result;
};

const errorOf = (result: TransactionResult): CommandError => failureOf(result).error;

const celRows = (project: Project, spriteId: SpriteId, celId: CelId): string[] => {
  const sprite = findSprite(project, spriteId);
  const cel = sprite?.cels[celId];
  if (!sprite || !cel) throw new Error(`cel ${celId} is missing`);
  return toRows({ pixels: cel.pixels, width: sprite.width, height: sprite.height });
};

const expectUntouched = (engine: Engine, project: Project): void => {
  expect(engine.state().project).toBe(project);
  expect(engine.state().revision).toBe(1);
  expect(engine.canUndo()).toBe(false);
};

const projectBytes = (project: Project): string[] =>
  project.sprites.flatMap((sprite) => Object.values(sprite.cels).map((cel) => `${cel.id}:${cel.pixels.join(',')}`));

export { celRows, errorOf, expectUntouched, okOf, projectBytes };
