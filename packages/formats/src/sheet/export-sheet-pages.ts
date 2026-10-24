/* @layer core @kind logic */
import { buildSheetCells } from './build-sheet-cells';
import { checkExportInput } from './check-export-input';
import type { ExportPagesInput, ExportPagesResult } from './export-pages.type';
import { exportSheet } from './export-sheet';
import type { ExportedSheet } from './export-sheet.type';
import { packPages } from './pack-pages';

const exportSheetPages = (input: ExportPagesInput): ExportPagesResult => {
  const invalid = checkExportInput({ ...input, imageName: input.imageName(0, 1) });
  if (invalid) return invalid;
  const cells = buildSheetCells(input.sprites, input.trim);
  const groups = input.sprites.map((_sprite, at) =>
    cells
      .filter((cell) => cell.spriteIndex === at)
      .map((cell) => ({ key: cell.key, width: cell.trimmed.image.width, height: cell.trimmed.image.height })),
  );
  const paged = packPages(groups, input.settings, input.pageSide);
  if (!paged.ok) return paged;
  const pages: ExportedSheet[] = [];
  for (const [at, page] of paged.pages.entries()) {
    const sprites = page.groups.flatMap((index) => input.sprites[index] ?? []);
    const sheet = exportSheet({ ...input, sprites, imageName: input.imageName(at, paged.pages.length) });
    if (!sheet.ok) return sheet;
    pages.push(sheet);
  }
  return { ok: true, pages };
};

export { exportSheetPages };
