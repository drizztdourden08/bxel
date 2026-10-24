/* @layer renderer-app @kind logic */
import type { Artwork, Sheet, SheetId, SpriteId } from '@bxel/document';
import { homeSheet } from '../sheet/home-sheet';

const managerSheet = (artwork: Artwork, chosen: SheetId | null, activeId: SpriteId | null): Sheet | null =>
  artwork.sheets.find((sheet) => sheet.id === chosen) ?? homeSheet(artwork, activeId);

export { managerSheet };
