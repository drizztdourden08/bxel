/* @layer renderer-app @kind logic */
import { MAX_POINTS } from '@bxel/document';
import type { Point } from '@bxel/document';

const chunkCells = (cells: readonly Point[]): Point[][] => {
  const chunks: Point[][] = [];
  for (let at = 0; at < cells.length; at += MAX_POINTS) chunks.push(cells.slice(at, at + MAX_POINTS));
  return chunks;
};

export { chunkCells };
