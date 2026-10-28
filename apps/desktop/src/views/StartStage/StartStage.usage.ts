/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Fills the stage when no asset, image or project file is open, with the three ways to begin: create an asset, open a file, or open the demo project.',
  useWhen: [
    'The last tab was closed, or a project with no tab open is shown. The tool rail dims and the document widgets hide around it.',
  ],
  avoidWhen: [
    { case: 'The person picks the type of a new file.', use: 'FileTypePicker' },
  ],
  rules: [
    'The stage takes no props. Each button runs the app command that the menu runs, so the keyboard and the menu give the same answer.',
    'New asset is the primary action.',
  ],
  a11y: [
    'The stage is a named region and every action is a normal button.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'StartStage is the empty state of the editor stage.',
  },
  example: `import { StartStage } from '../StartStage';

const Stage = () => <StartStage />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
