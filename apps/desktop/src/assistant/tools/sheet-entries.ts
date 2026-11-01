/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { folderPath } from '../../sheet-manager/folder-path';
import { sheetExportView } from './sheet-export-view';
import { spriteUsedBy } from './sprite-used-by';

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
      ? [{ kind: 'sprite' as const, id: sprite.id, name: sprite.name, folder: folderPath(sprite.name), at: entry.at, source: entry.source, tagId: null, usedBy: [...spriteUsedBy(artwork, sprite.id, sheet.id)] }]
      : [];
  });
  const strips = (sheet.animationEntries ?? []).flatMap((entry) => {
    const animation = artwork.animations.find((each) => each.id === entry.animationId);
    return animation && !hidden.has(animation.id)
      ? [{ kind: 'animation' as const, id: animation.id, name: animation.name, folder: folderPath(animation.name), at: entry.at, source: null, tagId: entry.tagId, usedBy: [] }]
      : [];
  });
  return { layout: layoutOf(sheet), entryList: [...sprites, ...strips], ...sheetExportView(artwork, sheet) };
};

export { sheetEntries };
