/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Keeps named pixel selections in the file and brings one back with the combine mode the owner picks.',
  useWhen: [
    'The owner wants to keep a selection under a name and use it again later.',
    'The owner wants to add a kept selection to, or take it away from, the live selection.',
  ],
  avoidWhen: [
    { case: 'A picked set of sprites is saved on a sheet.', use: 'OptionsToolbar' },
    { case: 'A message only informs and asks nothing.', use: 'Toast' },
  ],
  rules: [
    'The dialog reads the open sprite and the live selection, so it takes no props.',
    'A saved selection belongs to the sprite and is saved with the file, so the assistant sees it too.',
    'A saved selection made for another canvas size shows as stale and cannot be loaded.',
  ],
  a11y: [
    'The list is a labelled list and every button names the selection it acts on.',
    'Enter in the name field saves.',
  ],
  tree: {
    path: ['feedback', 'a dialog', 'in pixels'],
    rule: 'SelectionNamesDialog saves, loads and deletes named selections of the open sprite.',
  },
  example: `import { SelectionNamesDialog } from '../SelectionNamesDialog';

const Host = () => <SelectionNamesDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
