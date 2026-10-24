/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Edits one default for new assets, with the right input for its kind: a size, a number, a palette, a platform or a switch.',
  useWhen: [
    'The App settings or the Project settings let the owner set what a new asset starts with.',
    'One editor must serve both pages, so they look and behave the same.',
  ],
  avoidWhen: [{ case: 'The value belongs to an asset that exists.', use: 'AssetControl' }],
  rules: [
    'It takes the field, the value to show and a change handler. It stores nothing.',
    'A number can be cleared while typing, and only a whole number is passed on.',
  ],
  a11y: ['Each input carries a label that names the default it sets.'],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'DefaultsEditor is the input for one default value of a new asset.',
  },
  example: `import { DefaultsEditor } from '../DefaultsEditor';

const SizeDefault = ({ value, save }: { value: unknown; save: (next: unknown) => void }) => (
  <DefaultsEditor field="size" value={value} onChange={save} />
);
`,
  propsHash: '614a159dc8c91c8f',
} satisfies ComponentUsage;

export { usage };
