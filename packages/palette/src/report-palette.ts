/* @layer core @kind logic */
import { findDuplicates } from './find-duplicates';
import type { PaletteReport, ReportOptions } from './palette-report.type';
import { parsePalette } from './parse-palette';

const reportPalette = ({ palette, transparent, usage }: ReportOptions): PaletteReport => {
  const table = parsePalette(palette, transparent);
  const used: number[] = [];
  const unused: number[] = [];
  for (let slot = 0; slot < table.length; slot += 1) {
    ((usage[slot] ?? 0) > 0 ? used : unused).push(slot);
  }
  let outOfRange = 0;
  for (let slot = table.length; slot < usage.length; slot += 1) outOfRange += usage[slot] ?? 0;
  return { used, unused, duplicates: findDuplicates(table), outOfRange };
};

export { reportPalette };
