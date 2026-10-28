/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lists the tiles of the current tileset with how often each is placed, picks a tile or a rectangle of tiles as the stamp, and adds, duplicates, makes unique, edits and deletes tiles.',
  useWhen: [
    'The user builds a map and needs the tiles beside the map canvas.',
    'A tile is to be edited and the user needs to know how many map cells use it.',
  ],
  avoidWhen: [
    { case: 'Sprites of a sheet are managed.', use: 'SpritesPanel' },
    { case: 'The layers of one sprite are shown.', use: 'LayerStack' },
  ],
  rules: [
    'The panel reads the active document and the tilemap store, so it takes no props.',
    'Deleting a tile that is placed asks first and shows how many cells use it.',
    'Edit tile changes the pixels of the tile, and every placement of the tile changes with it.',
    'Picking tiles never changes a pixel.',
  ],
  a11y: [
    'The tiles are a group of toggle buttons, each named with its number and how often it is placed.',
    'Shift and click, or a drag across the tiles, picks a rectangle of tiles as a stamp.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'TilesetPanel is the tile library of the tilemap editor.',
  },
  example: `import { TilesetPanel } from '../TilesetPanel';

const Tiles = () => <TilesetPanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
