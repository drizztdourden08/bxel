/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, Sprite } from '@bxel/document';
import { bankSpriteImage } from '../sheet/bank-sprite-image';
import { TILE_CANVASES } from './tilemap.constants';

const tileCanvas = (artwork: Artwork, sprite: Sprite): HTMLCanvasElement | null => {
  const image = bankSpriteImage(findBank(artwork, sprite.bankId), sprite);
  if (!image) return null;
  const cached = TILE_CANVASES.get(image);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext('2d')?.putImageData(new ImageData(image.rgba, image.width, image.height), 0, 0);
  TILE_CANVASES.set(image, canvas);
  return canvas;
};

export { tileCanvas };
