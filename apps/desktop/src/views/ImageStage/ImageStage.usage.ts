/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Fills the stage of an image tab with a read only preview of the PNG, APNG or GIF, with its size and frame count, and an Import button that opens the Import wizard on it.',
  useWhen: [
    'A PNG, APNG or GIF was opened with Open or from the project folder. It is a preview, not an asset, so nothing in it can be edited.',
  ],
  avoidWhen: [
    { case: 'A sprite, animation or tile is being drawn on.', use: 'EditorCanvas' },
    { case: 'Two images are compared inside the Import wizard.', use: 'ImagePreview' },
  ],
  rules: [
    'The stage takes no props. It reads the active image tab.',
    'The header shows the name, the size, the frame count when there are several, and a Read only tag.',
    'Import is the only action. Drawing tools, layers and the timeline stay hidden.',
  ],
  a11y: [
    'The stage is a named region and the preview inside it is one Tab stop.',
    'Import is a normal button with a title that says what it does.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'ImageStage shows a finished image file that the person only looks at before importing it.',
  },
  example: `import { ImageStage } from '../ImageStage';

const Stage = () => <ImageStage />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
