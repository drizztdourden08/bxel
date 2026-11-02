/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the shared facts of several project files picked together: how many, which kinds, and the tags they share.',
  useWhen: ['The owner picks Properties with more than one file or folder selected in the project browser.'],
  avoidWhen: [{ case: 'Only one file is picked.', use: 'SubjectCard' }],
  rules: [
    'The view reads its own store, so it takes no props.',
    'A tag typed here goes on every taggable file in the selection, and removing a tag takes it off every one.',
  ],
  a11y: ['Shared and partial tags are separate labelled groups, and Enter adds the typed tag.'],
  tree: {
    path: ['a value the user sets', 'free text or a number', 'free words, as tags'],
    rule: 'ManyProperties summarises a multi selection and edits its tags together.',
  },
  example: `import { ManyProperties } from '../../views/ManyProperties';

const Page = () => <ManyProperties />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
