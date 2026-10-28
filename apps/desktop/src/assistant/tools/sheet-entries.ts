/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { folderPath } from '../../sheet-manager/folder-path';

const layoutOf = (sheet: Sheet) => ({
  kind: sheet.layout.kind,
  ...(sheet.layout.kind === 'grid' ? { columns: sheet.layout.columns } : {}),
  ...(sheet.layout.kind === 'packed' ? { maxWidth: sheet.layout.maxWidth } : {}),
  spacing: sheet.spacing.x,
  margin: sheet.margin,
});

const sheetEntries = (artwork: Artwork, sheet: Sheet, hidden: ReadonlySet<string>) => {
  const sprites = sheet.entries.flatMap((entry) => {
    const sprite = artwork.sprites.find((each) => each.id === entry.spriteId);
    return sprite && !hidden.has(sprite.id)
      ? [{ kind: 'sprite' as const, id: sprite.id, name: sprite.name, folder: folderPath(sprite.name), at: entry.at, source: entry.source, tagId: null }]
      : [];
  });
  const strips = (sheet.animationEntries ?? []).flatMap((entry) => {
    const animation = artwork.animations.find((each) => each.id === entry.animationId);
    return animation && !hidden.has(animation.id)
      ? [{ kind: 'animation' as const, id: animation.id, name: animation.name, folder: folderPath(animation.name), at: entry.at, source: null, tagId: entry.tagId }]
      : [];
  });
  return { layout: layoutOf(sheet), entryList: [...sprites, ...strips] };
};

export { sheetEntries };
