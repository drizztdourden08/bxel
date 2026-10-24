/* @layer renderer-app @kind logic */
import { findOverlaps, sheetExtent, sheetSizes } from '@bxel/document';
import type { Size } from '@bxel/document';
import { homeSheet } from './home-sheet';
import { listSprites } from './list-sprites';
import { SHEET_GAP } from './sheet.constants';
import type { ModelInput, SheetItem, SheetModel } from './sheet.type';
import { virtualPlaces } from './virtual-places';

const boundsOf = (items: readonly SheetItem[]): Size => ({
  width: Math.max(1, ...items.map((item) => item.at.x + item.sprite.width)),
  height: Math.max(1, ...items.map((item) => item.at.y + item.sprite.height)),
});

const sheetModel = ({ artwork, activeId }: ModelInput): SheetModel => {
  const sprites = listSprites(artwork);
  const sheet = homeSheet(artwork, activeId);
  const sizes = sheetSizes(artwork);
  const byId = new Map(sprites.map((sprite) => [sprite.id, sprite] as const));
  const placed: SheetItem[] = (sheet?.entries ?? []).flatMap((entry) => {
    const sprite = byId.get(entry.spriteId);
    return sprite ? [{ sprite, at: entry.at, onSheet: true }] : [];
  });
  const on = new Set(placed.map((item) => item.sprite.id));
  const loose = sprites.filter((sprite) => !on.has(sprite.id));
  const base = sheet ? sheetExtent(sheet, sizes) : { width: 0, height: 0 };
  const spots = virtualPlaces(artwork, loose, { x: 0, y: base.height > 0 ? base.height + SHEET_GAP : 0 }, base.width);
  const rest: SheetItem[] = loose.map((sprite) => ({ sprite, at: spots.get(sprite.id) ?? { x: 0, y: 0 }, onSheet: false }));
  const items = [...placed, ...rest];
  return { sheet, items, extent: boundsOf(items), overlaps: sheet ? findOverlaps(sheet, sizes) : [] };
};

export { sheetModel };
