/* @layer core @kind logic */
import { checkExportInput } from './check-export-input';
import type { ExportPagesInput, ExportPagesResult } from './export-pages.type';
import type { ExportedSheet } from './export-sheet.type';
import { finishSheet } from './finish-sheet';
import { pageCells } from './page-cells';
import { planAtlas } from './plan-atlas';
import { shouldMerge } from './should-merge';

const exportSheetPages = (input: ExportPagesInput): ExportPagesResult => {
  const invalid = checkExportInput({ ...input, imageName: input.imageName(0, 1) });
  if (invalid) return invalid;
  const plan = planAtlas({
    sprites: input.sprites,
    settings: input.settings,
    trim: input.trim,
    pageSide: input.pageSide,
    mergeIdentical: shouldMerge(input),
  });
  if (!plan.ok) return plan;
  const pages: ExportedSheet[] = [];
  for (const [at, page] of plan.pages.entries()) {
    const sprites = page.groups.flatMap((index) => input.sprites[index] ?? []);
    const sheet = finishSheet(
      { ...input, sprites, imageName: input.imageName(at, plan.pages.length) },
      pageCells(plan.cells, page.groups),
      page.packed,
    );
    if (!sheet.ok) return sheet;
    pages.push(sheet);
  }
  return { ok: true, pages };
};

export { exportSheetPages };
