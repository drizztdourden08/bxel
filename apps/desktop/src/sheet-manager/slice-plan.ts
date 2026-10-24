/* @layer renderer-app @kind logic */
import { expandNamePattern } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { rectBlank, sliceCells, sliceGrid } from '@bxel/raster';
import { COMPOSE_TEXT } from './compose-text.constants';
import type { SliceOptions, SlicePlan, SliceSpec } from './compose.type';
import { pieceError } from './piece-error';
import { sliceRequest } from './slice-request';

const namesOf = (sprite: Sprite, request: SliceOptions): string[] => {
  const grid = sliceGrid(sprite, request);
  return sliceCells(grid)
    .filter((cell) => !request.skipEmpty || !rectBlank(sprite, cell.rect))
    .map((cell) => expandNamePattern(request.pattern, sprite.name, request.start + cell.index).trim());
};

const slicePlan = (spec: SliceSpec, sources: readonly Sprite[], others: readonly string[]): SlicePlan => {
  const request = sliceRequest(spec);
  const [first] = sources;
  try {
    const grid = first ? sliceGrid(first, request) : null;
    const names = sources.flatMap((sprite) => namesOf(sprite, request));
    const leftOut = first && grid ? first.width * first.height - grid.columns * grid.cellWidth * grid.rows * grid.cellHeight : 0;
    return { names, grid, leftOut, error: names.length === 0 ? COMPOSE_TEXT.nothingInGrid : pieceError(names, others) };
  } catch (failure) {
    return { names: [], grid: null, leftOut: 0, error: failure instanceof Error ? failure.message : COMPOSE_TEXT.nameProblem };
  }
};

export { slicePlan };
