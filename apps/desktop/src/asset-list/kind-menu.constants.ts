/* @layer renderer-app @kind constants */
const KIND_MENU = {
  addToAnimation: 'Add to the open animation',
  applyPalette: 'Apply to the open asset',
  duplicateVariant: 'Duplicate as variant',
  newTilemapFrom: 'New tilemap from it',
  splitLegacy: 'Split into files',
  exportFrames: 'Export frames...',
  exportSheet: 'Export packed image and atlas...',
  exportMap: 'Export map...',
  openSprites: 'Open sprites',
  openTileset: 'Open tileset',
  unpack: 'Unpack',
  openInHub: 'Open in Project hub',
  importSprite: 'Import as sprite',
  importTileset: 'Import as tileset',
  noSpriteOpen: 'Open a sprite first, then apply the palette to it.',
  noTileset: 'Open a tileset first, then import the image into it.',
  openedLimit: (count: number): string => `Opened the first ${count} sprites of the sheet.`,
} as const;

const OPEN_SPRITES_LIMIT = 20;

export { KIND_MENU, OPEN_SPRITES_LIMIT };
