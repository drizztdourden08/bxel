/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, Point, Sheet, Sprite } from '@bxel/document';
import type { SpriteFacts } from './manager.type';
import { stripHint } from './strip-hint';

const sheetsHolding = (artwork: Artwork, sprite: Sprite): string[] =>
  artwork.sheets.filter((sheet) => sheet.entries.some((entry) => entry.spriteId === sprite.id)).map((sheet) => sheet.name);

const placeOf = (sprite: Sprite, sheet: Sheet | null): Point | null => sheet?.entries.find((entry) => entry.spriteId === sprite.id)?.at ?? null;

const spriteFacts = (artwork: Artwork, sprite: Sprite, sheet: Sheet | null): SpriteFacts => ({
  kind: 'sprite',
  sprite,
  bank: findBank(artwork, sprite.bankId)?.name ?? '',
  slices: sprite.slices.length,
  strip: stripHint(sprite)?.cells ?? null,
  at: placeOf(sprite, sheet),
  onSheet: sheet?.entries.some((entry) => entry.spriteId === sprite.id) ?? false,
  sheets: sheetsHolding(artwork, sprite),
});

export { spriteFacts };
