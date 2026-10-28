/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws one option of a tool as a row with its name, its sentence, its control and a reset, and a preview of the brush, from the option model.',
  useWhen: [
    'A panel lists the options of the active tool, such as the Tool options panel or the options under the active row of the Tools panel.',
  ],
  avoidWhen: [
    { case: 'The options of the tool sit in a docked bar.', use: 'OptionsToolbar' },
    { case: 'A form row is not an option of a tool.', use: 'FormRow' },
  ],
  rules: [
    'It takes the option spec and reads and writes its value through the option model, so a change is validated, announced once and remembered for the tool.',
    'A number is a slider with a field, a choice is a joined row of icons or words with a hint on each, a toggle is a switch and an action is a button.',
    'A disabled option shows its reason in place of its description.',
  ],
  a11y: ['Each control carries the name of the option. An icon choice names every segment in its hint.'],
  tree: {
    path: ['a value the user sets', 'one option in a long form, with a reset'],
    rule: 'OptionRow is one option of a tool in a long form, with its reset.',
  },
  example: `import { OptionRow } from '../OptionControls';
import type { OptionSpec } from '../../editor/tool-options/tool-options.type';

const Example = ({ spec }: { spec: OptionSpec }) => <OptionRow spec={spec} />;
`,
  propsHash: '0000000000000000',
} satisfies ComponentUsage;

export { usage };
