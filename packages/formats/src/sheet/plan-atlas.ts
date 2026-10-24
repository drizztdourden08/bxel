/* @layer core @kind logic */
import { buildSheetCells } from './build-sheet-cells';
import { checkExportSprites } from './check-export-sprites';
import { packAtlas } from './pack-atlas';
import type { AtlasPlanInput, AtlasPlanResult } from './plan-atlas.type';

const planAtlas = (input: AtlasPlanInput): AtlasPlanResult => {
  const invalid = checkExportSprites(input.sprites);
  if (invalid) return invalid;
  const cells = buildSheetCells(input.sprites, input.trim);
  const groups = input.sprites.map((_sprite, at) =>
    cells
      .filter((cell) => cell.spriteIndex === at)
      .map((cell) => ({ key: cell.key, width: cell.trimmed.image.width, height: cell.trimmed.image.height })),
  );
  const paged = packAtlas(groups, input.settings, input.pageSide);
  return paged.ok ? { ok: true, cells, pages: paged.pages } : paged;
};

export { planAtlas };
