/* @layer renderer-app @kind logic */
import type { PixelPoint, PixelSource } from '../../PixelViewport';
import { LOUPE } from '../CanvasOverlays.constants';
import { drawable } from './drawable';

const paintLoupe = (canvas: HTMLCanvasElement, source: PixelSource, at: PixelPoint, zoom: number): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const scratch = canvas.ownerDocument.createElement('canvas');
  const image = drawable(source, scratch);
  const scale = Math.min(zoom * LOUPE.times, LOUPE.size / LOUPE.minPixels);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!image) return;
  ctx.imageSmoothingEnabled = false;
  const left = LOUPE.size / 2 - (at.x + 0.5) * scale;
  const top = LOUPE.size / 2 - (at.y + 0.5) * scale;
  ctx.drawImage(image, left, top, source.width * scale, source.height * scale);
  if (scale >= LOUPE.gridFrom) {
    ctx.beginPath();
    for (let x = Math.ceil(-left / scale); x <= source.width; x += 1) {
      const line = Math.round(left + x * scale) + 0.5;
      if (line > LOUPE.size) break;
      ctx.moveTo(line, 0);
      ctx.lineTo(line, LOUPE.size);
    }
    for (let y = Math.ceil(-top / scale); y <= source.height; y += 1) {
      const line = Math.round(top + y * scale) + 0.5;
      if (line > LOUPE.size) break;
      ctx.moveTo(0, line);
      ctx.lineTo(LOUPE.size, line);
    }
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
    ctx.stroke();
  }
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(LOUPE.size / 2 - scale / 2, LOUPE.size / 2 - scale / 2, scale, scale);
};

export { paintLoupe };
