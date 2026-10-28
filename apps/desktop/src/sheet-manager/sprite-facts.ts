/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, Sheet, Sprite } from '@bxel/document';
import type { SpriteFacts } from './manager.type';
import { stripHint } from './strip-hint';

const sheetsHolding = (artwork: Artwork, sprite: Sprite): string[] =>
  artwork.sheets.filter((sheet) => sheet.entries.some((entry) => entry.spriteId === sprite.id)).map((sheet) => sheet.name);

const spriteFacts = (artwork: Artwork, sprite: Sprite, sheet: Sheet | null): SpriteFacts => ({
  kind: 'sprite',
  sprite,
  bank: findBank(artwork, sprite.bankId)?.name ?? '',
  slices: sprite.slices.length,
  strip: stripHint(sprite)?.cells ?? null,
  onSheet: sheet?.entries.some((entry) => entry.spriteId === sprite.id) ?? false,
  sheets: sheetsHolding(artwork, sprite),
});

export { spriteFacts };
