/* @layer renderer-app @kind constants */
const MENU_TEXT = {
  edit: 'Edit',
  palette: 'Palette',
  layer: 'Layer',
  view: 'View',
  help: 'Help',
  zoom: 'Zoom',
  symmetry: 'Symmetry',
  tiled: 'Tiled preview',
  mirrorX: 'Mirror horizontally (X)',
  mirrorY: 'Mirror vertically (Y)',
  noDocument: 'Open or create a file first.',
} as const;

const MENU_KEYS = {
  edit: 'edit',
  palette: 'palette',
  layer: 'layer',
  view: 'view',
  help: 'help',
} as const;

export { MENU_KEYS, MENU_TEXT };
