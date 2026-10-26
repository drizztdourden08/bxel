/* @layer renderer-app @kind logic */
import type { Sheet, Sprite } from '@bxel/document';

const sheetSprites = (sheet: Sheet, eligible: readonly Sprite[]): Sprite[] =>
  sheet.entries.flatMap((entry) => eligible.find((sprite) => sprite.id === entry.spriteId) ?? []);

export { sheetSprites };
