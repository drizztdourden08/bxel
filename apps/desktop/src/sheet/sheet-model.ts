/* @layer renderer-app @kind logic */
import { findOverlaps, sheetExtent, sheetSizes } from '@bxel/document';
import type { Size } from '@bxel/document';
import { managerSheet } from '../sheet-manager/manager-sheet';
import { listSprites } from './list-sprites';
import { sheetAnimationItems } from './sheet-animation-items';
import { SHEET_GAP } from './sheet.constants';
import type { ModelInput, SheetAnimationItem, SheetItem, SheetModel } from './sheet.type';
import { virtualPlaces } from './virtual-places';

const animationRight = (item: SheetAnimationItem): number =>
  item.at.x + item.images.reduce((sum, image, index) => sum + image.width + (index === 0 ? 0 : item.spacing), 0);

const animationBottom = (item: SheetAnimationItem): number => item.at.y + Math.max(0, ...item.images.map((image) => image.height));

const boundsOf = (items: readonly SheetItem[], animations: readonly SheetAnimationItem[]): Size => ({
  width: Math.max(1, ...items.map((item) => item.at.x + item.sprite.width), ...animations.map(animationRight)),
  height: Math.max(1, ...items.map((item) => item.at.y + item.sprite.height), ...animations.map(animationBottom)),
});

const sheetModel = ({ artwork, activeId, sheetId = null }: ModelInput): SheetModel => {
  const sprites = listSprites(artwork);
  const sheet = managerSheet(artwork, sheetId, activeId);
  const sizes = sheetSizes(artwork);
  const byId = new Map(sprites.map((sprite) => [sprite.id, sprite] as const));
  const placed: SheetItem[] = (sheet?.entries ?? []).flatMap((entry) => {
    const sprite = byId.get(entry.spriteId);
    return sprite ? [{ sprite, at: entry.at, onSheet: true }] : [];
  });
  const on = new Set(placed.map((item) => item.sprite.id));
  const loose = sprites.filter((sprite) => !on.has(sprite.id));
  const base = sheet ? sheetExtent(sheet, sizes, artwork.animations) : { width: 0, height: 0 };
  const spots = virtualPlaces(artwork, loose, { x: 0, y: base.height > 0 ? base.height + SHEET_GAP : 0 }, base.width);
  const rest: SheetItem[] = loose.map((sprite) => ({ sprite, at: spots.get(sprite.id) ?? { x: 0, y: 0 }, onSheet: false }));
  const items = [...placed, ...rest];
  const animations = sheetAnimationItems(artwork, sheet);
  return { sheet, items, animations, extent: boundsOf(items, animations), overlaps: sheet ? findOverlaps(sheet, sizes) : [] };
};

export { sheetModel };
