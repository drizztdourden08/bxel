/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lists the presets of one tool with a preview of the brush, a summary of the saved options, the Alt key of the first five and a menu to rename, duplicate, update, move and delete.',
  useWhen: [
    'A panel lets the person apply, save and manage the presets of the active tool.',
  ],
  avoidWhen: [
    { case: 'The person only picks a preset while drawing.', use: 'OptionsToolbar' },
    { case: 'The person names and ticks the options of a new preset.', use: 'Dialog' },
  ],
  rules: [
    'It takes the tool. Built in presets can be duplicated but not changed or deleted.',
    'The preset whose saved values equal the current options is marked In use. The others have Apply.',
    'Save as preset opens the preset dialog for the active tool. Delete asks with a second press.',
  ],
  a11y: ['The list is a labelled region of list items. Each row menu is named with the preset.'],
  tree: {
    path: ['a value the user sets', 'a short list of items with the same few fields'],
    rule: 'PresetList is the short list of saved option sets of one tool.',
  },
  example: `import { PresetList } from '../PresetList';

const Example = () => <PresetList tool="pencil" />;
`,
  propsHash: '6d480f419f1bd748',
} satisfies ComponentUsage;

export { usage };
