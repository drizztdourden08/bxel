/* @layer renderer-app @kind logic */
import { exportSheet, exportSheetPages } from '@bxel/formats';
import type { PlanParts, PlannedFile } from './export.type';
import { exportSprite } from './export-sprite';
import { sheetFiles } from './sheet-files';
import { sheetSettings } from './sheet-settings';

const pageStem = (base: string, page: number, count: number): string => (count === 1 ? base : `${base}_${page + 1}`);

const planSheet = (parts: PlanParts): PlannedFile[] | string => {
  const { targets, settings, base, map } = parts;
  const common = {
    sprites: targets.map(exportSprite),
    settings: sheetSettings(targets, settings),
    trim: settings.trim,
    scale: settings.scale,
    flavour: settings.flavour,
  };
  const last = targets.length - 1;
  if (settings.pageSide > 0) {
    const paged = exportSheetPages({
      ...common,
      pageSide: settings.pageSide,
      imageName: (page, count) => `${pageStem(base, page, count)}.png`,
    });
    return paged.ok ? paged.pages.flatMap((page) => sheetFiles(page, map, last)) : paged.message;
  }
  const sheet = exportSheet({ ...common, imageName: `${base}.png` });
  return sheet.ok ? sheetFiles(sheet, map, last) : sheet.message;
};

export { planSheet };
