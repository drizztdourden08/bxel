/* @layer renderer-app @kind logic */
import { expandNamePattern } from '@bxel/document';
import type { Rect, Sprite } from '@bxel/document';
import { findIslands, rectBlank, sliceCells, sliceGrid } from '@bxel/raster';
import { COMPOSE_TEXT } from './compose-text.constants';
import type { SlicePlan, SliceSpec } from './compose.type';
import { pieceError } from './piece-error';
import { sliceRequest } from './slice-request';

const MAX_PIECES = 1024;

const namesFor = (sprite: Sprite, pieces: number, spec: SliceSpec): string[] =>
  Array.from({ length: pieces }, (_unused, index) => expandNamePattern(spec.pattern, sprite.name, spec.start + index).trim());

const gridPlan = (spec: SliceSpec, sources: readonly Sprite[]): Pick<SlicePlan, 'names' | 'grid' | 'leftOut' | 'rects'> => {
  const request = sliceRequest(spec);
  const [first] = sources;
  const grid = first ? sliceGrid(first, request) : null;
  const cutOf = (sprite: Sprite): Rect[] =>
    sliceCells(sliceGrid(sprite, request))
      .filter((cell) => !spec.skipEmpty || !rectBlank(sprite, cell.rect))
      .map((cell) => cell.rect);
  const names = sources.flatMap((sprite) => namesFor(sprite, cutOf(sprite).length, spec));
  const leftOut = first && grid ? first.width * first.height - grid.columns * grid.cellWidth * grid.rows * grid.cellHeight : 0;
  return { names, grid, leftOut, rects: first ? cutOf(first) : [] };
};

const islandPlan = (spec: SliceSpec, sources: readonly Sprite[]): Pick<SlicePlan, 'names' | 'grid' | 'leftOut' | 'rects'> => {
  const request = { minSize: spec.minSize, merge: spec.merge };
  const found = sources.map((sprite) => findIslands(sprite, request));
  return { names: sources.flatMap((sprite, at) => namesFor(sprite, found[at]?.length ?? 0, spec)), grid: null, leftOut: 0, rects: found[0] ?? [] };
};

const slicePlan = (spec: SliceSpec, sources: readonly Sprite[], others: readonly string[]): SlicePlan => {
  try {
    const parts = spec.by === 'islands' ? islandPlan(spec, sources) : gridPlan(spec, sources);
    const empty = spec.by === 'islands' ? COMPOSE_TEXT.noIslands : COMPOSE_TEXT.nothingInGrid;
    const error = parts.names.length === 0 ? empty : parts.names.length > MAX_PIECES ? COMPOSE_TEXT.tooManyPieces(MAX_PIECES) : pieceError(parts.names, others);
    return { ...parts, error };
  } catch (failure) {
    return { names: [], grid: null, leftOut: 0, rects: [], error: failure instanceof Error ? failure.message : COMPOSE_TEXT.nameProblem };
  }
};

export { slicePlan };
