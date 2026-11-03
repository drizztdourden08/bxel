/* @layer renderer-app @kind logic */
import type { PaletteBank, Sprite } from '@bxel/document';
import { bankSpriteImage } from '../../../sheet/bank-sprite-image';
import { THUMB_CACHE_LIMIT } from '../EntryTile.constants';
import type { ThumbEntry } from '../EntryTile.type';
import { drawThumbnail } from './draw-thumbnail';

const kept = new Map<string, ThumbEntry>();

const cachedThumbnail = (owner: Document, bank: PaletteBank | undefined, sprite: Sprite, box: number): HTMLCanvasElement => {
  const key = `${sprite.id}:${box}`;
  const hit = kept.get(key);
  if (hit && hit.sprite === sprite && hit.bank === bank) return hit.canvas;
  const canvas = owner.createElement('canvas');
  canvas.width = box;
  canvas.height = box;
  drawThumbnail(canvas, bankSpriteImage(bank, sprite), box);
  kept.delete(key);
  kept.set(key, { sprite, bank, canvas });
  if (kept.size > THUMB_CACHE_LIMIT) {
    const oldest = kept.keys().next().value;
    if (oldest !== undefined) kept.delete(oldest);
  }
  return canvas;
};

export { cachedThumbnail };
