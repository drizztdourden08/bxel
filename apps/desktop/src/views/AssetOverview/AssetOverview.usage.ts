/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the asset in the open tab at full size with its name, kind, file, size, colours and links, and the basic actions that fit its kind.',
  useWhen: [
    'The Asset hub opens on an asset and the owner wants to see it whole before changing a setting.',
    'The owner renames, copies, exports, turns or resizes the asset without going back to the editor.',
  ],
  avoidWhen: [{ case: 'The owner changes one setting of the asset, such as the pivot or the frame time.', use: 'AssetControl' }],
  rules: [
    'It takes no props. It reads the asset of the active tab and follows it when the tab changes.',
    'The preview is a sprite with its frames, a sheet as its atlas, a palette as swatches, a tileset as its tiles and a tilemap as the map.',
    'The name is saved when the field loses focus or Enter is pressed. A name that cannot be used shows its reason and the old name stays.',
    'Turning and flipping act on the whole sprite and can be undone with one step. Resize keeps the artwork centred.',
    'Export opens in the editor, so the hub closes first.',
    'A link shows the linked asset, which becomes the asset of the page.',
  ],
  a11y: [
    'The preview is an image named after the asset. The frames are buttons that report which one is pressed.',
    'The swatches of a palette are named by their name and colour value.',
    'Every field and button has a label that says what it does.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'AssetOverview is the first page of every kind in the Asset hub.',
  },
  example: `import { AssetOverview } from '../AssetOverview';

const OverviewPage = () => <AssetOverview />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
