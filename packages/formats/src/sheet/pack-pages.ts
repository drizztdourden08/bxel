/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { packSheet } from './pack-sheet';
import type { OpenPage } from './pack-pages.type';
import type { PackedPage, PackedSheet, PackItem, PackPagesResult, PackResult, PackSettings } from './sheet.type';

const fitted = (result: PackResult, side: number): PackedSheet | null =>
  result.ok && result.width <= side && result.height <= side ? result : null;

const itemsOf = (groups: readonly (readonly PackItem[])[], indexes: readonly number[]): PackItem[] =>
  indexes.flatMap((index) => groups[index] ?? []);

const packPages = (groups: readonly (readonly PackItem[])[], settings: PackSettings, side: number): PackPagesResult => {
  const pages: PackedPage[] = [];
  const open: OpenPage = { groups: [], packed: null };
  const close = (): void => {
    if (open.packed !== null) pages.push({ groups: open.groups, packed: open.packed });
  };
  for (const index of groups.keys()) {
    const trial = fitted(packSheet(itemsOf(groups, [...open.groups, index]), settings), side);
    if (trial) {
      open.groups = [...open.groups, index];
      open.packed = trial;
      continue;
    }
    close();
    const raw = packSheet(itemsOf(groups, [index]), settings);
    const alone = fitted(raw, side);
    if (!alone) return raw.ok ? formatFail(FORMAT_ERROR_CODE.SHEET_TOO_LARGE, `An entry is larger than a page of ${side} pixels`) : raw;
    open.groups = [index];
    open.packed = alone;
  }
  close();
  return { ok: true, pages };
};

export { packPages };
