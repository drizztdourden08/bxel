/* @layer core @kind logic */
import { ERROR_CODE, expandNamePattern, fail } from '@bxel/document';
import type { Draft, Sprite } from '@bxel/document';
import type { SpriteSliceRequest } from './compose.type';
import { buildPiece } from './build-piece';
import { claimPieceName } from './claim-piece-name';
import { edgeWarning } from './edge-warning';
import { findIslands } from './find-islands';
import { MAX_PIECES } from './compose.constants';
import { rectBlank } from './rect-blank';
import { sliceCells } from './slice-cells';
import { sliceGrid } from './slice-grid';

const islandPieces = (draft: Draft, source: Sprite, request: SpriteSliceRequest, taken: string[]): Sprite[] => {
  const boxes = findIslands(source, request.islands ?? { minSize: 1, merge: 0 });
  if (boxes.length === 0) throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${source.name}" has no pixel to cut out.`);
  if (boxes.length > MAX_PIECES) throw fail(ERROR_CODE.LIMIT_REACHED, `A slice makes at most ${MAX_PIECES} sprites. This image has ${boxes.length}.`);
  const frames = source.frames.map((_frame, at) => at);
  const existing = request.existing ?? 'fail';
  return boxes.flatMap((box, index) => {
    const name = claimPieceName(taken, expandNamePattern(request.pattern, source.name, request.start + index), existing);
    if (name === null) return [];
    return [buildPiece(draft.ids, source, { name, created: draft.stamp, size: { width: box.width, height: box.height }, frames, crop: box, pivot: { x2: box.width, y2: box.height } })];
  });
};

const slicePieces = (draft: Draft, source: Sprite, request: SpriteSliceRequest, taken: string[]): Sprite[] => {
  if (request.islands) return islandPieces(draft, source, request, taken);
  const grid = sliceGrid(source, request);
  const cells = sliceCells(grid).filter((cell) => !request.skipEmpty || !rectBlank(source, cell.rect));
  if (cells.length === 0) throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${source.name}" has no pixel in the grid.`);
  edgeWarning(draft, source, grid);
  const frames = source.frames.map((_frame, at) => at);
  const size = { width: grid.cellWidth, height: grid.cellHeight };
  const existing = request.existing ?? 'fail';
  return cells.flatMap((cell) => {
    const name = claimPieceName(taken, expandNamePattern(request.pattern, source.name, request.start + cell.index), existing);
    if (name === null) return [];
    return [buildPiece(draft.ids, source, { name, created: draft.stamp, size, frames, crop: cell.rect, pivot: { x2: size.width, y2: size.height } })];
  });
};

export { slicePieces };
