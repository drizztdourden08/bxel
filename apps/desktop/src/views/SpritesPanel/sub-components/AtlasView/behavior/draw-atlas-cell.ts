/* @layer renderer-app @kind logic */
import type { CellBox } from './draw-atlas-cell.type';

const drawAtlasCell = (ctx: CanvasRenderingContext2D, source: HTMLCanvasElement, cell: CellBox, scale: number): void => {
  ctx.save();
  ctx.translate(cell.x * scale, cell.y * scale);
  if (cell.rotated) {
    ctx.translate(cell.height * scale, 0);
    ctx.rotate(Math.PI / 2);
  }
  ctx.drawImage(source, cell.source.x, cell.source.y, cell.source.width, cell.source.height, 0, 0, cell.width * scale, cell.height * scale);
  ctx.restore();
};

export { drawAtlasCell };
