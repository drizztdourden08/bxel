/* @layer core @kind logic */
import { ERROR_CODE, expandNamePattern, fail } from '@bxel/document';
import type { Draft, Sprite } from '@bxel/document';
import type { SpriteSliceRequest } from './compose.type';
import { buildPiece } from './build-piece';
import { claimName } from './claim-name';
import { edgeWarning } from './edge-warning';
import { rectBlank } from './rect-blank';
import { sliceCells } from './slice-cells';
import { sliceGrid } from './slice-grid';

const slicePieces = (draft: Draft, source: Sprite, request: SpriteSliceRequest, taken: string[]): Sprite[] => {
  const grid = sliceGrid(source, request);
  const cells = sliceCells(grid).filter((cell) => !request.skipEmpty || !rectBlank(source, cell.rect));
  if (cells.length === 0) throw fail(ERROR_CODE.INVALID_OPTION, `Sprite "${source.name}" has no pixel in the grid.`);
  edgeWarning(draft, source, grid);
  const frames = source.frames.map((_frame, at) => at);
  const size = { width: grid.cellWidth, height: grid.cellHeight };
  return cells.map((cell) =>
    buildPiece(draft.ids, source, {
      name: claimName(taken, expandNamePattern(request.pattern, source.name, request.start + cell.index)),
      size,
      frames,
      crop: cell.rect,
      pivot: { x2: size.width, y2: size.height },
    }),
  );
};

export { slicePieces };
