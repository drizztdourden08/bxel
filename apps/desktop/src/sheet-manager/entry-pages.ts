/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { atlasPlan } from './atlas-plan';
import type { AtlasPack } from './manager.type';

const entryPages = (sheet: Sheet | null, artwork: Artwork, atlas: AtlasPack): ReadonlyMap<string, number> => {
  const pages = new Map<string, number>();
  if (!sheet) return pages;
  if (atlas.pageSide <= 0) {
    for (const entry of sheet.entries) pages.set(entry.spriteId, 1);
    return pages;
  }
  const planned = atlasPlan({ sheet, artwork, ...atlas, page: 0 });
  if (!planned.ok) return pages;
  planned.plan.pages.forEach((page, at) => {
    for (const group of page.groups) {
      const sprite = planned.targets[group]?.sprite;
      if (sprite) pages.set(sprite.id, at + 1);
    }
  });
  return pages;
};

export { entryPages };
