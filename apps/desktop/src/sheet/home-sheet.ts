/* @layer renderer-app @kind logic */
import type { Artwork, Sheet, SpriteId } from '@bxel/document';

const homeSheet = (artwork: Artwork, activeId: SpriteId | null): Sheet | null =>
  artwork.sheets.find((sheet) => sheet.entries.some((entry) => entry.spriteId === activeId)) ?? artwork.sheets[0] ?? null;

export { homeSheet };
