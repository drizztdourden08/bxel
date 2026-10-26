/* @layer renderer-app @kind constants */
const MENU_TEXT = {
  edit: 'Edit',
  palette: 'Palette',
  layer: 'Layer',
  sprite: 'Sprite',
  sheet: 'Sheet',
  tilemap: 'Tilemap',
  arrange: 'Arrange',
  view: 'View',
  help: 'Help',
  zoom: 'Zoom',
  grid: 'Grid',
  symmetry: 'Symmetry',
  tiled: 'Tiled preview',
  transform: 'Transform',
  mirrorX: 'Mirror horizontally (X)',
  mirrorY: 'Mirror vertically (Y)',
  backToSheet: 'Back to sheet',
  noDocument: 'Open or create a file first.',
} as const;

const MENU_KEYS = {
  edit: 'edit',
  transform: 'edit-transform',
  palette: 'palette',
  layer: 'layer',
  sprite: 'asset-sprite',
  sheet: 'asset-sheet',
  tilemap: 'asset-tilemap',
  paletteAsset: 'asset-palette',
  arrange: 'sheet-arrange',
  view: 'view',
  help: 'help',
} as const;

export { MENU_KEYS, MENU_TEXT };
