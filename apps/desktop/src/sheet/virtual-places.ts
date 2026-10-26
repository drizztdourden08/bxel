/* @layer renderer-app @kind logic */
import { arrangeSheet, sheetSizes } from '@bxel/document';
import type { Artwork, Point, SheetId, Sprite, SpriteId } from '@bxel/document';
import { VIRTUAL_MIN_WIDTH, VIRTUAL_SPACING } from './sheet.constants';

const virtualPlaces = (artwork: Artwork, loose: readonly Sprite[], below: Point, width: number): Map<SpriteId, Point> => {
  const maxWidth = Math.max(width, VIRTUAL_MIN_WIDTH, ...loose.map((sprite) => sprite.width));
  const arranged = arrangeSheet(
    {
      id: 'sht_virtual' as SheetId,
      name: '',
      layout: { kind: 'packed', maxWidth },
      spacing: VIRTUAL_SPACING,
      margin: 0,
      entries: loose.map((sprite) => ({ spriteId: sprite.id, at: { x: 0, y: 0 }, source: null })),
    },
    sheetSizes(artwork),
    artwork.animations,
  );
  return new Map(arranged.entries.map((entry) => [entry.spriteId, { x: below.x + entry.at.x, y: below.y + entry.at.y }] as const));
};

export { virtualPlaces };
