/* @layer renderer-app @kind logic */
import { exportSheetPages } from '@bxel/formats';
import type { PlanParts, PlannedFile } from './export.type';
import { sheetFiles } from './sheet-files';
import { sheetInput } from './sheet-input';

const pageStem = (base: string, page: number, count: number): string => (count === 1 ? base : `${base}_${page + 1}`);

const planSheet = (parts: PlanParts): PlannedFile[] | string => {
  const { targets, settings, base, map, extra } = parts;
  const input = sheetInput(targets, settings, extra);
  const paged = exportSheetPages({
    ...input,
    pageSide: settings.pageSide,
    imageName: (page, count) => `${pageStem(base, page, count)}.png`,
  });
  const last = Math.max(0, targets.length + extra.length - 1);
  return paged.ok ? paged.pages.flatMap((page) => sheetFiles(page, map, last, input.flavour)) : paged.message;
};

export { planSheet };
