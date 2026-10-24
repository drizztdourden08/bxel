/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lists the layers of the current tilemap, and adds, renames, reorders, hides, locks and deletes them through the command engine.',
  useWhen: [
    'The editor is in Tilemap mode and places tiles, so the Layers widget shows map layers.',
    'A map needs a ground layer, a layer for objects and a layer that is hidden while working.',
  ],
  avoidWhen: [
    { case: 'The pixel layers of a sprite or a tile are shown.', use: 'LayersPanel' },
    { case: 'Tiles are listed.', use: 'TilesetPanel' },
  ],
  rules: [
    'The panel reads the active document and the tilemap store, so it takes no props.',
    'The top row draws above the rows under it.',
    'A hidden or locked layer refuses placement, and the engine says why.',
    'A tilemap always keeps at least one layer.',
  ],
  a11y: [
    'The rows are a list named Map layers, and the eye and lock toggles say if they are on.',
    'F2 renames the current layer and Delete removes it while the list has the focus.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'MapLayersPanel is the layer list of the tilemap editor.',
  },
  example: `import { MapLayersPanel } from '../MapLayersPanel';

const MapLayers = () => <MapLayersPanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
