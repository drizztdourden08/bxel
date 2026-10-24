/* @layer core @kind logic */
import { packPages } from './pack-pages';
import { packSheet } from './pack-sheet';
import type { PackItem, PackPagesResult, PackSettings } from './sheet.type';

const packAtlas = (groups: readonly (readonly PackItem[])[], settings: PackSettings, pageSide: number): PackPagesResult => {
  if (pageSide > 0) return packPages(groups, settings, pageSide);
  const packed = packSheet(groups.flat(), settings);
  return packed.ok ? { ok: true, pages: [{ groups: groups.map((_group, at) => at), packed }] } : packed;
};

export { packAtlas };
