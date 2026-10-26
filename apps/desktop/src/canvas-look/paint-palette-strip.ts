/* @layer renderer-app @kind logic */
import { PALETTE_COLUMNS } from './canvas-look.constants';
import { fitCanvas } from './fit-canvas';

const paintPaletteStrip = (canvas: HTMLCanvasElement, colours: readonly string[]): void => {
  const ctx = fitCanvas(canvas);
  if (!ctx || colours.length === 0) return;
  const rows = Math.ceil(colours.length / PALETTE_COLUMNS);
  const cell = Math.max(1, Math.floor(Math.min(canvas.width / PALETTE_COLUMNS, canvas.height / rows)));
  colours.forEach((colour, at) => {
    ctx.fillStyle = colour;
    ctx.fillRect((at % PALETTE_COLUMNS) * cell, Math.floor(at / PALETTE_COLUMNS) * cell, cell - 1, cell - 1);
  });
};

export { paintPaletteStrip };
