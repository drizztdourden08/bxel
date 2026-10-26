/* @layer renderer-app @kind logic */
import { findSheet, findSprite, sheetExtent, sheetSizes } from '@bxel/document';
import type { Artwork, SheetId } from '@bxel/document';
import { renderSheet } from '../sheet/render-sheet';
import type { SheetItem } from '../sheet/sheet.type';
import type { OverviewPreview } from './asset-overview.type';

const sheetPreviewImage = (artwork: Artwork, id: string): OverviewPreview => {
  const sheet = findSheet(artwork, id as SheetId);
  if (!sheet) return { kind: 'none' };
  const items = sheet.entries.flatMap((entry): SheetItem[] => {
    const sprite = findSprite(artwork, entry.spriteId);
    return sprite ? [{ sprite, at: entry.at, onSheet: true }] : [];
  });
  const extent = sheetExtent(sheet, sheetSizes(artwork));
  if (items.length === 0 || extent.width < 1 || extent.height < 1) return { kind: 'none' };
  const atlas = renderSheet(artwork, { sheet, items, extent, overlaps: [] }, new Map());
  return { kind: 'image', image: { data: atlas.rgba, width: atlas.width, height: atlas.height } };
};

export { sheetPreviewImage };
