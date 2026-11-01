/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import type { Use } from './sprite-used-by.type';

const spriteUsedBy = (artwork: Artwork, spriteId: string, ownSheetId: string): readonly Use[] => [
  ...artwork.animations.filter((animation) => animation.frames.some((frame) => frame.spriteId === spriteId)).map((animation) => ({ kind: 'animation' as const, id: animation.id, name: animation.name })),
  ...artwork.tilesets.filter((tileset) => tileset.tiles.some((tile) => tile.spriteId === spriteId)).map((tileset) => ({ kind: 'tileset' as const, id: tileset.id, name: tileset.name })),
  ...artwork.sheets.filter((sheet) => sheet.id !== ownSheetId && sheet.entries.some((entry) => entry.spriteId === spriteId)).map((sheet) => ({ kind: 'sheet' as const, id: sheet.id, name: sheet.name })),
];

export { spriteUsedBy };
