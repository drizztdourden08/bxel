/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws the layers of the open tilemap from their tile references, with the cell grid, and turns pointer input into placing, erasing, filling, rectangles, picking and selecting.',
  useWhen: [
    'The editor is in Tilemap mode and the user is placing tiles on the map.',
    'A tile must show how it sits in the map with its flips and turns.',
  ],
  avoidWhen: [
    { case: 'The pixels of one tile are drawn.', use: 'EditorCanvas' },
    { case: 'Sprites are arranged on a sheet.', use: 'SheetCanvas' },
  ],
  rules: [
    'The canvas reads the active document and the tilemap store, so it takes no props.',
    'Every placement goes through the command engine and is one undo step.',
    'Placing or replacing a tile never changes the pixels of the tile.',
    'A locked or hidden map layer refuses placement with the engine message.',
  ],
  a11y: [
    'The viewport is one Tab stop named Tilemap canvas, with the zoom announced when it settles.',
    'Escape drops the cell selection and any drag in progress.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'TilemapCanvas is the map drawing surface of the editor, with tile placement wired to the document.',
  },
  example: `import { TilemapCanvas } from '../TilemapCanvas';

const MapBody = () => <TilemapCanvas />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
