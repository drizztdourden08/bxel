/* @layer tests @kind logic */
import { findSprite } from '@bxel/document';
import type { CelId, CommandError, Engine, Artwork, SpriteId, TransactionFailed, TransactionOk, TransactionResult } from '@bxel/document';
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

const celRows = (artwork: Artwork, spriteId: SpriteId, celId: CelId): string[] => {
  const sprite = findSprite(artwork, spriteId);
  const cel = sprite?.cels[celId];
  if (!sprite || !cel) throw new Error(`cel ${celId} is missing`);
  return toRows({ pixels: cel.pixels, width: sprite.width, height: sprite.height });
};

const createdCelRows = (artwork: Artwork, spriteId: SpriteId): string[] => {
  const cels = Object.values(findSprite(artwork, spriteId)?.cels ?? {});
  const [only] = cels;
  if (!only || cels.length !== 1) throw new Error(`sprite ${spriteId} should hold exactly one cel, found ${cels.length}`);
  return celRows(artwork, spriteId, only.id);
};

const expectUntouched = (engine: Engine, artwork: Artwork): void => {
  expect(engine.state().artwork).toBe(artwork);
  expect(engine.state().revision).toBe(1);
  expect(engine.canUndo()).toBe(false);
};

const artworkBytes = (artwork: Artwork): string[] =>
  artwork.sprites.flatMap((sprite) => Object.values(sprite.cels).map((cel) => `${cel.id}:${cel.pixels.join(',')}`));

export { celRows, createdCelRows, errorOf, expectUntouched, okOf, artworkBytes };
