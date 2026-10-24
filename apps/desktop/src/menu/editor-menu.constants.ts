/* @layer renderer-app @kind constants */
const MENU_TEXT = {
  edit: 'Edit',
  palette: 'Palette',
  layer: 'Layer',
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
  noDocument: 'Open or create a file first.',
} as const;

const MENU_KEYS = {
  edit: 'edit',
  transform: 'edit-transform',
  palette: 'palette',
  layer: 'layer',
  sheet: 'sheet',
  tilemap: 'tilemap',
  arrange: 'sheet-arrange',
  view: 'view',
  help: 'help',
} as const;

export { MENU_KEYS, MENU_TEXT };
