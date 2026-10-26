/* @layer renderer-app @kind constants */
import type { AssetKind } from '@bxel/document';
import type { OverviewPreview, SpriteMove } from './asset-overview.type';

const OVERVIEW_KIND_LABEL: Readonly<Record<AssetKind, string>> = {
  sprite: 'Sprite',
  animation: 'Animation',
  sheet: 'Sheet',
  palette: 'Palette',
  tileset: 'Tileset',
  tilemap: 'Tilemap',
  project: 'Project',
};

const SPRITE_MOVES: readonly SpriteMove[] = [
  { id: 'flip-h', label: 'Flip horizontally', icon: 'arrow-left-right', flip: 'horizontal' },
  { id: 'flip-v', label: 'Flip vertically', icon: 'arrow-up-down', flip: 'vertical' },
  { id: 'turn-cw', label: 'Rotate clockwise', icon: 'rotate-ccw', iconFlip: 'horizontal', turn: 'clockwise' },
  { id: 'turn-ccw', label: 'Rotate counter-clockwise', icon: 'rotate-ccw', turn: 'counter-clockwise' },
];

const OVERVIEW_LABEL = {
  resizeSprite: 'Resize sprite',
  resizeMap: 'Resize map',
  duplicate: 'Duplicate asset',
} as const;

const OVERVIEW_TEXT = {
  pageTitle: 'Overview',
  previewTitle: 'Preview',
  detailsTitle: 'Details',
  linksTitle: 'Links',
  actionsTitle: 'Actions',
  nameLabel: 'Name',
  kind: 'Kind',
  filePath: 'File',
  fileSize: 'File size',
  modified: 'Last saved',
  created: 'Created',
  colours: 'Colours',
  size: 'Size',
  frames: 'Frames',
  layers: 'Layers',
  palette: 'Palette',
  sprites: 'Sprites on the sheet',
  layout: 'Layout',
  tiles: 'Tiles',
  tileSize: 'Tile size',
  mapSize: 'Map size',
  mapLayers: 'Layers',
  tileset: 'Tileset',
  capacity: 'Colour limit',
  transparent: 'Transparent slot',
  yes: 'Yes',
  no: 'No',
  unsaved: 'Not saved yet',
  unknown: 'Not known',
  noLinks: 'Nothing is linked to this asset.',
  uses: 'Uses',
  usedBy: 'Used by',
  openLink: (name: string): string => `Show ${name}`,
  frameLabel: (at: number, duration: number): string => `Frame ${at}, ${duration} ms`,
  framesGroup: 'Frames',
  previewLabel: (name: string): string => `Full size preview of ${name}`,
  noPreview: 'There is nothing to show yet.',
  swatchLabel: (name: string, rgb: string): string => (name === '' ? rgb : `${name}, ${rgb}`),
  transparentSwatch: 'Transparent',
  colourCount: (count: number): string => (count === 1 ? '1 colour' : `${count} colours`),
  pixelSize: (width: number, height: number): string => `${width} by ${height} pixels`,
  cellSize: (columns: number, rows: number): string => `${columns} by ${rows} cells`,
  rename: 'Rename',
  duplicate: 'Duplicate',
  exportAsset: 'Export...',
  moves: 'Turn the sprite',
  widthLabel: 'Width',
  heightLabel: 'Height',
  columnsLabel: 'Columns',
  rowsLabel: 'Rows',
  resize: 'Resize',
  resizeHint: 'Resizing keeps the artwork centred. One undo step undoes it.',
  badSize: 'Type whole numbers above zero.',
  nameEmpty: 'Type a name.',
  renameFailed: 'That name could not be used. Another asset may already have it.',
  readOnly: 'This asset is open read only.',
  failed: (reason: string): string => `Could not change the asset. ${reason}`,
  duplicated: (name: string): string => `Made a copy named ${name}.`,
  nothing: 'No actions fit this asset.',
} as const;

const COLOUR_KEY = { channels: 4, red: 65536, green: 256 } as const;

const PREVIEW_FRAME_LIMIT = 48;

const LINK_LIMIT = 60;

const NO_PREVIEW: OverviewPreview = { kind: 'none' };

export { COLOUR_KEY, LINK_LIMIT, NO_PREVIEW, OVERVIEW_KIND_LABEL, OVERVIEW_LABEL, OVERVIEW_TEXT, PREVIEW_FRAME_LIMIT, SPRITE_MOVES };
