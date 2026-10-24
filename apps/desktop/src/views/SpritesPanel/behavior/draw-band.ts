/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/document';

const drawBand = (canvas: HTMLCanvasElement, band: Rect | null): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!band) return;
  const tone = getComputedStyle(canvas).getPropertyValue('--c-primary-bright').trim() || 'currentColor';
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = tone;
  ctx.fillRect(band.x, band.y, band.width, band.height);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = tone;
  ctx.strokeRect(band.x + 0.5, band.y + 0.5, band.width, band.height);
};

export { drawBand };
