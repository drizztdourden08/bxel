/* @layer renderer-app @kind logic */
import { PATTERN_CELLS, PATTERN_GRID_ALPHA, PATTERN_MARK_ALPHA, PATTERN_SIZE } from './canvas-look.constants';
import type { CanvasLook } from './canvas-look.type';
import { fitCanvas } from './fit-canvas';
import { isBitSet } from './is-bit-set';

const edge = (cell: number, at: number): number => Math.round(cell * at);

const paintPatternGrid = (canvas: HTMLCanvasElement, look: CanvasLook, cursor: number | null, ink: string): void => {
  const ctx = fitCanvas(canvas);
  if (!ctx) return;
  const cell = canvas.width / PATTERN_SIZE;
  for (let index = 0; index < PATTERN_CELLS; index += 1) {
    const column = index % PATTERN_SIZE;
    const row = Math.floor(index / PATTERN_SIZE);
    const on = isBitSet(look.surroundBits, index);
    const rect = [edge(cell, column), edge(cell, row), edge(cell, column + 1) - edge(cell, column), edge(cell, row + 1) - edge(cell, row)] as const;
    ctx.fillStyle = on ? look.surroundB : look.surroundA;
    ctx.fillRect(...rect);
    if (!on) continue;
    ctx.globalAlpha = PATTERN_MARK_ALPHA;
    ctx.fillStyle = ink;
    ctx.fillRect(...rect);
    ctx.globalAlpha = 1;
  }
  ctx.globalAlpha = PATTERN_GRID_ALPHA;
  ctx.fillStyle = look.pixelLine.colour;
  for (let line = 0; line <= PATTERN_SIZE; line += 1) {
    ctx.fillRect(Math.min(edge(cell, line), canvas.width - 1), 0, 1, canvas.height);
    ctx.fillRect(0, Math.min(edge(cell, line), canvas.height - 1), canvas.width, 1);
  }
  ctx.globalAlpha = 1;
  if (cursor === null) return;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(edge(cell, cursor % PATTERN_SIZE) + 1, edge(cell, Math.floor(cursor / PATTERN_SIZE)) + 1, cell - 2, cell - 2);
};

export { paintPatternGrid };
