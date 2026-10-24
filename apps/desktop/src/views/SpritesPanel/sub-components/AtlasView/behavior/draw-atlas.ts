/* @layer renderer-app @kind logic */
import { findBank, frameToRgba } from '@bxel/document';
import type { Artwork, Sprite } from '@bxel/document';
import type { AtlasItem } from '../../../../../sheet-manager/manager.type';
import type { AtlasDraw } from '../AtlasView.type';
import { canvasTone } from './canvas-tone';
import { drawAtlasMarks } from './draw-atlas-marks';
import { frameCanvas } from '../../../behavior/frame-canvas';

const frameOf = (artwork: Artwork, sprite: Sprite, at: number) => {
  const bank = findBank(artwork, sprite.bankId);
  const frame = sprite.frames[at];
  if (!bank || !frame) return null;
  return { width: sprite.width, height: sprite.height, rgba: Uint8ClampedArray.from(frameToRgba(sprite, bank, frame.id)) };
};

const drawItem = (ctx: CanvasRenderingContext2D, source: HTMLCanvasElement, item: AtlasItem, scale: number): void => {
  ctx.save();
  ctx.translate(item.x * scale, item.y * scale);
  if (item.rotated) {
    ctx.translate(item.height * scale, 0);
    ctx.rotate(Math.PI / 2);
  }
  ctx.drawImage(source, item.source.x, item.source.y, item.source.width, item.source.height, 0, 0, item.width * scale, item.height * scale);
  ctx.restore();
};

const drawAtlas = (canvas: HTMLCanvasElement, view: AtlasDraw): void => {
  const { atlas, scale, artwork } = view;
  canvas.width = Math.max(1, atlas.width * scale);
  canvas.height = Math.max(1, atlas.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = canvasTone(canvas, '--c-sunken');
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  const sprites = new Map(artwork.sprites.map((sprite) => [sprite.id, sprite] as const));
  for (const item of atlas.items) {
    const sprite = sprites.get(item.id);
    const image = sprite ? frameOf(artwork, sprite, item.frame) : null;
    if (image) drawItem(ctx, frameCanvas(canvas.ownerDocument, image), item, scale);
  }
  drawAtlasMarks(canvas, view);
};

export { drawAtlas };
