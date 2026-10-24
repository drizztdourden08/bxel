/* @layer core @kind config */
const ASSET_KIND = {
  sprite: 'sprite',
  sheet: 'sheet',
  palette: 'palette',
  tileset: 'tileset',
  tilemap: 'tilemap',
  project: 'project',
} as const;

const ASSET_FORMAT = {
  sprite: { extension: '.bxsprite', mime: 'application/vnd.bxel.sprite+zip', progId: 'Bxel.Sprite' },
  sheet: { extension: '.bxsheet', mime: 'application/vnd.bxel.sheet+zip', progId: 'Bxel.Sheet' },
  palette: { extension: '.bxpalette', mime: 'application/vnd.bxel.palette+zip', progId: 'Bxel.Palette' },
  tileset: { extension: '.bxtiles', mime: 'application/vnd.bxel.tileset+zip', progId: 'Bxel.Tileset' },
  tilemap: { extension: '.bxmap', mime: 'application/vnd.bxel.tilemap+zip', progId: 'Bxel.Tilemap' },
  project: { extension: '.bxproject', mime: 'application/vnd.bxel.project+zip', progId: 'Bxel.Project' },
} as const;

const LEGACY_FORMAT = { extension: '.bxel', mime: 'application/vnd.bxel+zip', progId: 'Bxel.Document' } as const;

export { ASSET_FORMAT, ASSET_KIND, LEGACY_FORMAT };
