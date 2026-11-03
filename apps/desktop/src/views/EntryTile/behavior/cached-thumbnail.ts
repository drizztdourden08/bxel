/* @layer renderer-app @kind logic */
import type { PaletteBank, Sprite } from '@bxel/document';
import { bankSpriteImage } from '../../../sheet/bank-sprite-image';
import { THUMB_CACHE_LIMIT } from '../EntryTile.constants';
import { drawThumbnail } from './draw-thumbnail';
import { keptCanvas } from './kept-canvas';
import type { KeptCanvas } from './kept-canvas.type';

const kept = new Map<string, KeptCanvas<HTMLCanvasElement>>();

const cachedThumbnail = (owner: Document, bank: PaletteBank | undefined, sprite: Sprite, box: number): HTMLCanvasElement =>
  keptCanvas({
    kept,
    key: `${sprite.id}:${box}`,
    sprite,
    bank,
    limit: THUMB_CACHE_LIMIT,
    make: () => {
      const canvas = owner.createElement('canvas');
      canvas.width = box;
      canvas.height = box;
      drawThumbnail(canvas, bankSpriteImage(bank, sprite), box);
      return canvas;
    },
  });

export { cachedThumbnail };
