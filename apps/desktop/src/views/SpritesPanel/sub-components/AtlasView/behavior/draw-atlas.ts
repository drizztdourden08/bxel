/* @layer renderer-app @kind logic */
import { spriteImage } from '../../../../../sheet/sprite-image';
import type { AtlasDraw } from '../AtlasView.type';
import { canvasTone } from './canvas-tone';
import { drawAtlasMarks } from './draw-atlas-marks';
import { frameCanvas } from '../../../behavior/frame-canvas';

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
    const image = sprite ? spriteImage(artwork, sprite) : null;
    if (image) ctx.drawImage(frameCanvas(canvas.ownerDocument, image), item.x * scale, item.y * scale, item.width * scale, item.height * scale);
  }
  drawAtlasMarks(canvas, view);
};

export { drawAtlas };
