/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the pixels of one file at a whole-number zoom on a checkerboard: a sprite or sheet as an image, an animation that plays, a palette as swatches.',
  useWhen: ['The Project window preview pane shows the selected file.', 'The Properties subject card shows the file the window is about.'],
  avoidWhen: [{ case: 'A tiny thumbnail in a list or a grid.', use: 'ItemCard' }],
  rules: [
    'It takes the preview model of the file, never the file. The caller builds it from the artwork.',
    'An animation waits for Play, plays in the loop mode of the file, and stops when the page is hidden or the component goes away.',
    'The zoom is the largest whole number that fits the stage and shows in a corner label.',
  ],
  a11y: [
    'The picture is an image named after the file. The playback controls are a group of labelled buttons and a frame counter that is read when it changes.',
    'Each swatch is named by its slot, name and colour value.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'AssetPreview is the one preview of a file in the Project and Properties windows.',
  },
  example: `import { AssetPreview } from '../AssetPreview';

const Pane = () => <AssetPreview preview={{ kind: 'none' }} name="hero" mode="large" />;
`,
  propsHash: '7841a2b4e0108dd1',
} satisfies ComponentUsage;

export { usage };
