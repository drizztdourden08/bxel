/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks for the name of a tool preset and which of the options of the tool it keeps, then saves only the ticked ones with their current values.',
  useWhen: [
    'The person chooses Save as preset from the Tools toolbar menu, the Tool options chip, the Tool options panel or the Tools panel.',
  ],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'The steps of a longer task are shown one by one.', use: 'Wizard' },
  ],
  rules: [
    'The dialog reads its open state from the app and takes no props.',
    'Every option of the tool starts ticked. Unticked options stay as they are when the preset is applied. Colours are never saved.',
    'Save stays disabled until the name has text and one option is ticked.',
  ],
  a11y: ['The dialog traps focus, closes with Escape and returns focus. The checklist is a labelled group.'],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'PresetDialog is the form that names and saves a preset of a tool.',
  },
  example: `import { PresetDialog } from '../PresetDialog';

const Overlays = () => <PresetDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
