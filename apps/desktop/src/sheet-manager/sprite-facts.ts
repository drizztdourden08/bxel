/* @layer renderer-app @kind logic */
import type { Artwork, Sheet, Sprite } from '@bxel/document';
import type { SpriteFacts } from './manager.type';

const sheetsHolding = (artwork: Artwork, sprite: Sprite): string[] =>
  artwork.sheets.filter((sheet) => sheet.entries.some((entry) => entry.spriteId === sprite.id)).map((sheet) => sheet.name);

const spriteFacts = (artwork: Artwork, sprite: Sprite, sheet: Sheet | null): SpriteFacts => ({
  sprite,
  frames: sprite.frames.length,
  tags: sprite.tags.length,
  slices: sprite.slices.length,
  onSheet: sheet?.entries.some((entry) => entry.spriteId === sprite.id) ?? false,
  sheets: sheetsHolding(artwork, sprite),
});

export { spriteFacts };
