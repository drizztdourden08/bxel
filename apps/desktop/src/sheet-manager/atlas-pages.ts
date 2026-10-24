/* @layer renderer-app @kind logic */
import { packPages, packSheet } from '@bxel/formats';
import type { PackItem, PackPagesResult, PackSettings } from '@bxel/formats';

const atlasPages = (items: readonly PackItem[], settings: PackSettings, pageSide: number): PackPagesResult => {
  if (pageSide > 0) return packPages(items.map((item) => [item]), settings, pageSide);
  const packed = packSheet(items, settings);
  return packed.ok ? { ok: true, pages: [{ groups: items.map((_item, at) => at), packed }] } : packed;
};

export { atlasPages };
